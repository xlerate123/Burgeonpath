import {
  createProfile,
  getProfile,
  updateProfile,
  deleteProfile
} from "../utils/firestore.js";

export const createProfileController = async (req, res) => {
  try {
    const { uid } = req.user;
    const { fullName, careerGoal, city, behavior, linkedinPurpose, linkedinUrl, additionalInfo } = req.body;

    await createProfile(uid, fullName, careerGoal, city, behavior, linkedinPurpose, linkedinUrl, additionalInfo);
    res.status(201).json({ success: true, message: "Profile created" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getProfileController = async (req, res) => {
  try {
    const { uid } = req.user;
    const profile = await getProfile(uid);

    if (!profile) return res.status(404).json({ success: false, message: "Profile not found" });
    res.json({ success: true, profile });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateProfileController = async (req, res) => {
  try {
    const { uid } = req.user;
    const data = req.body; // contains fullName, careerGoal, etc.

    // If file uploaded via multer, add resumePath
    if (req.file) {
      data.resumePath = `/uploads/resumes/${req.file.filename}`;
    }

    await updateProfile(uid, data);
    res.json({ success: true, message: "Profile updated", resumePath: data.resumePath || null });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


export const deleteProfileController = async (req, res) => {
  try {
    const { uid } = req.user;
    await deleteProfile(uid);

    res.json({ success: true, message: "Profile deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
