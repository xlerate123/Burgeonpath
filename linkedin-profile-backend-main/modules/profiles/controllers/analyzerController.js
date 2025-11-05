import path from "path";
import fs from "fs";
import multer from "multer";
import Tesseract from "tesseract.js";
import { createRequire } from "module";
import { getAIAnalysis, formatAnalysisToText } from "../AI_analysis.js";
import { updateProfile, getProfile } from "../utils/firestore.js";
import axios from "axios";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

// ---------------- Multer setup for file uploads ----------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), "uploads/resumes");
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${req.user.uid}-${Date.now()}${ext}`);
  },
});

export const upload = multer({ storage });

// ---------------- Helper to extract sections ----------------
const findSectionText = (text, startKeyword, endKeywords) => {
  try {
    const startIndex = text.search(new RegExp(`\\b${startKeyword}\\b`, "i"));
    if (startIndex === -1) return null;

    const textAfterStart = text.substring(startIndex + startKeyword.length);
    let endIndex = -1;
    for (const keyword of endKeywords) {
      const currentEndIndex = textAfterStart.search(new RegExp(`\\b${keyword}\\b`, "i"));
      if (currentEndIndex !== -1 && (endIndex === -1 || currentEndIndex < endIndex)) {
        endIndex = currentEndIndex;
      }
    }
    const sectionText = endIndex !== -1 ? textAfterStart.substring(0, endIndex) : textAfterStart;
    return sectionText.trim().replace(/\s\s+/g, " ");
  } catch {
    return null;
  }
};

const makeApiCall = async (provider, payload) => {
  if (provider === "claude") {
    const response = await axios.post(
      "https://api.anthropic.com/v1/messages",
      payload,
      {
        headers: {
          "x-api-key": process.env.CLAUDE_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } else if (provider === "openai") {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } else {
    throw new Error("Unsupported provider");
  }
};

// ---------------- Main Single Route Controller ----------------
export const analyzeProfileController = async (req, res) => {
  try {
    let profileData = {};

    // ---------------- 1️⃣ Handle file upload ----------------
    if (req.file) {
      const filePath = path.join("uploads/resumes", req.file.filename);
      const ext = path.extname(req.file.originalname).toLowerCase();
      let extractedText = "";

      if (ext === ".pdf") {
        const pdfBuffer = fs.readFileSync(filePath);
        const pdfData = await pdfParse(pdfBuffer);
        extractedText = pdfData.text || "";
      } else if ([".png", ".jpg", ".jpeg"].includes(ext)) {
        const ocrResult = await Tesseract.recognize(filePath, "eng");
        extractedText = ocrResult.data.text || "";
      } else {
        return res.status(400).json({ error: "Unsupported file format" });
      }

      const lines = extractedText.split("\n").filter((l) => l.trim() !== "");
      const name = lines[0]?.trim() || "Name not found";
      const headline = lines[1]?.trim() || "Headline not found";

      const allSectionKeywords = [
        "About",
        "Experience",
        "Education",
        "Licenses & certifications",
        "Skills",
        "Projects",
        "Honors & awards",
        "Languages",
        "Volunteer Experience",
        "Publications",
      ];

      const getEndKeywords = (start) =>
        allSectionKeywords.filter((k) => k.toLowerCase() !== start.toLowerCase());

      const structuredData = {};
      for (const section of allSectionKeywords) {
        structuredData[section.replace(/\s+/g, "_").toLowerCase()] = findSectionText(
          extractedText,
          section,
          getEndKeywords(section)
        );
      }

      profileData = {
        name,
        headline,
        structuredData,
        rawText: extractedText,
        summary: extractedText.slice(0, 500) + (extractedText.length > 500 ? "..." : ""),
        fileType: ext,
        parsedAt: new Date(),
      };

      // Save to Firestore
      await updateProfile(req.user.uid, {
        resumePath: `/${filePath}`,
        resumeData: profileData,
        updatedAt: new Date(),
      });
    } else if (req.body) {
      // ---------------- 2️⃣ Handle form submission ----------------
      profileData = req.body;
    } else {
      return res.status(400).json({ error: "No file or form data provided" });
    }

    // ---------------- 3️⃣ Run AI Analysis ----------------
    const aiAnalysis = await getAIAnalysis(profileData);
    const formattedAnalysis = formatAnalysisToText(aiAnalysis);

    res.status(200).json({
      success: true,
      message: "Profile analyzed successfully",
      profileData,
      aiAnalysis: formattedAnalysis,
    });
  } catch (err) {
    console.error("Error analyzing profile:", err);
    res.status(500).json({ error: err.message });
  }
};

// Updated chatModifyController with better error handling and response parsing

export const chatModifyController = async (req, res) => {
  try {
    const { userRequest, originalAnalysis } = req.body;

    console.log("Chat modify request received:", { userRequest, hasAnalysis: !!originalAnalysis });

    if (!userRequest || !originalAnalysis) {
      return res.status(400).json({ 
        success: false,
        error: "Missing userRequest or originalAnalysis" 
      });
    }

    // Enhanced prompt for better responses
    const fullPrompt = `You are a helpful AI career coach assistant. The user has received a profile analysis and wants to modify it.

Original Analysis:
${typeof originalAnalysis === 'string' ? originalAnalysis : JSON.stringify(originalAnalysis, null, 2)}

User's Request: "${userRequest}"

Provide a helpful, conversational response and if applicable, suggest specific improvements. Keep your tone friendly and professional.

Respond in JSON format with these fields:
{
  "chatbotResponse": "Your conversational response to the user",
  "updatedReport": {} // Only include if you're modifying the analysis structure
}`;

    let result;
    let chatbotResponse = "";
    let updatedReport = {};

    // Try Claude first
    try {
      console.log("Attempting Claude API...");
      const claudePayload = {
        model: "claude-3-haiku-20240307",
        max_tokens: 2048,
        messages: [{ role: "user", content: fullPrompt }],
      };
      
      const claudeResponse = await makeApiCall("claude", claudePayload);
      
      // Claude returns content in a different format
      const content = claudeResponse?.content?.[0]?.text || "";
      console.log("Claude raw response:", content.substring(0, 200));
      
      // Try to parse as JSON
      try {
        const parsed = JSON.parse(content);
        chatbotResponse = parsed.chatbotResponse || content;
        updatedReport = parsed.updatedReport || {};
      } catch {
        // If not JSON, use the raw text as response
        chatbotResponse = content || "I received your request but couldn't generate a proper response.";
      }
      
    } catch (claudeError) {
      console.error("Claude API failed:", claudeError.message);
      
      // Fallback to OpenAI
      try {
        console.log("Falling back to OpenAI...");
        const openAiPayload = {
          model: "gpt-4o-mini",
          messages: [
            { 
              role: "system", 
              content: "You are a helpful AI career coach. Respond in JSON format with 'chatbotResponse' and optionally 'updatedReport' fields." 
            },
            { role: "user", content: fullPrompt },
          ],
          response_format: { type: "json_object" },
        };
        
        const openaiResponse = await makeApiCall("openai", openAiPayload);
        const content = openaiResponse?.choices?.[0]?.message?.content || "";
        console.log("OpenAI raw response:", content.substring(0, 200));
        
        try {
          const parsed = JSON.parse(content);
          chatbotResponse = parsed.chatbotResponse || content;
          updatedReport = parsed.updatedReport || {};
        } catch {
          chatbotResponse = content || "I received your request but couldn't generate a proper response.";
        }
        
      } catch (openaiError) {
        console.error("OpenAI API also failed:", openaiError.message);
        throw new Error("Both AI providers are unavailable. Please try again later.");
      }
    }

    // Ensure we have a valid response
    if (!chatbotResponse || chatbotResponse.trim().length === 0) {
      chatbotResponse = "I understood your request. However, I don't have specific suggestions at this moment. Could you provide more details about what you'd like to improve?";
    }

    console.log("Sending response:", { 
      hasResponse: !!chatbotResponse, 
      hasUpdate: Object.keys(updatedReport).length > 0 
    });

    res.json({
      success: true,
      chatbotResponse: chatbotResponse,
      updatedReport: updatedReport,
    });

  } catch (err) {
    console.error("Error in chatModify:", err);
    res.status(500).json({ 
      success: false,
      error: err.message || "An error occurred processing your request"
    });
  }
};
