export const adminSchema = {
  email: 'string',
  name: 'string',
  role: 'string', // 'super_admin' or 'support_admin'
  createdAt: 'timestamp',
  lastLogin: 'timestamp',
  isActive: 'boolean',
  createdBy: 'string'
};

export const userSchema = {
  name: 'string',
  email: 'string',
  agentId: 'string', // ✅ Links to agent
  referralCode: 'string',
  background: 'string',
  quizScore: 'number',
  level: 'number',
  agentId: 'string',
  isBlocked: 'boolean',
  phone: 'string',
  createdAt: 'timestamp'
};

export const agentSchema = {
  name: 'string',
  email: 'string',
  altEmail: 'string',
  emailDomain: 'string',
  referralCode: 'string', // ✅ NEW
  referralCodeActive: 'boolean', // ✅ NEW
  phone: 'string',
  authorityName: 'string',
  users: 'array',
  commissionRate: 'number',
  createdAt: 'timestamp'
};

export const subscriptionSchema = {
  userId: 'string',
  plan: 'string',
  price: 'number',
  startDate: 'string',
  endDate: 'string',
  couponCode: 'string',
  status: 'string'
};

export const couponSchema = {
  code: 'string',
  discount: 'number',
  maxUses: 'number',
  usedCount: 'number',
  status: 'string',
  description: 'string',
  createdAt: 'timestamp'
};

export const certificationSchema = {
  userId: 'string',
  type: 'string',
  date: 'string',
  status: 'string',
  submittedAt: 'timestamp',
  reviewedBy: 'string',
  reviewedAt: 'timestamp',
  notes: 'string'
};