// aianalysis.js
import fetch from "node-fetch";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

// ==================== API HELPERS ====================

async function makeApiCall(provider, payload) {
  let retries = 3;
  let delay = 1000;

  while (retries > 0) {
    try {
      if (provider === "openai") return await callOpenAI(payload);
      if (provider === "claude") return await callClaude(payload);
      throw new Error(`Unknown provider: ${provider}`);
    } catch (error) {
      console.warn(`${provider} API failed, retrying... (${retries})`, error.message);
      retries--;
      if (retries > 0) await new Promise((r) => setTimeout(r, delay));
      delay *= 2;
    }
  }
}

async function callOpenAI(payload) {
  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenAI API Error: ${response.status} ${text}`);
  }

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}

async function callClaude(payload) {
  const response = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Claude API Error: ${response.status} ${text}`);
  }

  const data = await response.json();
  return parseJsonResponse(data.content[0].text);
}

function parseJsonResponse(text) {
  const mdMatch = text.match(/```json\n([\s\S]*?)\n```/);
  if (mdMatch && mdMatch[1]) {
    try {
      return JSON.parse(mdMatch[1]);
    } catch {}
  }
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start !== -1 && end > start) {
    try {
      return JSON.parse(text.substring(start, end + 1));
    } catch {}
  }
  return JSON.parse(text);
}

// ==================== MAIN ANALYSIS FUNCTION ====================

export async function getAIAnalysis(profileData) {
  try {
    // Step 1: Create unified text version from PDF or structured input
    const combinedText = profileData.rawText || JSON.stringify(profileData, null, 2);

    // Step 2: Creative Coach (OpenAI)
    const creativePrompt = `As a creative career coach, analyze the candidate’s profile text below.
Focus on writing style, storytelling, and unique personal branding. Encourage improvements.
Output must be JSON with key "creativeAnalysis".
Profile Text:
${combinedText}`;

    const creativePayload = {
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: creativePrompt }],
      response_format: { type: "json_object" },
    };

    // Step 3: Analytical Recruiter (Claude)
    const analyticalPrompt = `You are a recruiter analyzing this candidate’s profile for clarity, relevance, and professional tone.
Identify missing keywords or structural issues. Output valid JSON under key "analyticalAnalysis".
Profile Text:
${combinedText}`;

    const analyticalPayload = {
      model: "claude-3-haiku-20240307",
      max_tokens: 2048,
      messages: [{ role: "user", content: analyticalPrompt }],
    };

    console.log("Running creative + analytical models...");

    const [creativeResult, analyticalResult] = await Promise.all([
      makeApiCall("openai", creativePayload).catch((e) => ({ error: e.message })),
      makeApiCall("claude", analyticalPayload).catch((e) => ({ error: e.message })),
    ]);

    // Step 4: Reviewer Synthesis (OpenAI)
    const reviewerSystemPrompt = `
You are a senior AI career consultant. Combine the creative and analytical analyses into one refined JSON.
Be encouraging and professional. Strictly output JSON with this schema:
{
  "inferredCareerGoal": "string",
  "overallFeedback": "string",
  "writingStyleFeedback": {
    "overallTone": "string",
    "suggestions": "string"
  },
  "skillAnalysis": "string",
  "recommendations": {
    "about": [{ "suggestion": "string", "reasoning": "string" }],
    "experience": [{ "suggestion": "string", "reasoning": "string" }],
    "education": [{ "suggestion": "string", "reasoning": "string" }],
    "skills": [{ "suggestion": "string", "reasoning": "string" }]
  },
  "errorsFound": {
    "spelling": ["array of strings"],
    "grammar": ["array of strings"]
  },
  "machineLearningModelUsed": "GPT-4o Mini & Claude 3 Haiku"
}
`;

    const reviewerUserPrompt = `Creative Coach Analysis: ${JSON.stringify(
      creativeResult,
      null,
      2
    )}
Analytical Recruiter Analysis: ${JSON.stringify(
      analyticalResult,
      null,
      2
    )}
Synthesize these into one combined JSON report.`;

    const reviewerPayload = {
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: reviewerSystemPrompt },
        { role: "user", content: reviewerUserPrompt },
      ],
      response_format: { type: "json_object" },
    };

    console.log("Synthesizing reviewer model...");
    const finalAnalysis = await makeApiCall("openai", reviewerPayload);

    return finalAnalysis;
  } catch (error) {
    console.error("Error generating AI analysis:", error);
    throw new Error("Failed to analyze with AI models.");
  }
}

// ==================== TEXT FORMATTER ====================

export function formatAnalysisToText(analysis) {
  let output = "--- AI Career Coach Analysis ---\n\n";

  if (analysis.inferredCareerGoal)
    output += `**Inferred Career Goal:**\n${analysis.inferredCareerGoal}\n\n`;
  if (analysis.overallFeedback)
    output += `**Overall Feedback:**\n${analysis.overallFeedback}\n\n`;

  if (analysis.writingStyleFeedback) {
    output += `**Writing Style Feedback:**\n`;
    if (analysis.writingStyleFeedback.overallTone)
      output += `- Overall Tone: ${analysis.writingStyleFeedback.overallTone}\n`;
    if (analysis.writingStyleFeedback.suggestions)
      output += `- Suggestions: ${analysis.writingStyleFeedback.suggestions}\n\n`;
  }

  if (analysis.skillAnalysis)
    output += `**Skill Analysis:**\n${analysis.skillAnalysis}\n\n`;

  output += "--- Recommendations ---\n\n";
  if (analysis.recommendations) {
    for (const section in analysis.recommendations) {
      const recs = analysis.recommendations[section];
      if (recs?.length) {
        const title = section.charAt(0).toUpperCase() + section.slice(1);
        output += `**${title} Section:**\n`;
        recs.forEach((r) => {
          output += `- Suggestion: ${r.suggestion}\n  - Reasoning: ${r.reasoning}\n`;
        });
        output += "\n";
      }
    }
  }

  output += "--- Errors Found ---\n\n";
  const { spelling = [], grammar = [] } = analysis.errorsFound || {};
  output += `**Spelling:**\n- ${
    spelling.length ? spelling.join(", ") : "No spelling errors found."
  }\n\n`;
  output += `**Grammar:**\n- ${
    grammar.length ? grammar.join("\n- ") : "No grammar errors found."
  }\n\n`;

  return output;
}
