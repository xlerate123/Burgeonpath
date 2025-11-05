import { admin, db } from "../auth/src/config/firebase.js";
import crypto from 'crypto';
import bcrypt from 'bcryptjs'; // ✅ Import bcrypt for password hashing
import { adminSessions } from './sessionStore.js';

// ========== REFERRAL CODE GENERATION ==========
/**
 * Generates a unique referral code for an agent
 * Format: COLLEGE-XXXXX (e.g., COLLEGE-A3F9K)
 */
const generateReferralCode = async (collegeName) => {
  const prefix = collegeName.substring(0, 3).toUpperCase();
  let referralCode;
  let isUnique = false;
  
  // Keep generating until we get a unique code
  while (!isUnique) {
    const randomStr = crypto.randomBytes(3).toString('hex').toUpperCase();
    referralCode = `${prefix}-${randomStr}`;
    
    // Check if code already exists
    const existingCode = await db.collection('agents')
      .where('referralCode', '==', referralCode)
      .limit(1)
      .get();
    
    isUnique = existingCode.empty;
  }
  
  return referralCode;
};

/**
 * Extracts domain from email address
 * Example: student@college.edu -> college.edu
 */
const extractDomain = (email) => {
  if (!email || typeof email !== 'string') return null;
  const parts = email.split('@');
  return parts.length === 2 ? parts[1].toLowerCase() : null;
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔐 Admin login attempt for:', email);

    // Find admin by email
    const adminQuery = await db.collection('admins')
      .where('email', '==', email)
      .where('isActive', '==', true)
      .limit(1)
      .get();

    if (adminQuery.empty) {
      console.log('Admin not found or inactive:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const adminDoc = adminQuery.docs[0];
    const adminData = adminDoc.data();

    console.log('👤 Admin found:', {
      email: adminData.email,
      role: adminData.role,
      hasPasswordHash: !!adminData.passwordHash
    });

    // ✅ SECURE PASSWORD VERIFICATION WITH BCRYPT
    if (!adminData.passwordHash) {
      console.log('❌ No password hash found for admin');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('🔐 Verifying password with bcrypt...');
    const isPasswordValid = await bcrypt.compare(password, adminData.passwordHash);
    
    console.log('Password verification result:', {
      providedPassword: password ? '***' : 'empty',
      isValid: isPasswordValid
    });

    if (!isPasswordValid) {
      console.log('❌ Invalid password for admin:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create a simple session token
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const sessionData = {
      adminId: adminDoc.id,
      email: adminData.email,
      name: adminData.name,
      role: adminData.role,
      loginTime: new Date().toISOString()
    };

    // Store session in Firestore
    await adminSessions.set(sessionToken, sessionData);
    console.log('✅ Session created:', sessionToken);

    // Set session cookie
    res.cookie("admin_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 5 * 1000, // 5 days
    });

    // Update last login in database
    await db.collection('admins').doc(adminDoc.id).update({
      lastLogin: new Date()
    });

    console.log('✅ Admin login successful');

    res.json({
      success: true,
      admin: {
        id: adminDoc.id,
        email: adminData.email,
        name: adminData.name,
        role: adminData.role
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Login failed' 
    });
  }
};

// ✅ UPDATED: Create new admin with password hashing
export const createAdmin = async (req, res) => {
  try {
    const { email, name, role, password } = req.body;

    if (!['super_admin', 'support_admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    // Validate password strength
    if (!password || password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    // Check if admin exists
    const existingAdmin = await db.collection('admins')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (!existingAdmin.empty) {
      return res.status(400).json({ error: 'Admin already exists' });
    }

    // ✅ HASH PASSWORD BEFORE STORING
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create Firebase user
    const userRecord = await admin.auth().createUser({
      email,
      password: password, // Keep plain for Firebase Auth
      displayName: name
    });

    // Create admin document with hashed password
    const adminData = {
      email,
      name,
      role,
      passwordHash, // ✅ Store hashed password
      createdAt: new Date(),
      lastLogin: null,
      isActive: true,
      createdBy: req.admin.adminId
    };

    await db.collection('admins').doc(userRecord.uid).set(adminData);

    console.log(`✅ Admin created with hashed password: ${email}`);

    res.status(201).json({
      message: 'Admin created successfully',
      admin: { id: userRecord.uid, ...adminData }
    });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({ error: 'Failed to create admin' });
  }
};

// ✅ NEW: Update admin password
export const updateAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const adminId = req.admin.adminId;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters long' });
    }

    // Get admin data
    const adminDoc = await db.collection('admins').doc(adminId).get();
    if (!adminDoc.exists) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    const adminData = adminDoc.data();

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, adminData.passwordHash);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const saltRounds = 12;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password in database
    await db.collection('admins').doc(adminId).update({
      passwordHash: newPasswordHash,
      passwordUpdatedAt: new Date()
    });

    console.log('✅ Admin password updated successfully for:', adminData.email);

    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Update admin password error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to update password' 
    });
  }
};

// ✅ NEW: Reset another admin's password (super admin only)
export const resetAdminPassword = async (req, res) => {
  try {
    const { adminId, newPassword } = req.body;

    if (!adminId || !newPassword) {
      return res.status(400).json({ error: 'Admin ID and new password are required' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters long' });
    }

    // Get target admin data
    const targetAdminDoc = await db.collection('admins').doc(adminId).get();
    if (!targetAdminDoc.exists) {
      return res.status(404).json({ error: 'Target admin not found' });
    }

    // Hash new password
    const saltRounds = 12;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password in database
    await db.collection('admins').doc(adminId).update({
      passwordHash: newPasswordHash,
      passwordUpdatedAt: new Date(),
      passwordResetBy: req.admin.adminId,
      passwordResetAt: new Date()
    });

    console.log(`✅ Admin password reset by ${req.admin.email} for: ${targetAdminDoc.data().email}`);

    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Reset admin password error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to reset password' 
    });
  }
};

// ✅ NEW: Utility function to hash existing passwords (run once to migrate)
export const hashExistingPasswords = async (req, res) => {
  try {
    // Only allow super admin to run this
    if (req.admin.role !== 'super_admin') {
      return res.status(403).json({ error: 'Only super admin can run this operation' });
    }

    const adminsSnapshot = await db.collection('admins').get();
    let updatedCount = 0;

    for (const doc of adminsSnapshot.docs) {
      const adminData = doc.data();
      
      // Skip if already has password hash
      if (adminData.passwordHash) {
        console.log(`ℹ️  Admin ${adminData.email} already has password hash`);
        continue;
      }

      // Determine default password based on role
      let defaultPassword;
      if (adminData.role === 'super_admin') {
        defaultPassword = 'Super@admin123';
      } else {
        defaultPassword = 'Support@123';
      }

      // Hash the password
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(defaultPassword, saltRounds);

      // Update the admin document
      await db.collection('admins').doc(doc.id).update({
        passwordHash,
        passwordMigratedAt: new Date()
      });

      console.log(`✅ Password hashed for: ${adminData.email}`);
      updatedCount++;
    }

    res.json({
      success: true,
      message: `Password hashing completed. ${updatedCount} admin accounts updated.`
    });
  } catch (error) {
    console.error('Hash existing passwords error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to hash existing passwords' 
    });
  }
};

// Keep all your existing functions below (they remain unchanged)
export const adminLogout = (req, res) => {
  const sessionToken = req.cookies?.admin_session;
  
  if (sessionToken) {
    adminSessions.delete(sessionToken);
    console.log('✅ Session deleted:', sessionToken, 'Remaining sessions:', adminSessions.size);
  }
  
  res.clearCookie("admin_session", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict"
  });
  
  console.log('✅ Admin logout - session cleared');
  return res.status(200).json({ 
    success: true,
    message: "Admin logged out successfully" 
  });
};

export const getAdminProfile = async (req, res) => {
  try {
    res.json({
      id: req.admin.adminId,
      email: req.admin.email,
      name: req.admin.name,
      role: req.admin.role,
      lastLogin: req.admin.lastLogin
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

// Dashboard stats
export const getDashboardStats = async (req, res) => {
  try {
    const [usersSnapshot, agentsSnapshot, subscriptionsSnapshot, couponsSnapshot] = await Promise.all([
      db.collection('users').get(),
      db.collection('agents').get(),
      db.collection('subscriptions').get(),
      db.collection('coupons').get()
    ]);

    // Calculate total revenue
    let totalRevenue = 0;
    const coupons = [];
    couponsSnapshot.forEach(doc => coupons.push(doc.data()));

    subscriptionsSnapshot.forEach(doc => {
      const sub = doc.data();
      const coupon = coupons.find(c => c.code === sub.couponCode && c.status === 'active');
      const discount = coupon ? coupon.discount : 0;
      const amountPaid = sub.price - (sub.price * (discount / 100));
      totalRevenue += amountPaid;
    });

    // Subscription breakdown
    const subscriptionPlans = {};
    subscriptionsSnapshot.forEach(doc => {
      const plan = doc.data().plan;
      subscriptionPlans[plan] = (subscriptionPlans[plan] || 0) + 1;
    });

    res.json({
      totalUsers: usersSnapshot.size,
      subscribedUsers: subscriptionsSnapshot.size,
      totalAgents: agentsSnapshot.size,
      revenue: totalRevenue,
      subscriptionBreakdown: subscriptionPlans
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
};

// Get all users with filtering
export const getUsers = async (req, res) => {
  try {
    const { search, background, blocked, subscribed, sort = 'name' } = req.query;
    
    console.log('📊 Get users with filters:', { search, background, blocked, subscribed, sort });

    const snapshot = await db.collection('users').get();
    let users = [];
    
    snapshot.forEach(doc => {
      const userData = doc.data();
      const fullName = `${userData.firstName || ''} ${userData.lastName || ''}`.trim();
      
      users.push({ 
        id: doc.id, 
        name: fullName || userData.email,
        email: userData.email || '',
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        background: userData.background || 'Not specified',
        quizScore: userData.quizScore || 0,
        level: userData.level || 1,
        agentId: userData.agentId || null,
        referralCode: userData.referralCode || null, // ✅ NEW: Show referral code used
        isBlocked: userData.isBlocked || false,
        phone: userData.phone || '',
        dob: userData.dob || '',
        paymentStatus: userData.paymentStatus || 'unpaid',
        paymentDetails: userData.paymentDetails || {},
        createdAt: userData.createdAt || new Date()
      });
    });

    console.log(`📈 Found ${users.length} users before filtering`);

    // Apply filters (same as before)
    if (search) {
      const searchLower = search.toLowerCase();
      users = users.filter(user => {
        const userName = (user.name || '').toLowerCase();
        const userEmail = (user.email || '').toLowerCase();
        const userPhone = (user.phone || '');
        const userFirstName = (user.firstName || '').toLowerCase();
        const userLastName = (user.lastName || '').toLowerCase();
        
        return userName.includes(searchLower) || 
               userEmail.includes(searchLower) || 
               userPhone.includes(search) ||
               userFirstName.includes(searchLower) ||
               userLastName.includes(searchLower);
      });
    }

    if (background && background !== 'all') {
      users = users.filter(user => 
        (user.background || '').toLowerCase() === background.toLowerCase()
      );
    }

    if (blocked && blocked !== 'all') {
      const isBlocked = blocked === 'blocked';
      users = users.filter(user => user.isBlocked === isBlocked);
    }

    if (subscribed && subscribed !== 'all') {
      if (subscribed === 'subscribed') {
        users = users.filter(user => user.paymentStatus === 'paid');
      } else {
        users = users.filter(user => user.paymentStatus !== 'paid');
      }
    }

    // Sort
    users.sort((a, b) => {
      if (sort === 'name') {
        return (a.name || '').localeCompare(b.name || '');
      }
      if (sort === 'background') {
        return (a.background || '').localeCompare(b.background || '');
      }
      if (sort === 'quiz') {
        return (b.quizScore || 0) - (a.quizScore || 0);
      }
      return 0;
    });

    console.log(`✅ Returning ${users.length} users`);
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Get user detail
export const getUserDetail = async (req, res) => {
  try {
    const userDoc = await db.collection('users').doc(req.params.id).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = userDoc.data();
    
    // ✅ Transform to include full name
    const fullName = `${userData.firstName || ''} ${userData.lastName || ''}`.trim();
    const transformedUser = {
      id: userDoc.id,
      name: fullName || userData.email,
      ...userData
    };

    // Get user's subscription (using paymentStatus)
    const subscriptionInfo = userData.paymentStatus === 'paid' ? {
      id: 'auto_generated',
      plan: 'Premium', // You might want to store this separately
      price: 0, // You might want to store this
      startDate: userData.paymentDetails?.verifiedAt || new Date().toISOString(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
      status: 'active'
    } : null;

    // Get user's agent (if you have agent data)
    let agent = null;
    if (userData.agentId) {
      const agentDoc = await db.collection('agents').doc(userData.agentId).get();
      if (agentDoc.exists) {
        agent = { id: agentDoc.id, ...agentDoc.data() };
      }
    }

    res.json({
      user: transformedUser,
      subscription: subscriptionInfo,
      agent
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};
// Block/unblock user
export const blockUser = async (req, res) => {
  try {
    const { isBlocked } = req.body;
    
    await db.collection('users').doc(req.params.id).update({
      isBlocked: Boolean(isBlocked),
      updatedAt: new Date()
    });

    res.json({ 
      message: `User ${isBlocked ? 'blocked' : 'unblocked'} successfully`,
      isBlocked 
    });
  } catch (error) {
    console.error('Block user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

// Get all agents
export const getAgents = async (req, res) => {
  try {
    const { search, sort = 'name' } = req.query;
    
    const snapshot = await db.collection('agents').get();
    let agents = [];
    
    snapshot.forEach(doc => {
      const agentData = doc.data();
      agents.push({ 
        id: doc.id,
        name: agentData.name || 'Unknown Agent',
        email: agentData.email || '',
        authorityName: agentData.authorityName || '',
        commissionRate: agentData.commissionRate || 10,
        emailDomain: agentData.emailDomain || '', // ✅ NEW
        referralCode: agentData.referralCode || '', // ✅ NEW
        referralCodeActive: agentData.referralCodeActive !== false, // ✅ NEW
        users: agentData.users || [],
        totalStudents: agentData.totalStudents || 0, // ✅ NEW
        isActive: agentData.isActive !== false,
        phone: agentData.phone || '',
        altEmail: agentData.altEmail || '',
        createdAt: agentData.createdAt || new Date(),
        ...agentData
      });
    });

    if (search) {
      const searchLower = search.toLowerCase();
      agents = agents.filter(agent => {
        const agentName = (agent.name || '').toLowerCase();
        const agentEmail = (agent.email || '').toLowerCase();
        const agentId = (agent.id || '').toLowerCase();
        const referralCode = (agent.referralCode || '').toLowerCase();
        
        return agentName.includes(searchLower) || 
               agentEmail.includes(searchLower) || 
               agentId.includes(searchLower) ||
               referralCode.includes(searchLower);
      });
    }

    agents.sort((a, b) => {
      if (sort === 'name') return (a.name || '').localeCompare(b.name || '');
      if (sort === 'students') return (b.totalStudents || 0) - (a.totalStudents || 0);
      if (sort === 'rate') return (b.commissionRate || 0) - (a.commissionRate || 0);
      return 0;
    });

    res.json(agents);
  } catch (error) {
    console.error('Get agents error:', error);
    res.status(500).json({ error: 'Failed to fetch agents' });
  }
};

// Get agent performance
export const getAgentPerformance = async (req, res) => {
  try {
    const agentId = req.params.id;
    
    console.log('📊 Getting performance for agent:', agentId);

    // 1. Get agent data
    const agentDoc = await db.collection('agents').doc(agentId).get();
    if (!agentDoc.exists) {
      console.log('❌ Agent not found:', agentId);
      return res.status(404).json({ error: 'Agent not found' });
    }

    const agentData = agentDoc.data();
    console.log('👤 Agent data:', agentData);

    // 2. Get agent's users (from users collection where agentId matches)
    const usersSnapshot = await db.collection('users')
      .where('agentId', '==', agentId)
      .get();

    const userIds = [];
    const users = [];
    
    usersSnapshot.forEach(doc => {
      userIds.push(doc.id);
      const userData = doc.data();
      users.push({
        id: doc.id,
        name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || userData.email,
        email: userData.email,
        paymentStatus: userData.paymentStatus || 'unpaid',
        phone: userData.phone || '',
        ...userData
      });
    });

    console.log(`👥 Found ${userIds.length} users for agent:`, userIds);

    // 3. Get profile data for these users (optional - for additional info)
    const profiles = [];
    if (userIds.length > 0) {
      const profilePromises = userIds.map(userId => 
        db.collection('profiles').doc(userId).get()
      );
      const profileDocs = await Promise.all(profilePromises);
      
      profileDocs.forEach((profileDoc, index) => {
        if (profileDoc.exists) {
          profiles.push({
            userId: userIds[index],
            ...profileDoc.data()
          });
        }
      });
      console.log(`📝 Found ${profiles.length} user profiles`);
    }

    // 4. Calculate performance metrics
    let totalRevenue = 0;
    let paidUserCount = 0;
    let totalUsers = userIds.length;

    users.forEach(user => {
      if (user.paymentStatus === 'paid') {
        // Calculate revenue - you can adjust this based on your pricing
        const subscriptionPrice = 12000; // Default price
        totalRevenue += subscriptionPrice;
        paidUserCount++;
      }
    });

    // 5. Calculate commission
    const commissionRate = agentData.commissionRate || 10;
    const commissionPaid = totalRevenue * (commissionRate / 100);

    console.log('📈 Performance calculation:', {
      totalUsers,
      paidUserCount,
      totalRevenue,
      commissionRate: `${commissionRate}%`,
      commissionPaid
    });

    res.json({
      agent: { 
        id: agentDoc.id, 
        ...agentData 
      },
      performance: {
        totalRevenue,
        totalOriginalRevenue: totalRevenue, // Same since no discounts in calculation yet
        commissionPaid,
        userCount: totalUsers,
        paidUserCount,
        conversionRate: totalUsers > 0 ? (paidUserCount / totalUsers * 100).toFixed(1) + '%' : '0%'
      },
      users: users.map(user => {
        const userProfile = profiles.find(profile => profile.userId === user.id);
        return {
          ...user,
          profile: userProfile || null
        };
      })
    });
  } catch (error) {
    console.error('❌ Get agent performance error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch agent performance',
      details: error.message 
    });
  }
};

// ========== AGENT MANAGEMENT WITH REFERRAL SYSTEM ==========

/**
 * ✅ UPDATED: Create agent with referral code and domain
 */
export const createAgent = async (req, res) => {
  try {
    const { name, email, altEmail, phone, authorityName, commissionRate, emailDomain } = req.body;
    
    console.log('📝 Creating agent with data:', { name, email, emailDomain });

    // Validate required fields
    if (!name || !email || !emailDomain) {
      return res.status(400).json({ 
        error: 'Name, email, and email domain are required' 
      });
    }

    // Validate email domain format
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/;
    if (!domainRegex.test(emailDomain)) {
      return res.status(400).json({ 
        error: 'Invalid email domain format. Example: college.edu' 
      });
    }

    // Check if agent with this email exists
    const existingAgent = await db.collection('agents')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (!existingAgent.empty) {
      return res.status(400).json({ error: 'Agent with this email already exists' });
    }

    // Check if domain is already registered
    const existingDomain = await db.collection('agents')
      .where('emailDomain', '==', emailDomain.toLowerCase())
      .limit(1)
      .get();

    if (!existingDomain.empty) {
      return res.status(400).json({ 
        error: 'This email domain is already registered to another agent' 
      });
    }

    // Generate unique referral code
    const referralCode = await generateReferralCode(name);
    console.log('🎟️ Generated referral code:', referralCode);

    const agentData = {
      name,
      email,
      altEmail: altEmail || '',
      phone: phone || '',
      authorityName: authorityName || '',
      commissionRate: Number(commissionRate) || 10,
      emailDomain: emailDomain.toLowerCase(), // ✅ NEW: Store domain
      referralCode, // ✅ NEW: Store referral code
      referralCodeActive: true, // ✅ NEW: Can be disabled later
      users: [],
      totalStudents: 0, // ✅ NEW: Track student count
      createdAt: new Date(),
      createdBy: req.admin.adminId
    };

    const agentRef = await db.collection('agents').add(agentData);
    
    console.log('✅ Agent created successfully with ID:', agentRef.id);

    // ✅ TODO: Send email to agent with referral code
    // You can implement email sending here using nodemailer or similar
    
    res.status(201).json({
      success: true,
      message: 'Agent created successfully',
      agent: { 
        id: agentRef.id, 
        ...agentData,
        // Return referral code for admin to share
        referralCodeInfo: {
          code: referralCode,
          domain: emailDomain,
          message: 'Share this code with students from this institution'
        }
      }
    });
  } catch (error) {
    console.error('❌ Create agent error:', error);
    res.status(500).json({ 
      error: 'Failed to create agent',
      details: error.message 
    });
  }
};


// Get revenue analytics
export const getRevenueAnalytics = async (req, res) => {
  try {
    const agentsSnapshot = await db.collection('agents').get();
    const agents = [];
    
    for (const doc of agentsSnapshot.docs) {
      const agentData = doc.data();
      
      // Calculate performance for each agent
      const usersSnapshot = await db.collection('users')
        .where('agentId', '==', doc.id)
        .get();

      const userIds = usersSnapshot.docs.map(userDoc => userDoc.id);
      
      let agentRevenue = 0;
      if (userIds.length > 0) {
        const subscriptionsSnapshot = await db.collection('subscriptions')
          .where('userId', 'in', userIds)
          .get();

        subscriptionsSnapshot.forEach(subDoc => {
          const sub = subDoc.data();
          agentRevenue += sub.price;
        });
      }

      const commissionPaid = agentRevenue * (agentData.commissionRate / 100);

      agents.push({
        id: doc.id,
        ...agentData,
        totalRevenue: agentRevenue,
        commissionPaid
      });
    }

    res.json(agents);
  } catch (error) {
    console.error('Revenue analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch revenue data' });
  }
};

/**
 * ✅ NEW: Validate referral code before registration
 */
export const validateReferralCode = async (req, res) => {
  try {
    const { referralCode, email } = req.body;

    console.log('🔍 Validating referral code:', { referralCode, email });

    if (!referralCode || !email) {
      return res.status(400).json({ 
        success: false,
        error: 'Referral code and email are required' 
      });
    }

    // Extract domain from student email
    const studentDomain = extractDomain(email);
    if (!studentDomain) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid email format' 
      });
    }

    console.log('📧 Student domain:', studentDomain);

    // Find agent by referral code
    const agentQuery = await db.collection('agents')
      .where('referralCode', '==', referralCode.toUpperCase())
      .where('referralCodeActive', '==', true)
      .limit(1)
      .get();

    if (agentQuery.empty) {
      console.log('❌ Invalid or inactive referral code');
      return res.status(404).json({ 
        success: false,
        error: 'Invalid or inactive referral code' 
      });
    }

    const agentDoc = agentQuery.docs[0];
    const agentData = agentDoc.data();

    console.log('✅ Agent found:', agentData.name);

    // Verify domain matches
    if (agentData.emailDomain !== studentDomain) {
      console.log('❌ Domain mismatch:', {
        expected: agentData.emailDomain,
        received: studentDomain
      });
      
      return res.status(403).json({ 
        success: false,
        error: `Email domain does not match. Please use an email from ${agentData.emailDomain}`,
        expectedDomain: agentData.emailDomain,
        receivedDomain: studentDomain
      });
    }

    console.log('✅ Referral code and domain validated successfully');

    // Return agent info for registration
    res.json({
      success: true,
      message: 'Referral code validated successfully',
      agent: {
        id: agentDoc.id,
        name: agentData.name,
        authorityName: agentData.authorityName,
        emailDomain: agentData.emailDomain,
        commissionRate: agentData.commissionRate
      }
    });
  } catch (error) {
    console.error('❌ Validate referral code error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to validate referral code',
      details: error.message 
    });
  }
};

/**
 * ✅ NEW: Regenerate referral code for an agent
 */
export const regenerateReferralCode = async (req, res) => {
  try {
    const agentId = req.params.id;

    const agentDoc = await db.collection('agents').doc(agentId).get();
    if (!agentDoc.exists) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    const agentData = agentDoc.data();
    const newReferralCode = await generateReferralCode(agentData.name);

    await db.collection('agents').doc(agentId).update({
      referralCode: newReferralCode,
      referralCodeRegeneratedAt: new Date(),
      referralCodeRegeneratedBy: req.admin.adminId
    });

    console.log('🔄 Referral code regenerated for agent:', agentData.name);

    res.json({
      success: true,
      message: 'Referral code regenerated successfully',
      newReferralCode
    });
  } catch (error) {
    console.error('Regenerate referral code error:', error);
    res.status(500).json({ error: 'Failed to regenerate referral code' });
  }
};

/**
 * ✅ NEW: Toggle referral code active status
 */
export const toggleReferralCodeStatus = async (req, res) => {
  try {
    const agentId = req.params.id;
    const { active } = req.body;

    await db.collection('agents').doc(agentId).update({
      referralCodeActive: Boolean(active),
      referralCodeStatusUpdatedAt: new Date(),
      referralCodeStatusUpdatedBy: req.admin.adminId
    });

    res.json({
      success: true,
      message: `Referral code ${active ? 'activated' : 'deactivated'} successfully`,
      active
    });
  } catch (error) {
    console.error('Toggle referral code error:', error);
    res.status(500).json({ error: 'Failed to update referral code status' });
  }
};

// Get subscribed users
export const getSubscribedUsers = async (req, res) => {
  try {
    const { search, sort = 'name' } = req.query;
    
    // Get all subscriptions with user data
    const subscriptionsSnapshot = await db.collection('subscriptions').get();
    const subscribedUsers = [];

    for (const subDoc of subscriptionsSnapshot.docs) {
      const sub = subDoc.data();
      const userDoc = await db.collection('users').doc(sub.userId).get();
      
      if (userDoc.exists) {
        subscribedUsers.push({
          subscription: { id: subDoc.id, ...sub },
          user: { id: userDoc.id, ...userDoc.data() }
        });
      }
    }

    // Apply search filter
    let filteredUsers = subscribedUsers;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredUsers = subscribedUsers.filter(item => 
        item.user.name.toLowerCase().includes(searchLower) ||
        item.user.email.toLowerCase().includes(searchLower)
      );
    }

    // Sort
    filteredUsers.sort((a, b) => {
      if (sort === 'name') return a.user.name.localeCompare(b.user.name);
      if (sort === 'revenue') return b.subscription.price - a.subscription.price;
      return 0;
    });

    res.json(filteredUsers);
  } catch (error) {
    console.error('Get subscribed users error:', error);
    res.status(500).json({ error: 'Failed to fetch subscribed users' });
  }
};

// Get coupons
export const getCoupons = async (req, res) => {
  try {
    const snapshot = await db.collection('coupons').get();
    const coupons = [];
    
    snapshot.forEach(doc => {
      coupons.push({ id: doc.id, ...doc.data() });
    });

    res.json(coupons);
  } catch (error) {
    console.error('Get coupons error:', error);
    res.status(500).json({ error: 'Failed to fetch coupons' });
  }
};

// Create coupon
export const createCoupon = async (req, res) => {
  try {
    const { code, discount, maxUses, description } = req.body;
    
    const couponData = {
      code,
      discount: Number(discount),
      maxUses: Number(maxUses),
      usedCount: 0,
      status: 'active',
      description: description || '',
      createdAt: new Date()
    };

    const couponRef = await db.collection('coupons').add(couponData);
    
    res.status(201).json({
      message: 'Coupon created successfully',
      coupon: { id: couponRef.id, ...couponData }
    });
  } catch (error) {
    console.error('Create coupon error:', error);
    res.status(500).json({ error: 'Failed to create coupon' });
  }
};

// Get certifications
export const getCertifications = async (req, res) => {
  try {
    const snapshot = await db.collection('certifications').get();
    const certifications = [];
    
    for (const doc of snapshot.docs) {
      const cert = doc.data();
      const userDoc = await db.collection('users').doc(cert.userId).get();
      
      if (userDoc.exists) {
        certifications.push({
          id: doc.id,
          ...cert,
          user: { id: userDoc.id, ...userDoc.data() }
        });
      }
    }

    res.json(certifications);
  } catch (error) {
    console.error('Get certifications error:', error);
    res.status(500).json({ error: 'Failed to fetch certifications' });
  }
};

// Review certification
export const reviewCertification = async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    await db.collection('certifications').doc(req.params.id).update({
      status,
      reviewedBy: req.admin.adminId,
      reviewedAt: new Date(),
      notes: notes || ''
    });

    res.json({ 
      message: `Certification ${status} successfully`,
      status 
    });
  } catch (error) {
    console.error('Review certification error:', error);
    res.status(500).json({ error: 'Failed to review certification' });
  }
};