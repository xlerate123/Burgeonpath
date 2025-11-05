import { db } from "../auth/src/config/firebase.js";

// Firestore-backed session storage
export const adminSessions = {
  // Create a new session
  async set(token, sessionData) {
    try {
      await db.collection('admin_sessions').doc(token).set({
        ...sessionData,
        loginTime: new Date(),
        expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 days
      });
      console.log('✅ Session saved to Firestore:', token);
      return true;
    } catch (error) {
      console.error('❌ Failed to save session:', error);
      return false;
    }
  },

  // Get a session
  async get(token) {
    try {
      const doc = await db.collection('admin_sessions').doc(token).get();
      
      if (!doc.exists) {
        return null;
      }

      const sessionData = doc.data();
      
      // Check if session expired
      if (sessionData.expiresAt.toDate() < new Date()) {
        console.log('⏰ Session expired:', token);
        await this.delete(token);
        return null;
      }

      return sessionData;
    } catch (error) {
      console.error('❌ Failed to get session:', error);
      return null;
    }
  },

  // Delete a session
  async delete(token) {
    try {
      await db.collection('admin_sessions').doc(token).delete();
      console.log('🗑️ Session deleted from Firestore:', token);
      return true;
    } catch (error) {
      console.error('❌ Failed to delete session:', error);
      return false;
    }
  },

  // Get all active sessions (for admin dashboard)
  async getAll() {
    try {
      const snapshot = await db.collection('admin_sessions')
        .where('expiresAt', '>', new Date())
        .get();
      
      const sessions = [];
      snapshot.forEach(doc => {
        sessions.push({ token: doc.id, ...doc.data() });
      });
      
      return sessions;
    } catch (error) {
      console.error('❌ Failed to get all sessions:', error);
      return [];
    }
  },

  // Clean up expired sessions (run periodically)
  async cleanup() {
    try {
      const snapshot = await db.collection('admin_sessions')
        .where('expiresAt', '<', new Date())
        .get();
      
      const batch = db.batch();
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
      console.log(`🧹 Cleaned up ${snapshot.size} expired sessions`);
      return snapshot.size;
    } catch (error) {
      console.error('❌ Failed to cleanup sessions:', error);
      return 0;
    }
  }
};

// Auto-cleanup expired sessions every hour
setInterval(() => {
  adminSessions.cleanup();
}, 60 * 60 * 1000);