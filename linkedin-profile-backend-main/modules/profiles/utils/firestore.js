import { db } from "../../auth/src/config/firebase.js"; // reuse same db

// ✅ Create Profile doc with NEW fields only
export const createProfile = async (
  uid,
  fullName,
  careerGoal,
  city,
  behavior,
  linkedinPurpose,
  linkedinUrl,
  additionalInfo = "" // optional
) => {
  await db.collection("Profiles").doc(uid).set({
    fullName,
    careerGoal,
    city,
    behavior,
    linkedinPurpose,
    linkedinUrl,
    additionalInfo, // optional
    createdAt: new Date()
  });
};

// ✅ Get Profile doc
export const getProfile = async (uid) => {
  const profileDoc = await db.collection("Profiles").doc(uid).get();
  return profileDoc.exists ? profileDoc.data() : null;
};

// ✅ Update Profile doc
export const updateProfile = async (uid, data) => {
  await db.collection("Profiles").doc(uid).update({
    ...data,
    updatedAt: new Date()
  });
};

// ✅ Delete Profile doc
export const deleteProfile = async (uid) => {
  await db.collection("Profiles").doc(uid).delete();
};
