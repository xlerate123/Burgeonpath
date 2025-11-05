import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chart, DoughnutController, ArcElement, Legend, Tooltip } from 'chart.js';
import axios from 'axios';

// Register Chart.js Components
Chart.register(DoughnutController, ArcElement, Legend, Tooltip);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
  baseURL: `${API_URL}/api/v1/admin`,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor for handling 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ========== CSV EXPORT FUNCTION ==========
const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }

  try {
    // Get headers from the first object
    const headers = Object.keys(data[0]);

    // Create CSV content
    let csvContent = headers.join(',') + '\n';

    // Add rows
    data.forEach(row => {
      const values = headers.map(header => {
        let value = row[header] || '';
        // Handle values that might contain commas or quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
          value = `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      });
      csvContent += values.join(',') + '\n';
    });

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    alert(`CSV exported successfully: ${filename}.csv`);
  } catch (error) {
    console.error('Export error:', error);
    alert('Failed to export CSV');
  }
};

// ========== STYLES ==========
const GlobalStyles = () => (
  <style>{`
    /* Your existing styles remain the same */
    :root{
      --accent-main: #0077B5;
      --accent1: #0090E0;
      --accent2: #005A90;
      --accent-grad: linear-gradient(135deg, var(--accent1), var(--accent2));
      --bg: #ffffff;
      --page-bg: #f3f5f7;
      --card-bg: #ffffff;
      --text: #0b1220;
      --muted: #374151;
      --glass: rgba(255,255,255,0.95);
      --shadow-1: 0 6px 18px rgba(17,24,39,0.06);
      --shadow-2: 0 12px 36px rgba(17,24,39,0.08);
      --radius: 12px;
      --ui-font: "Open Sans", "Roboto", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
      --card-outline: rgba(3,6,23,0.12);
      --green: #10b981;
      --red: #ef4444;
      --orange: #f97316;
    }
    *{box-sizing:border-box}
    html,body{height:100%;margin:0;background:var(--page-bg);font-family:var(--ui-font);-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;color:var(--text)}
    a{color:inherit}
    button{font-family:inherit}
    .gradient-text {
      background: var(--accent-grad);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      font-weight:700;
    }
    .app-wrap{
      max-width:1180px;
      margin:28px auto;
      display:grid;
      grid-template-columns: 1fr;
      gap:18px;
      padding: 0 20px;
    }
    .btn {
      display:inline-flex;
      align-items:center;
      justify-content:center;
      gap:8px;
      padding:11px 14px;
      border-radius:10px;
      border:0;
      font-weight:700;
      cursor:pointer;
      transition: background-color 0.1s, box-shadow 0.1s, transform 0.1s;
    }
    .btn-small { padding: 8px 10px; font-size: 13px; }
    .btn-primary {
      background: var(--accent-grad);
      color:white;
      box-shadow: 0 10px 30px rgba(0,119,181,0.12);
    }
    .btn-ghost {
      background:transparent;
      border:1px solid rgba(15,23,42,0.06);
      color:var(--text);
    }
    header.app-header {
      display:flex;
      align-items:center;
      justify-content:space-between;
      padding:14px 18px;
      background:var(--card-bg);
      border-radius:12px;
      box-shadow:var(--shadow-1);
      border:1px solid var(--card-outline);
    }
    .brand {display:flex; gap:12px; align-items:center}
    .brand .logo {
      width:44px;height:44px;border-radius:10px; display:grid; place-items:center; font-weight:800; color:white;
      background: var(--accent-grad);
      box-shadow:0 8px 20px rgba(0,119,181,0.14);
      font-size:18px;
    }
    .brand .title {font-size:16px;font-weight:700;color:var(--text)}
    .brand .subtitle {font-size:13px;color:var(--muted)}
    .header-actions {display:flex;align-items:center;gap:12px}
    .avatar {width:42px;height:42px;border-radius:50%;display:grid;place-items:center;background:#f6f5fb;color:var(--accent-main);font-weight:700;border:1px solid rgba(15,23,42,0.04)}
    .hamburger {
      width:44px;height:44px;border-radius:10px;display:grid;place-items:center;border:1px solid rgba(15,23,42,0.06);cursor:pointer;background:transparent;
    }
    .menu-dropdown {position: absolute; right:28px; top:78px; width:200px; background:var(--card-bg); border-radius:10px; box-shadow:var(--shadow-2); padding:8px; display:none; z-index:60; border:1px solid var(--card-outline)}
    .menu-dropdown a {display:block;padding:10px;border-radius:8px;color:var(--text); font-weight:600; text-decoration: none;}
    .menu-dropdown a:hover{background:rgba(15,23,42,0.03)}
    .menu-dropdown.show { display: block; }
    .dashboard-main {
      margin-top:18px;
      display:grid;
      grid-template-columns: 1fr 360px;
      gap:18px;
      align-items:start;
    }
    .panel {
      background:var(--card-bg);
      padding:18px;
      border-radius:12px;
      box-shadow:var(--shadow-1);
      border:1px solid var(--card-outline);
    }
    .stats-grid {
      display:grid;
      grid-template-columns: repeat(4, 1fr);
      gap:14px;
    }
    .stat {
      padding:16px;
      border-radius:12px;
      background: linear-gradient(180deg, rgba(230, 245, 255, 0.98), rgba(255,255,255,0.95)); 
      cursor:pointer;
      transition:transform .18s ease, box-shadow .18s ease;
      border:1px solid rgba(15,23,42,0.035);
    }
    .stat:hover { transform:translateY(-6px); box-shadow:var(--shadow-2); }
    .stat .label{font-weight:700;color:var(--muted);font-size:13px}
    .stat .num{font-size:28px;font-weight:800;margin-top:6px;color:var(--text)}
    #revenueCard {
      background: linear-gradient(180deg, rgba(240, 255, 240, 0.98), rgba(255, 255, 255, 0.95));
      border:1px solid rgba(16, 185, 129, 0.1);
      cursor: pointer; 
    }
    #revenueCard:hover { transform:translateY(-6px); box-shadow:var(--shadow-2); }
    #revenueCard .num { color: var(--green); }
    .quick {display:flex;gap:10px;flex-wrap:wrap}
    .chip {padding:8px 12px;border-radius:999px;border:1px solid rgba(15,23,42,0.05);background:transparent;font-weight:700;cursor:pointer;color:var(--text)}
    .controls {display:flex;gap:10px;align-items:center;margin-bottom:14px;flex-wrap:wrap}
    .controls .search {flex:1;display:flex;gap:8px}
    .controls input[type="search"], .controls select {
      padding:10px;border-radius:10px;border:1px solid rgba(15,23,42,0.06);width:100%;color:var(--text);
      background-color: #fff;
    }
    table {width:100%;border-collapse:collapse;background:transparent}
    thead th {text-align:left;padding:12px 14px;background:#fbfbfd;font-size:13px;color:var(--muted);border-bottom:1px solid rgba(15,23,42,0.04)}
    tbody tr td {padding:12px 14px;border-bottom:1px solid rgba(15,23,42,0.03);color:var(--text)}
    tbody tr:hover td {background:rgba(15,23,42,0.02)}
    .level-circles { display: flex; gap: 4px; }
    .level-circle {
      width: 12px; height: 12px; border-radius: 50%; border: 1px solid var(--accent-main);
      background-color: transparent;
      transition: background-color 0.2s;
    }
    .level-circle.filled { background-color: var(--accent-main); }
    .block-btn {
        background: var(--red);
        color: white;
        padding: 4px 8px;
        border-radius: 6px;
        font-weight: 600;
        cursor: pointer;
        font-size: 11px;
        border: none;
    }
    .unblock-btn {
        background: var(--green);
        color: white;
        padding: 4px 8px;
        border-radius: 6px;
        font-weight: 600;
        cursor: pointer;
        font-size: 11px;
        border: none;
    }
    .cert-approved { color: var(--green); font-weight: 600; }
    .cert-pending { color: var(--orange); font-weight: 600; cursor: pointer; }
    .agent-list {display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px}
    .agent-item {padding:12px;border-radius:10px;background:linear-gradient(180deg,rgba(255,255,255,0.98),rgba(240,248,255,0.95));border:1px solid var(--card-outline);cursor:default;} 
    .agent-item h4{margin:0 0 6px;color:var(--text)}
    .agent-item p{margin:0;color:var(--text);font-size:14px}
    .modal-backdrop {position:fixed;inset:0;background:linear-gradient(rgba(3,6,23,0.45),rgba(3,6,23,0.45));display:none;align-items:center;justify-content:center;z-index:120}
    .modal-backdrop.show { display: flex; }
    .modal-card {width:820px;max-width:94%;background:var(--card-bg);padding:20px;border-radius:14px;box-shadow:var(--shadow-2);border:1px solid var(--card-outline)}
    .levels {display:flex;gap:10px;margin-top:16px}
    .level {flex:1;padding:12px;border-radius:10px;background:#f8f7fb;border:1px solid rgba(15,23,42,0.04);text-align:center;color:var(--text)} 
    .level.active {background:var(--accent-grad);color:white;box-shadow:0 10px 30px rgba(0,119,181,0.12)}
    .students-page-wrap { display:grid; grid-template-columns: 300px 1fr; gap:18px; align-items:start; margin-top:12px; }
    .student-left-card { padding:18px; border-radius:12px; background:linear-gradient(180deg,rgba(255,255,255,0.98),rgba(240,248,255,0.95)); border:1px solid var(--card-outline); box-shadow:var(--shadow-1); } 
    .auth-field{display:flex;flex-direction:column;gap:8px;margin-bottom:12px}
    .auth-field label{font-size:13px;color:var(--muted);font-weight:600}
    .auth-field input, .auth-field select, .auth-field textarea{
      padding:12px 12px;border-radius:10px;border:1px solid rgba(15,23,42,0.06);outline:none;font-size:14px;
      transition:border-color .12s, box-shadow .12s;
      color:var(--text);
      background:linear-gradient(180deg,#fff,#fbfbff);
      width: 100%;
      resize: vertical;
    }
    .auth-field input:focus, .auth-field select:focus, .auth-field textarea:focus {border-color:rgba(0,119,181,0.6); box-shadow:0 6px 18px rgba(0,119,181,0.08) }
    .auth-bottom{display:flex;justify-content:space-between;align-items:center;margin-top:14px;gap:10px;flex-wrap:wrap}
    @media (max-width:980px){
      .dashboard-main{grid-template-columns:1fr}
      header.app-header {flex-direction:column;gap:10px;align-items:flex-start}
      .menu-dropdown {right:16px; top:110px}
      .students-page-wrap { grid-template-columns: 1fr; }
    }
    @media (max-width:680px){
      .stats-grid{grid-template-columns:repeat(2, 1fr)}
    }
    @media (max-width:480px){
      .stat .num{font-size:22px}
      .stats-grid{grid-template-columns:1fr}
    }
    .muted {color:var(--muted)}
    .text-right {text-align:right}
    .mb {margin-bottom:12px}
    .small { font-size:13px; color:var(--muted); }
    .user-row-click { cursor: pointer; font-weight: 600; color: var(--accent-main); }
    .coupon-discount { color: var(--red); font-weight: 600; }
    // Add this CSS for new referral code styles (add to GlobalStyles)
.agent-card {
  padding:16px;
  border-radius:12px;
  background:linear-gradient(180deg,rgba(255,255,255,0.98),rgba(240,248,255,0.95));
  border:1px solid var(--card-outline);
  box-shadow:var(--shadow-1);
}
.referral-code {
  display:inline-flex;
  align-items:center;
  gap:8px;
  padding:8px 12px;
  background:var(--accent-grad);
  color:#fff;
  border-radius:8px;
  font-weight:700;
  font-size:14px;
  letter-spacing:1px;
  cursor:pointer;
}
.referral-code:hover {opacity:.9}
.copy-btn {
  padding:4px 8px;
  background:rgba(255,255,255,.2);
  border-radius:4px;
  font-size:11px;
}
.success-badge {
  display:inline-block;
  padding:4px 8px;
  background:var(--green);
  color:#fff;
  border-radius:6px;
  font-size:11px;
  font-weight:600;
}
.inactive-badge {
  display:inline-block;
  padding:4px 8px;
  background:var(--red);
  color:#fff;
  border-radius:6px;
  font-size:11px;
  font-weight:600;
}
  `}
  </style>
);

// ========== HELPER FUNCTIONS ==========
const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    alert(`Copied: ${text}`);
  }).catch(() => {
    alert('Failed to copy');
  });
};

function getCouponDetails(couponsData, code) {
  if (!code) return { discount: 0, percentage: 0, code: 'N/A' };
  const coupon = couponsData.find(c => c.code === code && c.status === 'active' && c.usedCount < c.maxUses);
  if (!coupon) return { discount: 0, percentage: 0, code: code + ' (Inactive/Used)' };
  return { percentage: coupon.discount, code: coupon.code };
}

function calculateSubscriptionRevenue(sub, couponsData) {
  const originalPrice = sub.price;
  const coupon = getCouponDetails(couponsData, sub.couponCode);
  const discountAmount = originalPrice * (coupon.percentage / 100);
  const amountPaid = originalPrice - discountAmount;
  return { originalPrice, discountAmount, amountPaid, couponCode: coupon.code, discountPercentage: coupon.percentage };
}

function calculateAgentPerformance(agentId, agentsData, usersData, subscriptionsData, couponsData) {
  let totalRevenue = 0;
  let totalOriginalRevenue = 0;
  let userCount = 0;
  const agent = agentsData.find(a => a.id === agentId);
  if (!agent) return { totalRevenue: 0, totalOriginalRevenue: 0, commissionPaid: 0, userCount: 0 };
  subscriptionsData
    .filter(sub => usersData.find(u => u.id === sub.userId)?.agentId === agentId)
    .forEach(sub => {
      const { amountPaid, originalPrice } = calculateSubscriptionRevenue(sub, couponsData);
      totalRevenue += amountPaid;
      totalOriginalRevenue += originalPrice;
      userCount++;
    });
  const commissionPaid = totalRevenue * (agent.commissionRate / 100 || 0);
  return { totalRevenue, totalOriginalRevenue, commissionPaid, userCount };
}

// ========== COMPONENTS ==========
function AppHeader({ adminEmail, onNav, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleNav = (page) => { onNav(page); setIsMenuOpen(false); };
  const handleLogout = () => { onLogout(); setIsMenuOpen(false); }
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') setIsMenuOpen(false); };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);
  return (
    <header className="app-header" role="banner">
      <div className="brand">
        <div className="logo" aria-hidden>CL</div>
        <div>
          <div className="title">Climbloop</div>
          <div className="subtitle muted">Admin</div>
        </div>
      </div>
      <div className="header-actions">
        <div style={{ textAlign: 'right' }}>
          <div className="muted" style={{ fontSize: '12px' }}>Signed in as</div>
          <div style={{ fontWeight: '700' }}>{adminEmail}</div>
        </div>
        <div className="avatar">{adminEmail.charAt(0).toUpperCase()}</div>
        <button className="hamburger" aria-label="Open menu" title="Menu" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <rect width="20" height="2" rx="1" fill="#111827" />
            <rect y="6" width="20" height="2" rx="1" fill="#111827" />
            <rect y="12" width="20" height="2" rx="1" fill="#111827" />
          </svg>
        </button>
        <nav className={`menu-dropdown ${isMenuOpen ? 'show' : ''}`} aria-hidden={!isMenuOpen}>
          <a href="#" onClick={(e) => { e.preventDefault(); handleNav('profile'); }}>My profile</a>
          <a href="#" onClick={(e) => { e.preventDefault(); handleNav('settings'); }}>Settings</a>
          <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>Logout</a>
        </nav>
      </div>
    </header>
  );
}

function SubscriptionPieChart({ subscriptions }) {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const legendRef = useRef(null);
  useEffect(() => {
    if (!chartRef.current) return;
    const planCounts = subscriptions.reduce((acc, sub) => { acc[sub.plan] = (acc[sub.plan] || 0) + 1; return acc; }, {});
    const data = {
      labels: Object.keys(planCounts),
      datasets: [{ data: Object.values(planCounts), backgroundColor: ['#0077B5', '#00C49A', '#FFBB28'], hoverBackgroundColor: ['#0090E0', '#00E6B9', '#FFD868'] }]
    };
    if (chartInstanceRef.current) chartInstanceRef.current.destroy();
    const ctx = chartRef.current.getContext('2d');
    chartInstanceRef.current = new Chart(ctx, {
      type: 'doughnut',
      data: data,
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });
    if (legendRef.current) {
      const totalSubs = subscriptions.length;
      if (totalSubs > 0) {
        let legendHtml = Object.keys(planCounts).map(plan => {
          const count = planCounts[plan];
          const percent = ((count / totalSubs) * 100).toFixed(1);
          return `<span>${plan}: ${count} (${percent}%)</span>`;
        }).join(' | ');
        legendRef.current.innerHTML = legendHtml;
      } else {
        legendRef.current.innerHTML = "No subscription data.";
      }
    }
    return () => { if (chartInstanceRef.current) { chartInstanceRef.current.destroy(); chartInstanceRef.current = null; } };
  }, [subscriptions]);
  return (
    <>
      <div style={{ maxHeight: '200px', padding: '10px 0' }}><canvas ref={chartRef}></canvas></div>
      <div style={{ marginTop: '12px', textAlign: 'center' }} className="small muted" ref={legendRef}></div>
    </>
  );
}

function DashboardPage({ stats, onNav, subscriptions, users, agents, coupons }) {
  const handleExportCSV = () => {
    const exportData = users.map(user => {
      const sub = subscriptions.find(s => s.userId === user.id);
      const agent = agents.find(a => a.id === user.agentId);
      return {
        'User ID': user.id,
        'Name': user.name,
        'Email': user.email,
        'Phone': user.phone || 'N/A',
        'Background': user.background,
        'Level': user.level,
        'Quiz Score': user.quizScore,
        'Agent ID': user.agentId || 'N/A',
        'Agent Name': agent ? agent.name : 'N/A',
        'Subscription Plan': sub ? sub.plan : 'None',
        'Subscription Status': sub ? 'Active' : 'Inactive',
        'User Status': user.isBlocked ? 'Blocked' : 'Active',
        'Registration Date': user.createdAt || 'N/A'
      };
    });
    exportToCSV(exportData, 'users_export');
  };

  return (
    <section className="panel" aria-labelledby="dashHeading">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
        <div>
          <h2 id="dashHeading" style={{ margin: 0 }}>Dashboard</h2>
          <p className="muted" style={{ margin: '6px 0 0' }}>Overview of users, subscriptions and agents</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button className="chip" onClick={handleExportCSV}>Export CSV</button>
          <button className="chip" onClick={() => onNav('users')}>View users</button>
        </div>
      </div>
      <div className="dashboard-main">
        <div>
          <div className="stats-grid mb">
            <div className="stat" onClick={() => onNav('users')}>
              <div className="label">Total users</div>
              <div className="num">{stats.totalUsers}</div>
              <div className="muted small">All registered users</div>
            </div>
            <div className="stat" onClick={() => onNav('subscribed')}>
              <div className="label">Subscribed users</div>
              <div className="num">{stats.subscribedUsers}</div>
              <div className="muted small">Active paid subscriptions</div>
            </div>
            <div className="stat" onClick={() => onNav('agents')}>
              <div className="label">Total Agents</div>
              <div className="num">{stats.totalAgents}</div>
              <div className="muted small">Active institutions</div>
            </div>
            <div className="stat">
              <div className="label">Active Referral Codes</div>
              <div className="num">{agents.filter(a => a.referralCodeActive).length}</div>
              <div className="muted small">Currently accepting students</div>
            </div>
            <div className="stat" id="revenueCard" onClick={() => onNav('revenueDetail')}>
              <div className="label">Total Revenue Generated</div>
              <div className="num">₹{stats.revenue.toLocaleString('en-IN')}</div>
              <div className="muted small">Click to view breakdown</div>
            </div>
          </div>
        </div>
        <aside style={{ width: '360px' }}>
          <div className="panel">
            <h4 style={{ margin: '0 0 10px' }} className="gradient-text">Quick actions</h4>
            <div className="quick">
              <button className="btn btn-ghost" onClick={() => onNav('modal-addUser')}>Add user</button>
              <button className="btn btn-ghost" onClick={() => onNav('modal-addAgent')}>Add agent</button>
              <button className="btn btn-ghost" onClick={() => onNav('coupons')}>Coupons</button>
            </div>
          </div>
          <div className="panel" style={{ marginTop: '12px' }}>
            <h4 style={{ margin: '0 0 10px' }} className="gradient-text">User Subscriptions</h4>
            <SubscriptionPieChart subscriptions={subscriptions} />
          </div>
        </aside>
      </div>
    </section>
  );
}

function UsersPage({ users, subscriptions, onNav, onBlockUser, onShowUserDetail }) {
  const [filters, setFilters] = useState({ search: '', sort: 'name', background: '', blocked: 'all', subscribed: 'all' });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Debug: Log users data to see what's coming from API
  useEffect(() => {
    console.log('Users data:', users);
    console.log('Subscriptions data:', subscriptions);
  }, [users, subscriptions]);

  const uniqueBackgrounds = useMemo(() => [...new Set(users.map(u => u.background).filter(Boolean))], [users]);

  const filteredUsers = useMemo(() => {
    let result = [...users];

    result = result.filter(user => {
      const searchVal = filters.search.toLowerCase();
      const searchMatch =
        (user.name && user.name.toLowerCase().includes(searchVal)) ||
        (user.email && user.email.toLowerCase().includes(searchVal)) ||
        (user.phone && user.phone.includes(searchVal));

      const specMatch = filters.background === '' || user.background === filters.background;
      const blockedMatch = filters.blocked === 'all' ||
        (filters.blocked === 'blocked' && user.isBlocked) ||
        (filters.blocked === 'unblocked' && !user.isBlocked);

      const sub = subscriptions.find(s => s.userId === user.id);
      const subMatch = filters.subscribed === 'all' ||
        (filters.subscribed === 'subscribed' && sub) ||
        (filters.subscribed === 'unsubscribed' && !sub);

      return searchMatch && specMatch && blockedMatch && subMatch;
    });

    result.sort((a, b) => {
      if (filters.sort === 'name') return (a.name || '').localeCompare(b.name || '');
      if (filters.sort === 'background') return (a.background || '').localeCompare(b.background || '');
      if (filters.sort === 'quiz') return (b.quizScore || 0) - (a.quizScore || 0);
      return 0;
    });

    return result;
  }, [users, subscriptions, filters]);

  const handleExportCSV = () => {
    const exportData = filteredUsers.map(user => {
      const sub = subscriptions.find(s => s.userId === user.id);
      return {
        'ID': user.id,
        'Name': user.name,
        'Email': user.email,
        'Phone': user.phone || 'N/A',
        'Background': user.background,
        'Level': user.level,
        'Quiz Score': user.quizScore || 0,
        'Agent ID': user.agentId || 'N/A',
        'Subscription': sub ? sub.plan : 'None',
        'Status': user.isBlocked ? 'Blocked' : 'Active',
        'Created At': user.createdAt || 'N/A'
      };
    });
    exportToCSV(exportData, 'users_list');
  };

  return (
    <section className="panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div>
          <h2 className="gradient-text" style={{ margin: 0 }}>All users</h2>
          <p className="muted" style={{ margin: '6px 0 0' }}>
            {filteredUsers.length} users found • Manage registered users — sort & filter
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button className="btn btn-ghost" onClick={handleExportCSV}>Export CSV</button>
          <button className="btn btn-ghost" onClick={() => onNav('dashboard')}>Back</button>
          <button className="btn btn-primary" onClick={() => onNav('modal-addUser')}>Add user</button>
        </div>
      </div>

      <div className="controls">
        <div className="search" style={{ flex: 1 }}>
          <input
            type="search"
            name="search"
            placeholder="Search by name, email, or phone"
            value={filters.search}
            onChange={handleFilterChange}
          />
        </div>
        <select name="sort" value={filters.sort} onChange={handleFilterChange}>
          <option value="name">Sort: Name</option>
          <option value="background">Sort: Background</option>
          <option value="quiz">Sort: Quiz Score</option>
        </select>
        <select name="background" value={filters.background} onChange={handleFilterChange}>
          <option value="">All Backgrounds</option>
          {uniqueBackgrounds.map(bg => <option key={bg} value={bg}>{bg}</option>)}
        </select>
        <select name="blocked" value={filters.blocked} onChange={handleFilterChange}>
          <option value="all">Status: All</option>
          <option value="unblocked">Status: Active</option>
          <option value="blocked">Status: Blocked</option>
        </select>
        <select name="subscribed" value={filters.subscribed} onChange={handleFilterChange}>
          <option value="all">Subscription: All</option>
          <option value="subscribed">Subscribed</option>
          <option value="unsubscribed">Not Subscribed</option>
        </select>
      </div>

      <div style={{ overflowX: 'auto' }}>
        {filteredUsers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>
            <p>No users found matching your criteria.</p>
            <button
              className="btn btn-primary"
              onClick={() => setFilters({ search: '', sort: 'name', background: '', blocked: 'all', subscribed: 'all' })}
              style={{ marginTop: '10px' }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th style={{ width: '100px' }}>ID</th>
                <th style={{ minWidth: '180px' }}>Name/Email</th>
                <th>Level</th>
                <th>Background</th>
                <th>Agent ID</th>
                <th>Subscription</th>
                <th style={{ width: '100px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => {
                const sub = subscriptions.find(s => s.userId === user.id);
                const subStatus = sub ? sub.plan : 'None';
                const statusClass = user.isBlocked ? 'block-btn' : 'unblock-btn';
                const actionText = user.isBlocked ? 'Unblock' : 'Block';

                return (
                  <tr key={user.id}>
                    <td className="user-row-click" onClick={() => onShowUserDetail(user.id)}>
                      {user.id}
                    </td>
                    <td className="user-row-click" onClick={() => onShowUserDetail(user.id)}>
                      <strong>{user.name}</strong><br />
                      <span className="small muted">{user.email}</span>
                    </td>
                    <td>
                      <div className="level-circles">
                        {[1, 2, 3, 4].map(i => (
                          <div
                            key={i}
                            className={`level-circle ${(user.level || 0) >= i ? 'filled' : ''}`}
                            title={`Level ${i}`}
                          ></div>
                        ))}
                      </div>
                    </td>
                    <td>{user.background}</td>
                    <td>{user.agentId || 'N/A'}</td>
                    <td>{subStatus}</td>
                    <td>
                      <button
                        className={statusClass}
                        onClick={() => onBlockUser(user.id, !user.isBlocked)}
                      >
                        {actionText}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}

// Update other components to include CSV export...

function SubscribedPage({ users, subscriptions, coupons, agents, onNav, onShowUserDetail }) {
  const [filters, setFilters] = useState({ search: '', sort: 'name', amount: 'all', agent: '' });
  const handleFilterChange = (e) => { const { name, value } = e.target; setFilters(prev => ({ ...prev, [name]: value })); };

  const filteredSubscriptions = useMemo(() => {
    let subsWithDetails = subscriptions.map(sub => {
      const user = users.find(u => u.id === sub.userId);
      const revenue = calculateSubscriptionRevenue(sub, coupons);
      return { ...sub, user, ...revenue };
    }).filter(item => item.user);

    subsWithDetails = subsWithDetails.filter(item => {
      const user = item.user;
      const searchVal = filters.search.toLowerCase();
      const searchMatch =
        user.name.toLowerCase().includes(searchVal) ||
        user.email.toLowerCase().includes(searchVal) ||
        (user.agentId && user.agentId.toLowerCase().includes(searchVal));
      const agentMatch = filters.agent === '' || user.agentId === filters.agent;
      const amountMatch = filters.amount === 'all' ||
        (filters.amount === 'high' && item.amountPaid > 8000) ||
        (filters.amount === 'low' && item.amountPaid <= 8000);
      return searchMatch && agentMatch && amountMatch;
    });

    subsWithDetails.sort((a, b) => {
      if (filters.sort === 'name') return a.user.name.localeCompare(b.user.name);
      if (filters.sort === 'agent') return (a.user.agentId || '').localeCompare(b.user.agentId || '');
      if (filters.sort === 'revenue') return b.amountPaid - a.amountPaid;
      return 0;
    });

    return subsWithDetails;
  }, [users, subscriptions, coupons, filters]);

  const handleExportCSV = () => {
    const exportData = filteredSubscriptions.map(item => ({
      'User ID': item.user.id,
      'Name': item.user.name,
      'Email': item.user.email,
      'Agent ID': item.user.agentId || 'N/A',
      'Subscription Plan': item.plan,
      'Original Price': `₹${item.originalPrice}`,
      'Coupon Used': item.couponCode,
      'Discount': `${item.discountPercentage}%`,
      'Discount Amount': `₹${item.discountAmount}`,
      'Amount Paid': `₹${item.amountPaid}`,
      'Start Date': item.startDate,
      'End Date': item.endDate
    }));
    exportToCSV(exportData, 'subscribed_users');
  };

  return (
    <section className="panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div>
          <h2 className="gradient-text" style={{ margin: 0 }}>Subscribed users</h2>
          <p className="muted" style={{ margin: '6px 0 0' }}>Manage all users with an active subscription</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button className="btn btn-ghost" onClick={handleExportCSV}>Export CSV</button>
          <button className="btn btn-ghost" onClick={() => onNav('dashboard')}>Back</button>
        </div>
      </div>
      <div className="controls">
        <div className="search" style={{ flex: 1 }}>
          <input type="search" name="search" placeholder="Search by name, email, or agent ID" value={filters.search} onChange={handleFilterChange} />
        </div>
        <select name="sort" value={filters.sort} onChange={handleFilterChange}>
          <option value="name">Sort: Name</option>
          <option value="agent">Sort: Agent ID</option>
          <option value="revenue">Sort: Amount Paid</option>
        </select>
        <select name="amount" value={filters.amount} onChange={handleFilterChange}>
          <option value="all">Amount Paid: All</option>
          <option value="high">Paid &gt; ₹8000</option>
          <option value="low">Paid ≤ ₹8000</option>
        </select>
        <select name="agent" value={filters.agent} onChange={handleFilterChange}>
          <option value="">All Agents</option>
          {agents.map(agent => (<option key={agent.id} value={agent.id}>{agent.name} ({agent.id})</option>))}
        </select>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th style={{ width: '100px' }}>ID</th>
              <th style={{ minWidth: '180px' }}>Name/Email</th>
              <th>Agent ID</th>
              <th>Subscription Plan</th>
              <th>Coupon Used</th>
              <th>Discount Level</th>
              <th className="text-right">Amount Paid</th>
              <th className="text-right">Original Revenue</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubscriptions.map(item => (
              <tr key={item.id}>
                <td className="user-row-click" onClick={() => onShowUserDetail(item.user.id)}>{item.user.id}</td>
                <td className="user-row-click" onClick={() => onShowUserDetail(item.user.id)}>
                  <strong>{item.user.name}</strong><br />
                  <span className="small muted">{item.user.email}</span>
                </td>
                <td>{item.user.agentId || 'N/A'}</td>
                <td>{item.plan}</td>
                <td>{item.couponCode !== 'N/A' ? <span className="coupon-discount">{item.couponCode}</span> : 'None'}</td>
                <td>{item.discountPercentage > 0 ? <span className="coupon-discount">{item.discountPercentage}%</span> : '0%'}</td>
                <td className="text-right">₹{item.amountPaid.toLocaleString('en-IN')}</td>
                <td className="text-right">₹{item.originalPrice.toLocaleString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ✅ UPDATED: Agents Page with Referral Codes
function AgentsPage({ agents, onNav, onRegenerateCode, onToggleCode }) {
  const [filters, setFilters] = useState({ search: '', sort: 'name' });
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredAgents = useMemo(() => {
    let result = [...agents];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(agent =>
        agent.name.toLowerCase().includes(searchLower) ||
        agent.email.toLowerCase().includes(searchLower) ||
        (agent.referralCode && agent.referralCode.toLowerCase().includes(searchLower)) ||
        (agent.emailDomain && agent.emailDomain.toLowerCase().includes(searchLower))
      );
    }

    result.sort((a, b) => {
      if (filters.sort === 'name') return a.name.localeCompare(b.name);
      if (filters.sort === 'students') return (b.totalStudents || 0) - (a.totalStudents || 0);
      if (filters.sort === 'domain') return (a.emailDomain || '').localeCompare(b.emailDomain || '');
      return 0;
    });

    return result;
  }, [agents, filters]);

  return (
    <section className="panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div>
          <h2 className="gradient-text" style={{ margin: 0 }}>Agents & Referral Codes</h2>
          <p className="muted" style={{ margin: '6px 0 0' }}>
            {filteredAgents.length} agents • Manage institutions and their referral codes
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-ghost" onClick={() => onNav('dashboard')}>Back</button>
          <button className="btn btn-primary" onClick={() => onNav('modal-addAgent')}>
            Add Agent
          </button>
        </div>
      </div>

      <div className="controls">
        <div className="search" style={{ flex: 1 }}>
          <input
            type="search"
            name="search"
            placeholder="Search by name, email, domain, or code"
            value={filters.search}
            onChange={handleFilterChange}
          />
        </div>
        <select name="sort" value={filters.sort} onChange={handleFilterChange}>
          <option value="name">Sort: Name</option>
          <option value="students">Sort: Total Students</option>
          <option value="domain">Sort: Domain</option>
        </select>
      </div>

      <div className="agent-list">
        {filteredAgents.map(agent => (
          <div className="agent-card" key={agent.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
              <div>
                <h4 className="gradient-text" style={{ margin: '0 0 4px' }}>{agent.name}</h4>
                <p className="small" style={{ margin: 0 }}>{agent.email}</p>
              </div>
              {agent.referralCodeActive ? (
                <span className="success-badge">Active</span>
              ) : (
                <span className="inactive-badge">Inactive</span>
              )}
            </div>

            <div style={{ marginBottom: '12px' }}>
              <p style={{ margin: '4px 0' }}><strong>Authority:</strong> {agent.authorityName || 'N/A'}</p>
              <p style={{ margin: '4px 0' }}><strong>Domain:</strong> {agent.emailDomain || 'N/A'}</p>
              <p style={{ margin: '4px 0' }}><strong>Commission:</strong> {agent.commissionRate}%</p>
              <p style={{ margin: '4px 0' }}><strong>Total Students:</strong> {agent.totalStudents || 0}</p>
            </div>

            {agent.referralCode && (
              <>
                <div style={{
                  padding: '12px',
                  background: 'rgba(0, 119, 181, 0.05)',
                  borderRadius: '8px',
                  marginBottom: '12px'
                }}>
                  <div className="small" style={{ marginBottom: '6px', fontWeight: 600 }}>
                    Referral Code:
                  </div>
                  <div
                    className="referral-code"
                    onClick={() => copyToClipboard(agent.referralCode)}
                    title="Click to copy"
                  >
                    <span>{agent.referralCode}</span>
                    <span className="copy-btn">📋 Copy</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className="btn btn-small btn-ghost"
                    style={{ flex: 1 }}
                    onClick={() => onRegenerateCode(agent.id)}
                  >
                    🔄 Regenerate
                  </button>
                  <button
                    className="btn btn-small btn-ghost"
                    style={{ flex: 1 }}
                    onClick={() => onToggleCode(agent.id, !agent.referralCodeActive)}
                  >
                    {agent.referralCodeActive ? '🔒 Deactivate' : '✅ Activate'}
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function CouponsPage({ coupons, subscriptions, onNav }) {
  const [filters, setFilters] = useState({ search: '', status: 'all' });
  const handleFilterChange = (e) => { const { name, value } = e.target; setFilters(prev => ({ ...prev, [name]: value })); };
  const filteredCoupons = useMemo(() => {
    let result = coupons.map(coupon => {
      const discountValue = subscriptions.filter(sub => sub.couponCode === coupon.code).reduce((total, sub) => {
        const { discountAmount } = calculateSubscriptionRevenue(sub, coupons);
        return total + discountAmount;
      }, 0);
      return { ...coupon, discountValue };
    });
    result = result.filter(coupon => {
      const searchVal = filters.search.toLowerCase();
      const searchMatch = coupon.code.toLowerCase().includes(searchVal) || coupon.description.toLowerCase().includes(searchVal);
      const effectiveStatus = coupon.status === 'expired' || coupon.usedCount >= coupon.maxUses ? 'expired' : 'active';
      const statusMatch = filters.status === 'all' || effectiveStatus === filters.status;
      return searchMatch && statusMatch;
    });
    return result;
  }, [coupons, subscriptions, filters]);
  return (
    <section className="panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div>
          <h2 className="gradient-text" style={{ margin: 0 }}>Coupon Management</h2>
          <p className="muted" style={{ margin: '6px 0 0' }}>View utilization and discount levels of active coupon codes.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button className="btn btn-ghost" onClick={() => onNav('dashboard')}>Back</button>
          <button className="btn btn-primary" onClick={() => onNav('modal-addCoupon')}>Add New Coupon</button>
        </div>
      </div>
      <div className="controls">
        <div className="search" style={{ flex: 1 }}>
          <input type="search" name="search" placeholder="Search by code or description" value={filters.search} onChange={handleFilterChange} />
        </div>
        <select name="status" value={filters.status} onChange={handleFilterChange}>
          <option value="all">Status: All</option>
          <option value="active">Status: Active</option>
          <option value="expired">Status: Expired</option>
        </select>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th style={{ width: '140px' }}>Coupon Code</th>
              <th>Description</th>
              <th>Discount (%)</th>
              <th>Max Uses</th>
              <th>Utilization</th>
              <th>Discount Value (Total)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredCoupons.map(coupon => {
              const utilization = `${coupon.usedCount}/${coupon.maxUses}`;
              const statusText = coupon.status === 'expired' || coupon.usedCount >= coupon.maxUses ? 'Expired/Maxed' : 'Active';
              const statusColor = statusText === 'Active' ? 'var(--green)' : 'var(--red)';
              return (
                <tr key={coupon.code}>
                  <td><strong className="coupon-discount">{coupon.code}</strong></td>
                  <td>{coupon.description}</td>
                  <td>{coupon.discount}%</td>
                  <td>{coupon.maxUses}</td>
                  <td>{utilization}</td>
                  <td>₹{coupon.discountValue.toLocaleString('en-IN')}</td>
                  <td style={{ color: statusColor, fontWeight: 600 }}>{statusText}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function RevenueDetailPage({ agents, users, subscriptions, coupons, onNav, onShowRevenueDetail }) {
  const [filters, setFilters] = useState({ search: '', sort: 'name' });
  const handleFilterChange = (e) => { const { name, value } = e.target; setFilters(prev => ({ ...prev, [name]: value })); };
  const agentRevenueData = useMemo(() => {
    let result = agents.map(agent => ({ ...agent, ...calculateAgentPerformance(agent.id, agents, users, subscriptions, coupons) }));
    result = result.filter(agent => {
      const searchVal = filters.search.toLowerCase();
      return agent.name.toLowerCase().includes(searchVal) || agent.email.toLowerCase().includes(searchVal) || agent.id.toLowerCase().includes(searchVal);
    });
    result.sort((a, b) => {
      if (filters.sort === 'name') return a.name.localeCompare(b.name);
      if (filters.sort === 'revenue') return b.totalRevenue - a.totalRevenue;
      if (filters.sort === 'commission') return b.commissionPaid - a.commissionPaid;
      return 0;
    });
    return result;
  }, [agents, users, subscriptions, coupons, filters]);
  return (
    <section className="panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div>
          <h2 className="gradient-text" style={{ margin: 0 }}>Revenue Detail</h2>
          <p className="muted" style={{ margin: '6px 0 0' }}>Detailed breakdown of total revenue generated by agents.</p>
        </div>
        <button className="btn btn-ghost" onClick={() => onNav('dashboard')}>Back</button>
      </div>
      <div className="controls">
        <div className="search" style={{ flex: 1 }}>
          <input type="search" name="search" placeholder="Search by agent name or ID" value={filters.search} onChange={handleFilterChange} />
        </div>
        <select name="sort" value={filters.sort} onChange={handleFilterChange}>
          <option value="name">Sort: Agent Name</option>
          <option value="revenue">Sort: Revenue</option>
          <option value="commission">Sort: Commission Paid</option>
        </select>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th style={{ width: '100px' }}>Agent ID</th>
              <th style={{ minWidth: '180px' }}>Agent Name/Email</th>
              <th className="text-right">Total Revenue Generated</th>
              <th>Commission Rate (%)</th>
              <th className="text-right">Commission Paid</th>
            </tr>
          </thead>
          <tbody>
            {agentRevenueData.map(agent => (
              <tr key={agent.id} className="user-row-click" onClick={() => onShowRevenueDetail(agent.id)} style={{ cursor: 'pointer' }}>
                <td>{agent.id}</td>
                <td><strong>{agent.name}</strong><br /><span className="small muted">{agent.email}</span></td>
                <td className="text-right" style={{ color: 'var(--green)', fontWeight: 700 }}>₹{agent.totalRevenue.toLocaleString('en-IN')}</td>
                <td>{agent.commissionRate}%</td>
                <td className="text-right" style={{ color: 'var(--accent-main)', fontWeight: 700 }}>₹{agent.commissionPaid.toLocaleString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function CertificationsPage({ certifications, users, onNav, onShowUserDetail, onReviewCert }) {
  const [filters, setFilters] = useState({ search: '', status: 'all' });
  const handleFilterChange = (e) => { const { name, value } = e.target; setFilters(prev => ({ ...prev, [name]: value })); };
  const filteredCerts = useMemo(() => {
    let result = certifications.map(cert => ({ ...cert, user: users.find(u => u.id === cert.userId) })).filter(item => item.user);
    result = result.filter(item => {
      const searchVal = filters.search.toLowerCase();
      const searchMatch = item.user.name.toLowerCase().includes(searchVal) || item.user.email.toLowerCase().includes(searchVal) || item.type.toLowerCase().includes(searchVal);
      const statusMatch = filters.status === 'all' || item.status === filters.status;
      return searchMatch && statusMatch;
    });
    return result;
  }, [certifications, users, filters]);
  return (
    <section className="panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div>
          <h2 className="gradient-text" style={{ margin: 0 }}>Certifications Approval</h2>
          <p className="muted" style={{ margin: '6px 0 0' }}>Manage user certification requests.</p>
        </div>
        <button className="btn btn-ghost" onClick={() => onNav('dashboard')}>Back</button>
      </div>
      <div className="controls">
        <div className="search" style={{ flex: 1 }}>
          <input type="search" name="search" placeholder="Search by user name or ID" value={filters.search} onChange={handleFilterChange} />
        </div>
        <select name="status" value={filters.status} onChange={handleFilterChange}>
          <option value="all">Status: All</option>
          <option value="pending">Status: Pending</option>
          <option value="approved">Status: Approved</option>
          <option value="rejected">Status: Rejected</option>
        </select>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th style={{ width: '100px' }}>User ID</th>
              <th style={{ minWidth: '180px' }}>Name/Email</th>
              <th>Certification Type</th>
              <th>Submission Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCerts.map(cert => {
              const statusClass = cert.status === 'approved' ? 'cert-approved' : cert.status === 'rejected' ? 'block-btn' : 'cert-pending';
              return (
                <tr key={cert.id}>
                  <td className="user-row-click" onClick={() => onShowUserDetail(cert.user.id)}>{cert.user.id}</td>
                  <td className="user-row-click" onClick={() => onShowUserDetail(cert.user.id)}>
                    <strong>{cert.user.name}</strong><br />
                    <span className="small muted">{cert.user.email}</span>
                  </td>
                  <td>{cert.type}</td>
                  <td>{cert.date}</td>
                  <td><span className={statusClass}>{cert.status.toUpperCase()}</span></td>
                  <td>{cert.status === 'pending' ? (<button className="btn btn-small btn-primary" onClick={() => onReviewCert(cert.id)}>Review</button>) : 'N/A'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ProfilePage({ admin, onNav }) {
  return (
    <section className="panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 className="gradient-text" style={{ margin: 0 }}>Admin Profile</h2>
        <button
          className="btn btn-ghost"
          onClick={() => onNav('dashboard')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          Back
        </button>
      </div>

      <p className="muted">Your administrative access details:</p>
      <div style={{ marginTop: '16px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ fontWeight: 700, display: 'block', marginBottom: '4px' }}>Full Name</label>
          <p style={{ margin: 0 }}>{admin?.name || 'N/A'}</p>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ fontWeight: 700, display: 'block', marginBottom: '4px' }}>Admin ID/Email</label>
          <p style={{ margin: 0 }}>{admin?.email || 'N/A'}</p>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ fontWeight: 700, display: 'block', marginBottom: '4px' }}>Role</label>
          <p style={{ margin: 0 }}>{admin?.role === 'super_admin' ? 'Super Administrator' : 'Support Administrator'}</p>
        </div>
      </div>
    </section>
  );
}

function SettingsPage({ onNav }) {
  const [settings, setSettings] = useState({ theme: 'light', notifications: 'enabled', '2fa': 'enabled' });
  const handleSettingClick = (action, value) => { setSettings(prev => ({ ...prev, [action]: value })); alert(`${action} set to ${value} (Demo)`); };
  return (
    <section className="panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div>
          <h2 className="gradient-text" style={{ margin: 0 }}>Settings</h2>
          <p className="muted" style={{ margin: '6px 0 0' }}>Configure application preferences and security.</p>
        </div>
        <button className="btn btn-ghost" onClick={() => onNav('dashboard')}>Back</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
        <div className="panel">
          <h4 style={{ margin: '0 0 8px' }}>Theme Preference</h4>
          <p className="muted small" style={{ marginBottom: '12px' }}>Select the application theme (Light/Dark).</p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className={`btn ${settings.theme === 'light' ? 'btn-primary' : 'btn-ghost'}`} style={{ flex: 1 }} onClick={() => handleSettingClick('theme', 'light')}>Light {settings.theme === 'light' && '(Active)'}</button>
            <button className={`btn ${settings.theme === 'dark' ? 'btn-primary' : 'btn-ghost'}`} style={{ flex: 1 }} onClick={() => handleSettingClick('theme', 'dark')}>Dark {settings.theme === 'dark' && '(Active)'}</button>
          </div>
        </div>
        <div className="panel">
          <h4 style={{ margin: '0 0 8px' }}>Notifications</h4>
          <p className="muted small" style={{ marginBottom: '12px' }}>Enable or disable real-time alerts.</p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className={`btn ${settings.notifications === 'enabled' ? 'btn-primary' : 'btn-ghost'}`} style={{ flex: 1 }} onClick={() => handleSettingClick('notifications', 'enabled')}>Enabled {settings.notifications === 'enabled' && '(Active)'}</button>
            <button className={`btn ${settings.notifications === 'disabled' ? 'btn-primary' : 'btn-ghost'}`} style={{ flex: 1 }} onClick={() => handleSettingClick('notifications', 'disabled')}>Disabled {settings.notifications === 'disabled' && '(Active)'}</button>
          </div>
        </div>
        <div className="panel">
          <h4 style={{ margin: '0 0 8px' }}>2FA Authentication</h4>
          <p className="muted small" style={{ marginBottom: '12px' }}>Enhance account security.</p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className={`btn ${settings['2fa'] === 'enabled' ? 'btn-primary' : 'btn-ghost'}`} style={{ flex: 1 }} onClick={() => handleSettingClick('2fa', 'enabled')}>Enable 2FA {settings['2fa'] === 'enabled' && '(Active)'}</button>
            <button className={`btn ${settings['2fa'] === 'disabled' ? 'btn-primary' : 'btn-ghost'}`} style={{ flex: 1 }} onClick={() => handleSettingClick('2fa', 'disabled')}>Disable 2FA {settings['2fa'] === 'disabled' && '(Active)'}</button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ========== MODALS ==========
function ModalWrapper({ children, onClose, width = '820px' }) {
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);
  return (
    <div className="modal-backdrop show" onClick={onClose} aria-hidden="false">
      <div className="modal-card" style={{ width: width, maxWidth: '94%' }} onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
}

function StudentDetailModal({ userId, users, subscriptions, agents, coupons, onClose }) {
  const user = users.find(u => u.id === userId);
  const sub = subscriptions.find(s => s.userId === userId);
  const agent = agents.find(a => a.id === user?.agentId);
  if (!user) return null;
  let subHtml;
  if (sub) {
    const revenueData = calculateSubscriptionRevenue(sub, coupons);
    subHtml = (
      <div style={{ padding: '12px', borderRadius: '10px', background: 'var(--accent-grad)', color: 'white', marginTop: '10px' }}>
        <p style={{ margin: '0 0 4px', fontWeight: 700 }}>Plan: {sub.plan}</p>
        <p style={{ margin: '0 0 4px' }}>Subscription ID: {sub.id}</p>
        <p style={{ margin: '0 0 4px' }}>Expires: {sub.endDate}</p>
        <p style={{ margin: '0 0 4px' }}>Coupon Used: {revenueData.couponCode} (<span style={{ fontWeight: 700 }}>{revenueData.discountPercentage}% off</span>)</p>
        <p style={{ margin: 0 }}>Amount Paid: <span style={{ fontWeight: 700 }}>₹{revenueData.amountPaid.toLocaleString('en-IN')}</span></p>
      </div>
    );
  } else {
    subHtml = (<div style={{ padding: '12px', borderRadius: '10px', background: '#f8f7fb', border: '1px solid rgba(15,23,42,0.04)', marginTop: '10px' }}><p style={{ margin: 0 }}>Not Subscribed</p></div>);
  }
  return (
    <ModalWrapper onClose={onClose} width="820px">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
        <h3 style={{ margin: 0 }} className="gradient-text">User Profile Detail</h3>
        <button className="btn btn-ghost" onClick={onClose} aria-label="Close">✕</button>
      </div>
      <div className="students-page-wrap" style={{ gridTemplateColumns: '1fr', marginTop: 0 }}>
        <div className="student-left-card">
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <div className="avatar" style={{ width: '60px', height: '60px', margin: '0 auto', fontSize: '24px' }}>{user.name.charAt(0)}</div>
            <h4 style={{ margin: '10px 0 0' }}>{user.name} ({user.id})</h4>
            <p className="muted" style={{ margin: 0 }}>{user.email}</p>
          </div>
          <div style={{ marginTop: '16px' }}>
            <div style={{ marginBottom: '10px' }}><label style={{ fontWeight: 700, display: 'block', marginBottom: '4px' }}>Background</label><p style={{ margin: 0 }}>{user.background}</p></div>
            <div style={{ marginBottom: '10px' }}><label style={{ fontWeight: 700, display: 'block', marginBottom: '4px' }}>Quiz Score</label><p style={{ margin: 0 }}>{user.quizScore}/100</p></div>
            <div style={{ marginBottom: '10px' }}><label style={{ fontWeight: 700, display: 'block', marginBottom: '4px' }}>Assigned Agent</label><p style={{ margin: 0 }}>{agent ? `${agent.name} (${agent.id})` : 'None'}</p></div>
            <div style={{ marginBottom: '10px' }}><label style={{ fontWeight: 700, display: 'block', marginBottom: '4px' }}>Status</label><p style={{ margin: 0, color: user.isBlocked ? 'var(--red)' : 'var(--green)', fontWeight: 700 }}>{user.isBlocked ? 'Blocked' : 'Active'}</p></div>
          </div>
        </div>
        <div style={{ marginTop: '18px' }}>
          <h4 className="gradient-text" style={{ marginTop: 0 }}>Subscription Details</h4>
          {subHtml}
          <h4 className="gradient-text" style={{ marginTop: '20px' }}>Levels Progress</h4>
          <div className="levels">
            {[1, 2, 3, 4].map(i => (<div key={i} className={`level ${user.level >= i ? 'active' : ''}`}>Level {i}</div>))}
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
}

function AddUserModal({ onClose, onSave }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [background, setBackground] = useState('College');
  const [phone, setPhone] = useState('');
  const handleSave = () => {
    if (!name || !email) { alert('Please fill in name and email.'); return; }
    onSave({ name, email, background, phone });
  };
  return (
    <ModalWrapper onClose={onClose} width="400px">
      <h3 style={{ margin: '0 0 16px' }} className="gradient-text">Add New User</h3>
      <div className="auth-field"><label htmlFor="newUserName">Full Name</label><input id="newUserName" type="text" placeholder="User Name" value={name} onChange={e => setName(e.target.value)} /></div>
      <div className="auth-field"><label htmlFor="newUserEmail">Email ID</label><input id="newUserEmail" type="email" placeholder="user@email.com" value={email} onChange={e => setEmail(e.target.value)} /></div>
      <div className="auth-field"><label htmlFor="newUserPhone">Phone</label><input id="newUserPhone" type="tel" placeholder="+91-0000000000" value={phone} onChange={e => setPhone(e.target.value)} /></div>
      <div className="auth-field"><label htmlFor="newUserBackground">Background</label><select id="newUserBackground" value={background} onChange={e => setBackground(e.target.value)}><option value="College">College</option><option value="Work">Work</option><option value="Other">Other</option></select></div>
      <div className="auth-bottom" style={{ marginTop: '20px' }}>
        <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={handleSave}>Add User</button>
      </div>
    </ModalWrapper>
  );
}

// ✅ UPDATED: Agent Creation Modal with Domain Input
function AgentInviteModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    authorityName: '',
    name: '',
    email: '',
    altEmail: '',
    phone: '',
    commissionRate: '',
    emailDomain: '' // ✅ NEW
  });
  const [domainError, setDomainError] = useState('');

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (e.target.name === 'emailDomain') setDomainError('');
  };

  const validateDomain = (domain) => {
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/;
    return domainRegex.test(domain);
  };

  const handleSave = () => {
    if (!form.name || !form.email || !form.emailDomain) {
      alert('Please fill in Name, Email, and Email Domain.');
      return;
    }

    if (!validateDomain(form.emailDomain)) {
      setDomainError('Invalid domain format. Example: college.edu or xyz.ac.in');
      return;
    }

    onSave(form);
  };

  return (
    <div className="modal-backdrop show" onClick={onClose}>
      <div className="modal-card" style={{ width: '480px' }} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ margin: '0 0 16px' }} className="gradient-text">Create New Agent</h3>
        <p className="muted small" style={{ marginBottom: '16px' }}>
          Add an institution and automatically generate a referral code
        </p>

        <div className="auth-field">
          <label>Institution Name *</label>
          <input
            name="name"
            type="text"
            placeholder="e.g., Stanford University"
            value={form.name}
            onChange={handleChange}
          />
        </div>

        <div className="auth-field">
          <label>Email Domain * <span className="small">(Students must use this domain)</span></label>
          <input
            name="emailDomain"
            type="text"
            placeholder="e.g., stanford.edu"
            value={form.emailDomain}
            onChange={handleChange}
            style={{ borderColor: domainError ? 'var(--red)' : undefined }}
          />
          {domainError && <span style={{ color: 'var(--red)', fontSize: '12px' }}>{domainError}</span>}
        </div>

        <div className="auth-field">
          <label>Contact Email *</label>
          <input
            name="email"
            type="email"
            placeholder="admin@institution.edu"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div className="auth-field">
          <label>Authority Name</label>
          <input
            name="authorityName"
            type="text"
            placeholder="Dean of Admissions"
            value={form.authorityName}
            onChange={handleChange}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div className="auth-field">
            <label>Alternative Email</label>
            <input
              name="altEmail"
              type="email"
              placeholder="backup@email.com"
              value={form.altEmail}
              onChange={handleChange}
            />
          </div>

          <div className="auth-field">
            <label>Phone</label>
            <input
              name="phone"
              type="tel"
              placeholder="+1-555-0000"
              value={form.phone}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="auth-field">
          <label>Commission Rate (%) *</label>
          <input
            name="commissionRate"
            type="number"
            min="0"
            max="100"
            placeholder="e.g., 15"
            value={form.commissionRate}
            onChange={handleChange}
          />
        </div>

        <div style={{
          padding: '12px',
          background: 'rgba(16, 185, 129, 0.1)',
          borderRadius: '8px',
          marginTop: '16px',
          marginBottom: '12px'
        }}>
          <div className="small" style={{ fontWeight: 600, marginBottom: '4px' }}>
            ✅ A unique referral code will be generated automatically
          </div>
          <div className="small muted">
            Share this code with {form.name || 'the institution'} so students can register
          </div>
        </div>

        <div className="auth-bottom" style={{ marginTop: '20px' }}>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}>Create Agent</button>
        </div>
      </div>
    </div>
  );
}


function CouponModal({ onClose, onSave }) {
  const [form, setForm] = useState({ code: '', discount: '', maxUses: '', description: '' });
  const handleChange = e => { setForm(prev => ({ ...prev, [e.target.name]: e.target.value })); };
  const handleSave = () => {
    if (!form.code || !form.discount || !form.maxUses) { alert('Please fill all fields.'); return; }
    onSave(form);
  };
  return (
    <ModalWrapper onClose={onClose} width="400px">
      <h3 style={{ margin: '0 0 16px' }} className="gradient-text">Add New Coupon</h3>
      <div className="auth-field"><label>Coupon Code</label><input name="code" type="text" placeholder="e.g. SUMMER20" value={form.code} onChange={handleChange} /></div>
      <div className="auth-field"><label>Discount (%)</label><input name="discount" type="number" min="1" max="100" placeholder="e.g. 20" value={form.discount} onChange={handleChange} /></div>
      <div className="auth-field"><label>Max Uses</label><input name="maxUses" type="number" min="1" placeholder="e.g. 100" value={form.maxUses} onChange={handleChange} /></div>
      <div className="auth-field"><label>Description</label><input name="description" type="text" placeholder="e.g. 20% off Premium Plan" value={form.description} onChange={handleChange} /></div>
      <div className="auth-bottom" style={{ marginTop: '20px' }}>
        <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={handleSave}>Save Coupon</button>
      </div>
    </ModalWrapper>
  );
}

function RevenueDetailModal({ agentId, agents, users, subscriptions, coupons, onClose }) {
  const agent = useMemo(() => {
    if (!agentId) return null;
    const agentData = agents.find(a => a.id === agentId);
    if (!agentData) return null;
    const perf = calculateAgentPerformance(agentId, agents, users, subscriptions, coupons);
    return { ...agentData, ...perf };
  }, [agentId, agents, users, subscriptions, coupons]);
  if (!agent) return null;
  return (
    <ModalWrapper onClose={onClose} width="400px">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
        <h3 style={{ margin: 0 }} className="gradient-text">Agent Commission</h3>
        <button className="btn btn-ghost" onClick={onClose} aria-label="Close">✕</button>
      </div>
      <p className="muted">Agent: <strong>{agent.name}</strong> (<strong>{agent.id}</strong>)</p>
      <p className="muted">Commission Rate: <strong>{agent.commissionRate}%</strong></p>
      <div style={{ marginTop: '16px' }}>
        <div style={{ marginBottom: '10px' }}><label style={{ fontWeight: 700, display: 'block', marginBottom: '4px' }}>Total Revenue (Net)</label><p style={{ margin: 0, fontSize: '18px', color: 'var(--green)' }}>₹{agent.totalRevenue.toLocaleString('en-IN')}</p></div>
        <div style={{ marginBottom: '10px' }}><label style={{ fontWeight: 700, display: 'block', marginBottom: '4px' }}>Total Commission Paid</label><p style={{ margin: 0, fontSize: '18px', color: 'var(--accent-main)' }}>₹{agent.commissionPaid.toLocaleString('en-IN')}</p></div>
      </div>
    </ModalWrapper>
  );
}

function CertApprovalModal({ certId, certifications, users, onClose, onUpdateStatus }) {
  const [reason, setReason] = useState('');
  const cert = certifications.find(c => c.id === certId);
  const user = users.find(u => u.id === cert?.userId);
  if (!cert || !user) return null;
  const handleUpdate = (status) => { onUpdateStatus(certId, status, reason); };
  return (
    <ModalWrapper onClose={onClose} width="400px">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
        <h3 style={{ margin: 0 }} className="gradient-text">Approve Certification</h3>
        <button className="btn btn-ghost" onClick={onClose} aria-label="Close">✕</button>
      </div>
      <p className="muted">Review request for:</p>
      <p style={{ marginBottom: '10px' }}><strong>User:</strong> {user.name} ({user.id})</p>
      <p style={{ marginBottom: '10px' }}><strong>Certification:</strong> {cert.type}</p>
      <p style={{ marginBottom: '10px' }}><strong>Date:</strong> {cert.date}</p>
      <div className="auth-field" style={{ marginTop: '20px' }}><label htmlFor="certActionReason">Admin Notes (Optional)</label><textarea id="certActionReason" rows="3" placeholder="Enter reason for approval or rejection" value={reason} onChange={e => setReason(e.target.value)}></textarea></div>
      <div className="auth-bottom" style={{ marginTop: '20px' }}>
        <button className="btn btn-ghost" style={{ borderColor: 'var(--red)', color: 'var(--red)' }} onClick={() => handleUpdate('rejected')}>Reject</button>
        <button className="btn btn-primary" onClick={() => handleUpdate('approved')}>Approve</button>
      </div>
    </ModalWrapper>
  );
}

// ========== MAIN COMPONENT ==========
// ========== MAIN COMPONENT ==========
export default function AdminPanel() {
  const navigate = useNavigate();
  const [page, setPage] = useState('dashboard');
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [agents, setAgents] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({ totalUsers: 0, subscribedUsers: 0, totalAgents: 0, revenue: 0 });
  const [modal, setModal] = useState({ name: 'none', id: null });

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const storedEmail = localStorage.getItem('adminEmail');
      const storedName = localStorage.getItem('adminName');
      const storedRole = localStorage.getItem('adminRole');

      console.log('Stored admin data:', { storedEmail, storedName, storedRole });

      if (storedEmail && storedName && storedRole) {
        // Set admin data from localStorage immediately
        setAdmin({
          email: storedEmail,
          name: storedName,
          role: storedRole
        });

        // Try to validate session with backend, but don't block on failure
        try {
          const response = await api.get('/profile');
          console.log('Profile API response:', response.data);
          // Update with fresh data from API if available
          setAdmin({
            email: response.data.email || storedEmail,
            name: response.data.name || storedName,
            role: response.data.role || storedRole
          });
        } catch (apiError) {
          console.warn('Profile API failed, using localStorage data:', apiError);
          // Continue with localStorage data
        }

        setPage('dashboard');
        await loadDashboardData();
      } else {
        console.log('No admin data in localStorage, redirecting to login');
        navigate('/login');
      }
    } catch (error) {
      console.error('Session check failed:', error);
      localStorage.clear();
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardData = async () => {
    try {
      console.log('Loading dashboard data...');

      // Use Promise.allSettled to handle individual API failures without breaking everything
      const [statsRes, usersRes, agentsRes, subsRes, couponsRes, certsRes] = await Promise.allSettled([
        api.get('/dashboard'),
        api.get('/users'),
        api.get('/agents'),
        api.get('/subscribed'),
        api.get('/coupons'),
        api.get('/certifications'),
      ]);

      console.log('API Responses:', {
        stats: statsRes.status === 'fulfilled' ? statsRes.value.data : 'failed',
        users: usersRes.status === 'fulfilled' ? usersRes.value.data : 'failed',
        agents: agentsRes.status === 'fulfilled' ? agentsRes.value.data : 'failed',
        subscriptions: subsRes.status === 'fulfilled' ? subsRes.value.data : 'failed',
        coupons: couponsRes.status === 'fulfilled' ? couponsRes.value.data : 'failed',
        certifications: certsRes.status === 'fulfilled' ? certsRes.value.data : 'failed'
      });

      // Handle each response with fallbacks
      setDashboardStats(statsRes.status === 'fulfilled' ? statsRes.value.data : { totalUsers: 0, subscribedUsers: 0, totalAgents: 0, revenue: 0 });

      setUsers(usersRes.status === 'fulfilled' && Array.isArray(usersRes.value.data) ? usersRes.value.data : []);
      setAgents(agentsRes.status === 'fulfilled' && Array.isArray(agentsRes.value.data) ? agentsRes.value.data : []);

      // Handle subscriptions data structure
      let subscriptionsData = [];
      if (subsRes.status === 'fulfilled' && Array.isArray(subsRes.value.data)) {
        const subsData = subsRes.value.data;
        if (subsData.length > 0 && subsData[0].subscription) {
          // If data is nested in subscription property
          subscriptionsData = subsData.map(item => ({
            id: item.subscription?.id || `sub-${Math.random()}`,
            userId: item.subscription?.userId || `user-${Math.random()}`,
            plan: item.subscription?.plan || 'Unknown',
            price: item.subscription?.price || 0,
            startDate: item.subscription?.startDate || 'N/A',
            endDate: item.subscription?.endDate || 'N/A',
            couponCode: item.subscription?.couponCode || ''
          }));
        } else {
          // If data is direct
          subscriptionsData = subsData.map(sub => ({
            id: sub.id || `sub-${Math.random()}`,
            userId: sub.userId || `user-${Math.random()}`,
            plan: sub.plan || 'Unknown',
            price: sub.price || 0,
            startDate: sub.startDate || 'N/A',
            endDate: sub.endDate || 'N/A',
            couponCode: sub.couponCode || ''
          }));
        }
      }
      setSubscriptions(subscriptionsData);

      setCoupons(couponsRes.status === 'fulfilled' && Array.isArray(couponsRes.value.data) ? couponsRes.value.data : []);
      setCertifications(certsRes.status === 'fulfilled' && Array.isArray(certsRes.value.data) ? certsRes.value.data : []);

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      // Set empty data to prevent crashes
      setUsers([]);
      setAgents([]);
      setSubscriptions([]);
      setCoupons([]);
      setCertifications([]);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.clear();
      setAdmin(null);
      navigate('/login');
    }
  };

  const handleNav = (pageName) => {
    if (pageName.startsWith('modal-')) {
      const modalName = pageName.replace('modal-', '');
      setModal({ name: modalName, id: null });
    } else {
      setPage(pageName);
    }
  };

  const closeModal = () => { setModal({ name: 'none', id: null }); };

  const handleBlockUser = async (userId, isBlocked) => {
    try {
      await api.patch(`/users/${userId}/block`, { isBlocked });
      setUsers(prevUsers => prevUsers.map(user => user.id === userId ? { ...user, isBlocked } : user));
      alert(`User ${userId} has been ${isBlocked ? 'blocked' : 'unblocked'}.`);
    } catch (error) {
      console.error('Block user error:', error);
      alert('Failed to update user status.');
    }
  };

  const handleShowUserDetail = (userId) => { setModal({ name: 'studentDetail', id: userId }); };
  const handleShowRevenueDetail = (agentId) => { setModal({ name: 'revenueDetail', id: agentId }); };
  const handleReviewCert = (certId) => { setModal({ name: 'certApproval', id: certId }); };

  const handleUpdateCertStatus = async (certId, status, notes) => {
    try {
      await api.patch(`/certifications/${certId}/review`, { status, notes });
      setCertifications(prevCerts => prevCerts.map(cert => cert.id === certId ? { ...cert, status } : cert));
      alert(`Certification ${certId} marked as ${status.toUpperCase()}.`);
      closeModal();
    } catch (error) {
      console.error('Update certification error:', error);
      alert('Failed to update certification.');
    }
  };

  const handleSaveNewUser = async (newUser) => {
    try {
      await axios.post(
        `${API_URL}/api/v1/auth/admin/create-user`,
        newUser,
        { withCredentials: true }
      );
      alert('User created successfully!');
      closeModal();
      loadDashboardData();
    } catch (error) {
      console.error('Create user error:', error);
      alert(error.response?.data?.error || 'Failed to create user.');
    }
  };

  const handleSaveNewAgent = async (newAgent) => {
    try {
      await api.post('/agents', newAgent);
      alert('Agent created successfully!');
      closeModal();
      loadDashboardData();
    } catch (error) {
      console.error('Create agent error:', error);
      alert(error.response?.data?.error || 'Failed to create agent.');
    }
  };

  const handleRegenerateCode = async (agentId) => {
    if (!confirm('Are you sure you want to regenerate the referral code? The old code will no longer work.')) {
      return;
    }

    try {
      const response = await api.post(`/agents/${agentId}/regenerate-code`);
      if (response.data.success) {
        alert(`New referral code: ${response.data.newReferralCode}`);
        loadDashboardData();
      }
    } catch (error) {
      console.error('Regenerate code error:', error);
      alert('Failed to regenerate referral code');
    }
  };

  const handleToggleCode = async (agentId, active) => {
    try {
      const response = await api.post(`/agents/${agentId}/toggle-code`, { active });
      if (response.data.success) {
        alert(`Referral code ${active ? 'activated' : 'deactivated'} successfully`);
        loadDashboardData();
      }
    } catch (error) {
      console.error('Toggle code error:', error);
      alert('Failed to update referral code status');
    }
  };

  const handleSaveNewCoupon = async (newCoupon) => {
    try {
      await api.post('/coupons', newCoupon);
      alert('Coupon created successfully!');
      closeModal();
      loadDashboardData();
    } catch (error) {
      console.error('Create coupon error:', error);
      alert(error.response?.data?.error || 'Failed to create coupon.');
    }
  };

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px',
        color: 'var(--muted)'
      }}>
        Loading Admin Panel...
      </div>
    );
  }

  // Add null check for admin before rendering
  if (!admin) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px',
        color: 'var(--red)',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div>No admin session found</div>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/login')}
        >
          Go to Login
        </button>
      </div>
    );
  }

  // Update AppHeader with null check
  const renderHeader = () => {
    if (!admin || !admin.email) {
      return (
        <header className="app-header" role="banner">
          <div className="brand">
            <div className="logo" aria-hidden>CL</div>
            <div>
              <div className="title">Climbloop</div>
              <div className="subtitle muted">Admin - Session Error</div>
            </div>
          </div>
          <button className="btn btn-ghost" onClick={() => navigate('/login')}>
            Login
          </button>
        </header>
      );
    }

    return (
      <AppHeader
        adminEmail={admin.email}
        onNav={handleNav}
        onLogout={handleLogout}
      />
    );
  };

  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return (
          <DashboardPage
            stats={dashboardStats}
            onNav={handleNav}
            subscriptions={subscriptions}
            users={users}
            agents={agents}
            coupons={coupons}
          />
        );
      case 'users':
        return (
          <UsersPage
            users={users}
            subscriptions={subscriptions}
            onNav={handleNav}
            onBlockUser={handleBlockUser}
            onShowUserDetail={handleShowUserDetail}
          />
        );
      case 'subscribed':
        return (
          <SubscribedPage
            users={users}
            subscriptions={subscriptions}
            coupons={coupons}
            agents={agents}
            onNav={handleNav}
            onShowUserDetail={handleShowUserDetail}
          />
        );
      case 'agents':
        return (
          <AgentsPage
            agents={agents}
            onNav={handleNav}
            onRegenerateCode={handleRegenerateCode}
            onToggleCode={handleToggleCode}
          />
        );
      case 'coupons':
        return (
          <CouponsPage
            coupons={coupons}
            subscriptions={subscriptions}
            onNav={handleNav}
          />
        );
      case 'revenueDetail':
        return (
          <RevenueDetailPage
            agents={agents}
            users={users}
            subscriptions={subscriptions}
            coupons={coupons}
            onNav={handleNav}
            onShowRevenueDetail={handleShowRevenueDetail}
          />
        );
      case 'certifications':
        return (
          <CertificationsPage
            certifications={certifications}
            users={users}
            onNav={handleNav}
            onShowUserDetail={handleShowUserDetail}
            onReviewCert={handleReviewCert}
          />
        );
      case 'profile':
        return <ProfilePage admin={admin} onNav={handleNav} />;
      case 'settings':
        return <SettingsPage onNav={handleNav} />;
      default:
        return (
          <DashboardPage
            stats={dashboardStats}
            onNav={handleNav}
            subscriptions={subscriptions}
            users={users}
            agents={agents}
            coupons={coupons}
          />
        );
    }
  };

  const renderModal = () => {
    switch (modal.name) {
      case 'studentDetail':
        return (
          <StudentDetailModal
            userId={modal.id}
            users={users}
            subscriptions={subscriptions}
            agents={agents}
            coupons={coupons}
            onClose={closeModal}
          />
        );
      case 'addUser':
        return <AddUserModal onClose={closeModal} onSave={handleSaveNewUser} />;
      case 'addAgent':
        return <AgentInviteModal onClose={closeModal} onSave={handleSaveNewAgent} />;
      case 'addCoupon':
        return <CouponModal onClose={closeModal} onSave={handleSaveNewCoupon} />;
      case 'revenueDetail':
        return (
          <RevenueDetailModal
            agentId={modal.id}
            agents={agents}
            users={users}
            subscriptions={subscriptions}
            coupons={coupons}
            onClose={closeModal}
          />
        );
      case 'certApproval':
        return (
          <CertApprovalModal
            certId={modal.id}
            certifications={certifications}
            users={users}
            onClose={closeModal}
            onUpdateStatus={handleUpdateCertStatus}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <GlobalStyles />
      <div className="app-wrap">
        {renderHeader()}
        <main style={{ marginTop: '8px', display: 'block' }}>
          {renderPage()}
        </main>
      </div>
      {renderModal()}
    </>
  );
}