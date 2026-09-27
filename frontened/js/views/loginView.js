import React, { useState } from 'https://esm.sh/react@18';
import htm from 'https://esm.sh/htm';
import { usePortal } from '../context/PortalContext.js';

const html = htm.bind(React.createElement);

export function LoginView() {
  const { state, login, register } = usePortal();

  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
  const [selectedRole, setSelectedRole] = useState('STUDENT'); // 'STUDENT' | 'RECRUITER' | 'ADMIN'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Registration Form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regBranch, setRegBranch] = useState('Computer Science & Engineering');
  const [regCgpa, setRegCgpa] = useState('8.50');

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setErrorMessage('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const res = await login(email, password, selectedRole);
      if (res && !res.success) {
        setErrorMessage(res.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Login request encountered an error.');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    const userData = {
      role: selectedRole,
      name: regName,
      email: regEmail,
      password: regPassword,
      branch: regBranch,
      cgpa: regCgpa
    };
    try {
      const res = await register(userData);
      if (res && !res.success) {
        setErrorMessage(res.message || 'Registration failed.');
      } else {
        setSuccessMessage('Registration successful! Redirecting to your dashboard...');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Registration request encountered an error.');
    }
  };

  return html`
    <div className="auth-page-container animate-fade-in">
      <div className="ambient-glow-blob blob-1"></div>
      <div className="ambient-glow-blob blob-2"></div>

      <div className="auth-card-glass">
        <div className="auth-brand">
          <div className="auth-logo-icon">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
            </svg>
          </div>
          <h2>Virtual Placement Cell Portal</h2>
          <p className="auth-subtitle">Secure University Career & Campus Placement Gateway</p>
        </div>

        <div className="auth-tabs">
          <button 
            className=${`auth-tab-btn ${activeTab === 'login' ? 'active' : ''}`}
            onClick=${() => { setActiveTab('login'); setErrorMessage(''); setSuccessMessage(''); }}
          >
            🔐 Sign In
          </button>
          <button 
            className=${`auth-tab-btn ${activeTab === 'register' ? 'active' : ''}`}
            onClick=${() => { setActiveTab('register'); setErrorMessage(''); setSuccessMessage(''); }}
          >
            📝 Create Account
          </button>
        </div>

        ${errorMessage && html`
          <div className="auth-alert error animate-fade-in">
            <span>⚠️ ${errorMessage}</span>
          </div>
        `}
        ${successMessage && html`
          <div className="auth-alert success animate-fade-in">
            <span>✓ ${successMessage}</span>
          </div>
        `}

        ${activeTab === 'login' ? html`
          <form className="auth-form mt-3" onSubmit=${handleLoginSubmit}>
            <div className="form-group">
              <label>Select Portal User Role:</label>
              <div className="auth-role-pills">
                <button type="button" className=${`role-pill-btn ${selectedRole === 'STUDENT' ? 'selected' : ''}`} onClick=${() => handleRoleChange('STUDENT')}>🎓 Student</button>
                <button type="button" className=${`role-pill-btn ${selectedRole === 'RECRUITER' ? 'selected' : ''}`} onClick=${() => handleRoleChange('RECRUITER')}>🏢 Recruiter</button>
                <button type="button" className=${`role-pill-btn ${selectedRole === 'ADMIN' ? 'selected' : ''}`} onClick=${() => handleRoleChange('ADMIN')}>🛡️ Officer</button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="login-email">Email Address</label>
              <div className="input-with-icon">
                <span className="field-icon">📧</span>
                <input 
                  type="email" 
                  id="login-email" 
                  value=${email}
                  onChange=${(e) => setEmail(e.target.value)}
                  placeholder=${selectedRole === 'STUDENT' ? 'student@university.edu' : selectedRole === 'RECRUITER' ? 'recruiter@company.com' : 'officer@university.edu'} 
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="login-password">Password</label>
              <div className="input-with-icon">
                <span className="field-icon">🔑</span>
                <input 
                  type=${showPassword ? 'text' : 'password'}
                  id="login-password" 
                  value=${password}
                  onChange=${(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  required 
                />
                <button 
                  type="button" 
                  className="btn-toggle-pwd"
                  onClick=${() => setShowPassword(!showPassword)}
                >
                  ${showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" defaultChecked /> Remember login session
              </label>
              <a 
                href="#forgot" 
                className="forgot-link"
                onClick=${(e) => {
                  e.preventDefault();
                  alert('Please contact the placement office to reset your password.');
                }}
              >Forgot password?</a>
            </div>

            <button type="submit" className="btn btn-primary btn-lg btn-block mt-3">
              Sign In to ${selectedRole.replace('_', ' ')} Portal ➔
            </button>
          </form>
        ` : html`
          <form className="auth-form mt-3" onSubmit=${handleRegisterSubmit}>
            <div className="form-group">
              <label>Account Role:</label>
              <div className="auth-role-pills">
                <button type="button" className=${`role-pill-btn ${selectedRole === 'STUDENT' ? 'selected' : ''}`} onClick=${() => handleRoleChange('STUDENT')}>🎓 Student</button>
                <button type="button" className=${`role-pill-btn ${selectedRole === 'RECRUITER' ? 'selected' : ''}`} onClick=${() => handleRoleChange('RECRUITER')}>🏢 Recruiter</button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reg-name">${selectedRole === 'STUDENT' ? 'Full Name' : 'Company Name'}</label>
              <input 
                type="text" 
                id="reg-name" 
                value=${regName}
                onChange=${(e) => setRegName(e.target.value)}
                placeholder=${selectedRole === 'STUDENT' ? 'John Doe' : 'Acme Innovations'} 
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="reg-email">Work/University Email</label>
              <input 
                type="email" 
                id="reg-email" 
                value=${regEmail}
                onChange=${(e) => setRegEmail(e.target.value)}
                placeholder="user@domain.com" 
                required 
              />
            </div>

            ${selectedRole === 'STUDENT' && html`
              <div className="form-group">
                <label htmlFor="reg-branch">Engineering Branch</label>
                <select id="reg-branch" value=${regBranch} onChange=${(e) => setRegBranch(e.target.value)}>
                  <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics & Communication">Electronics & Communication</option>
                  <option value="Electrical Engineering">Electrical Engineering</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="reg-cgpa">Current CGPA</label>
                <input 
                  type="number" 
                  step="0.01" 
                  id="reg-cgpa" 
                  value=${regCgpa}
                  onChange=${(e) => setRegCgpa(e.target.value)}
                  required 
                />
              </div>
            `}

            <div className="form-group">
              <label htmlFor="reg-password">Password (Min 6 chars)</label>
              <input 
                type="password" 
                id="reg-password" 
                value=${regPassword}
                onChange=${(e) => setRegPassword(e.target.value)}
                placeholder="Create strong password" 
                required 
              />
            </div>

            <button type="submit" className="btn btn-success btn-lg btn-block mt-3">
              Complete Registration & Sign In 🚀
            </button>
          </form>
        `}

      </div>
    </div>
  `;
}
