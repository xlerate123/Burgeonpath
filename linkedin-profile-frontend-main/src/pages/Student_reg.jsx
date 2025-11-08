import { useState } from 'react';

const API_URL = process.env.VITE_API_URL; // API URL from environment variable

export default function StudentSignup() {
  const [step, setStep] = useState(1); // 1: Referral Code, 2: Registration Form
  const [referralCode, setReferralCode] = useState('');
  const [email, setEmail] = useState('');
  const [validatedAgent, setValidatedAgent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Registration form fields
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  // Step 1: Validate Referral Code and Email Domain
  const handleValidateReferral = async () => {
    if (!referralCode || !email) {
      setError('Please enter both referral code and email');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/v1/admin/validate-referral`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referralCode: referralCode.trim().toUpperCase(),
          email: email.trim().toLowerCase()
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setValidatedAgent(data.agent);
        setStep(2);
      } else {
        setError(data.error || 'Failed to validate referral code');
      }
    } catch (err) {
      console.error('Referral validation error:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Complete Registration
  const handleCompleteRegistration = async () => {
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password strength
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          phone: formData.phone.trim(),
          password: formData.password,
          referralCode: referralCode.trim().toUpperCase(),
          agentId: validatedAgent.id
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert(`✅ Registration successful!\n\nWelcome to ${validatedAgent.name}!\nYou can now login with your credentials.`);
        window.location.href = '/login';
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.2s'
  };

  const buttonStyle = {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.2s'
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '480px',
        background: 'white',
        borderRadius: '16px',
        padding: '40px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            fontWeight: 'bold',
            color: 'white'
          }}>
            CL
          </div>
          <h1 style={{ margin: '0 0 8px', fontSize: '28px', color: '#1a202c' }}>
            Student Registration
          </h1>
          <p style={{ margin: 0, color: '#718096', fontSize: '14px' }}>
            {step === 1 ? 'Enter your referral code to get started' : `Completing registration for ${validatedAgent?.name}`}
          </p>
        </div>

        {/* Progress Indicator */}
        <div style={{ 
          display: 'flex', 
          gap: '8px', 
          marginBottom: '32px',
          justifyContent: 'center'
        }}>
          <div style={{
            width: '40px',
            height: '4px',
            borderRadius: '2px',
            background: step >= 1 ? '#667eea' : '#e2e8f0'
          }} />
          <div style={{
            width: '40px',
            height: '4px',
            borderRadius: '2px',
            background: step >= 2 ? '#667eea' : '#e2e8f0'
          }} />
        </div>

        {/* Error Display */}
        {error && (
          <div style={{
            padding: '12px',
            background: '#fee',
            border: '1px solid #fcc',
            borderRadius: '8px',
            marginBottom: '20px',
            color: '#c33',
            fontSize: '14px'
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Step 1: Referral Code Validation */}
        {step === 1 && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '600', 
                color: '#2d3748',
                fontSize: '14px'
              }}>
                Referral Code *
              </label>
              <input
                type="text"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                placeholder="e.g., COL-A3F9K"
                style={{
                  ...inputStyle,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontWeight: '600'
                }}
              />
              <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#718096' }}>
                Enter the referral code provided by your institution
              </p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '600', 
                color: '#2d3748',
                fontSize: '14px'
              }}>
                Institutional Email *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
                placeholder="your.name@college.edu"
                style={inputStyle}
              />
              <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#718096' }}>
                Use your official institutional email address
              </p>
            </div>

            <button
              onClick={handleValidateReferral}
              disabled={loading || !referralCode || !email}
              style={{
                ...buttonStyle,
                background: loading ? '#cbd5e0' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: (loading || !referralCode || !email) ? 0.6 : 1
              }}
            >
              {loading ? '⏳ Validating...' : '✓ Verify & Continue'}
            </button>
          </div>
        )}

        {/* Step 2: Complete Registration */}
        {step === 2 && validatedAgent && (
          <div>
            <div style={{
              padding: '16px',
              background: 'linear-gradient(135deg, #e6f7ff 0%, #f0e6ff 100%)',
              borderRadius: '8px',
              marginBottom: '24px',
              border: '2px solid #667eea'
            }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#2d3748', marginBottom: '4px' }}>
                ✅ Verified for:
              </div>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#667eea' }}>
                {validatedAgent.name}
              </div>
              <div style={{ fontSize: '12px', color: '#718096', marginTop: '4px' }}>
                Email: {email}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#2d3748', fontSize: '14px' }}>
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleFormChange}
                  style={{...inputStyle, padding: '10px', fontSize: '14px'}}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#2d3748', fontSize: '14px' }}>
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleFormChange}
                  style={{...inputStyle, padding: '10px', fontSize: '14px'}}
                />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#2d3748', fontSize: '14px' }}>
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleFormChange}
                placeholder="+1 (555) 000-0000"
                style={{...inputStyle, padding: '10px', fontSize: '14px'}}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#2d3748', fontSize: '14px' }}>
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleFormChange}
                style={{...inputStyle, padding: '10px', fontSize: '14px'}}
              />
              <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#718096' }}>
                Minimum 8 characters
              </p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#2d3748', fontSize: '14px' }}>
                Confirm Password *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleFormChange}
                style={{...inputStyle, padding: '10px', fontSize: '14px'}}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => { setStep(1); setError(''); }}
                style={{
                  flex: '0 0 auto',
                  padding: '14px 20px',
                  background: 'transparent',
                  color: '#667eea',
                  border: '2px solid #667eea',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                ← Back
              </button>
              <button
                onClick={handleCompleteRegistration}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: loading ? '#cbd5e0' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? '⏳ Creating Account...' : '✓ Complete Registration'}
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ 
          marginTop: '32px', 
          paddingTop: '24px', 
          borderTop: '1px solid #e2e8f0',
          textAlign: 'center'
        }}>
          <p style={{ margin: 0, fontSize: '13px', color: '#718096' }}>
            Already have an account?{' '}
            <a href="/login" style={{ color: '#667eea', fontWeight: '600', textDecoration: 'none' }}>
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}