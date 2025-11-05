import { createUser, getUser, updateUserProfile } from "../utils/firestore.js";
import { admin } from "../config/firebase.js";

// 🔹 Unified user creation handler
const createOrUpdateUser = async (userData, authMethod) => {
  const { uid, email, name, phone, background, level, quizScore, agentId, googleId } = userData;
  
  // Check if user exists
  let user = await getUser(uid);
  
  if (!user) {
    // Create new user with unified schema
    user = await createUser(uid, {
      email,
      name: name || '',
      authProvider: authMethod,
      googleId: authMethod === 'google' ? googleId : null,
      phone: phone || '',
      background: background || '',
      level: level || 1,
      quizScore: quizScore || 0,
      agentId: agentId || null,
      emailVerified: authMethod === 'google', // Google emails are pre-verified
      isBlocked: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return { user, isNewUser: true };
  }
  
  // Update existing user if needed
  if (authMethod === 'google' && !user.googleId) {
    await updateUserProfile(uid, {
      googleId,
      authProvider: 'google',
      updatedAt: new Date()
    });
  }
  
  return { user, isNewUser: false };
};

// 🔹 Email/Password Registration
export const registerWithEmail = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, background, password } = req.body;

    // 1. Create user in Firebase Auth
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`.trim(),
      emailVerified: false,
    });

    // 2. Create user profile with unified schema
    const { user } = await createOrUpdateUser({
      uid: userRecord.uid,
      email,
      name: `${firstName} ${lastName}`.trim(),
      phone: phone || '',
      background: background || 'Other',
      authProvider: 'email_password'
    }, 'email_password');

    // 3. Generate custom token for session
    const customToken = await admin.auth().createCustomToken(userRecord.uid);

    res.status(201).json({ 
      success: true, 
      message: "User registered successfully",
      user,
      customToken 
    });
  } catch (error) {
    console.error("Email registration error:", error);
    
    // Clean up Firebase user if Firestore creation fails
    if (error.uid) {
      try {
        await admin.auth().deleteUser(error.uid);
      } catch (deleteError) {
        console.error("Error cleaning up Firebase user:", deleteError);
      }
    }
    
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// 🔹 Google OAuth Registration/Login
export const handleGoogleAuth = async (req, res) => {
  try {
    const { idToken } = req.body;
    
    // Verify Google ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;

    // Create or update user with unified schema
    const { user, isNewUser } = await createOrUpdateUser({
      uid,
      email,
      name: name || '',
      googleId: decodedToken.sub,
      authProvider: 'google',
      // Google users need to complete profile
      phone: '',
      background: '',
      level: 1,
      quizScore: 0
    }, 'google');

    // Generate custom token for session
    const customToken = await admin.auth().createCustomToken(uid);

    res.json({ 
      success: true, 
      user,
      isNewUser,
      customToken 
    });
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// 🔹 Complete user profile (for Google users and profile updates)
export const completeUserProfile = async (req, res) => {
  try {
    const { uid, phone, background } = req.body;

    if (!uid) {
      return res.status(400).json({ 
        success: false, 
        message: "User ID is required" 
      });
    }

    const updatedUser = await updateUserProfile(uid, {
      phone: phone || '',
      background: background || '',
      updatedAt: new Date()
    });

    res.json({ 
      success: true, 
      message: "Profile completed successfully",
      user: updatedUser 
    });
  } catch (error) {
    console.error("Profile completion error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// 🔹 Admin user creation
export const createUserByAdmin = async (req, res) => {
  try {
    const { email, name, phone, background, level, quizScore, agentId } = req.body;

    // 1. Create user in Firebase Auth with temporary password
    const temporaryPassword = Math.random().toString(36).slice(-10);
    const userRecord = await admin.auth().createUser({
      email,
      password: temporaryPassword,
      displayName: name,
      emailVerified: false,
    });

    // 2. Create user profile with unified schema
    const { user } = await createOrUpdateUser({
      uid: userRecord.uid,
      email,
      name,
      phone: phone || '',
      background: background || 'Other',
      level: level || 1,
      quizScore: quizScore || 0,
      agentId: agentId || null,
      authProvider: 'admin_created',
      isBlocked: false,
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: req.user.uid
    }, 'admin_created');

    // TODO: Send setup email to user with temporary password

    res.status(201).json({ 
      success: true, 
      message: "User created successfully",
      user 
    });
  } catch (error) {
    console.error("Admin user creation error:", error);
    
    // Clean up on failure
    if (error.uid) {
      try {
        await admin.auth().deleteUser(error.uid);
      } catch (deleteError) {
        console.error("Error cleaning up Firebase user:", deleteError);
      }
    }
    
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// 🔹 Session login (existing - keep this)
export const sessionLogin = async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) return res.status(400).json({ message: "Missing ID token" });

  try {
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });

    res.cookie("session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: expiresIn,
    });

    return res.status(200).json({ message: "Session created" });
  } catch (err) {
    console.error("Error in sessionLogin:", err);
    return res.status(401).json({ message: "Invalid ID token" });
  }
};

// 🔹 Logout (existing - keep this)
export const logout = (req, res) => {
  res.clearCookie("session");
  return res.status(200).json({ message: "Logged out" });
};