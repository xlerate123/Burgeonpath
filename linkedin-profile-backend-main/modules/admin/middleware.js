import { db } from "../auth/src/config/firebase.js";

export const authenticateToken = async (req, res, next) => {
  try {
    const sessionToken = req.cookies?.admin_session;
    
    console.log('🔍 Auth check - Token:', sessionToken ? 'present' : 'missing');
    
    if (!sessionToken) {
      return res.status(401).json({ error: 'No session provided' });
    }

    // ✅ FIX: Get session from Firestore instead of memory
    const sessionDoc = await db.collection('admin_sessions').doc(sessionToken).get();
    
    if (!sessionDoc.exists) {
      console.log('❌ Session not found in Firestore');
      return res.status(401).json({ error: 'Invalid session' });
    }

    const sessionData = sessionDoc.data();
    
    // ✅ Check if session is expired (5 days max)
    const sessionAge = Date.now() - new Date(sessionData.loginTime).getTime();
    const maxAge = 5 * 24 * 60 * 60 * 1000; // 5 days
    
    if (sessionAge > maxAge) {
      console.log('❌ Session expired');
      await db.collection('adminSessions').doc(sessionToken).delete();
      return res.status(401).json({ error: 'Session expired' });
    }

    console.log('✅ Session found:', sessionData.email);

    // Verify admin still exists and is active
    const adminDoc = await db.collection('admins').doc(sessionData.adminId).get();
    
    if (!adminDoc.exists) {
      console.log('❌ Admin document not found');
      await db.collection('adminSessions').doc(sessionToken).delete();
      return res.status(403).json({ error: 'Admin not found' });
    }

    const adminData = adminDoc.data();
    
    if (!adminData.isActive) {
      console.log('❌ Admin is inactive');
      await db.collection('adminSessions').doc(sessionToken).delete();
      return res.status(403).json({ error: 'Admin access revoked' });
    }

    // Attach admin info to request
    req.admin = {
      adminId: sessionData.adminId,
      email: sessionData.email,
      name: sessionData.name,
      role: sessionData.role,
      lastLogin: adminData.lastLogin
    };
    
    console.log('✅ Auth successful:', req.admin.email, req.admin.role);
    
    next();
  } catch (error) {
    console.error('❌ Auth error:', error);
    return res.status(401).json({ error: 'Invalid session' });
  }
};

// Keep your existing role-based middleware (it's correct)
export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    console.log('🔐 Role check:', req.admin?.role, 'Required:', allowedRoles);
    
    if (!req.admin || !allowedRoles.includes(req.admin.role)) {
      return res.status(403).json({ 
        error: `Access denied. Required roles: ${allowedRoles.join(', ')}` 
      });
    }
    
    console.log('✅ Role authorized');
    next();
  };
};

export const requireSuperAdmin = requireRole(['super_admin']);
export const requireSupportAdmin = requireRole(['support_admin', 'super_admin']);
export const requireAnyAdmin = requireRole(['super_admin', 'support_admin']);

// Remove the verifyAdmin function as it's redundant with authenticateToken