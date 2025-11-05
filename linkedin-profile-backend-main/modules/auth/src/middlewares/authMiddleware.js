import { admin } from "../config/firebase.js";

const verifyToken = async (req, res, next) => {
  const sessionCookie = req.cookies?.session;

  if (!sessionCookie) {
    return res.status(401).json({ message: "No session cookie provided" });
  }

  try {
    const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);
    req.user = decodedClaims;
    next();
  } catch (error) {
    console.error("Session cookie verification failed:", error);
    return res.status(401).json({ message: "Invalid or expired session" });
  }
};

export default verifyToken;
