import React, { useState } from 'https://esm.sh/react@18';
import htm from 'https://esm.sh/htm';
import { usePortal } from '../context/PortalContext.js';
import { AnalyticsCharts } from '../components/admin/AnalyticsCharts.js';

const html = htm.bind(React.createElement);

export function AdminView() {
  const { state, verifyStudent, approveJob } = usePortal();
  const pendingJobs = state.jobs.filter(j => j.status === 'PENDING');
  const pendingStudents = state.studentsList.filter(s => s.status === 'PENDING');
  const analytics = state.analytics;
  const recruiter = state.recruiterProfile;

  const [activeTab, setActiveTab] = useState('analytics');

  // Broadcast Notification Form State
  const [bcastTitle, setBcastTitle] = useState('');
  const [bcastMsg, setBcastMsg] = useState('');

  // Report Generator State
  const [showReport, setShowReport] = useState(false);

  const handleVerify = (studentId, isVerified) => {
    verifyStudent(studentId, isVerified);
    alert(`Student profile ${isVerified ? 'verified' : 'unverified'}!`);
  };

  const handleApproveJob = (jobId, status) => {
    approveJob(jobId, status);
    alert(`Job post status updated to ${status}!`);
  };

  const handleBroadcast = (e) => {
    e.preventDefault();
    alert(`Notification broadcasted to all students & portal users!`);
    setBcastTitle('');
    setBcastMsg('');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'analytics':
        return html`
          <div className="tab-pane animate-fade-in">
            <div className="page-title-bar">
              <h2>University Placement Analytics Dashboard</h2>
            </div>

            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-icon">📈</div>
                <div className="metric-info">
                  <span className="metric-val">${analytics.placementRate}%</span>
                  <span className="metric-lbl">Placement Rate</span>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon">💰</div>
                <div className="metric-info">
                  <span className="metric-val">${analytics.avgPackage}</span>
                  <span className="metric-lbl">Average CTC</span>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon">🏢</div>
                <div className="metric-info">
                  <span className="metric-val">${analytics.totalCompaniesVisited}</span>
                  <span className="metric-lbl">Companies Visited</span>
                </div>
              </div>
            </div>

            <${AnalyticsCharts} 
              branchStats=${analytics.branchStats} 
              salaryDistribution=${analytics.salaryDistribution} 
            />
          </div>
        `;

      case 'students':
        return html`
          <div className="tab-pane animate-fade-in">
            <div className="page-title-bar">
              <h2>Manage Student Accounts</h2>
            </div>

            <div className="card">
              <div className="card-header">
                <h3>Registered Students Directory (${state.studentsList.length})</h3>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Roll No</th>
                        <th>Student Name</th>
                        <th>Branch</th>
                        <th>CGPA</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${state.studentsList.map(s => html`
                        <tr key=${s.id}>
                          <td><strong>${s.rollNo}</strong></td>
                          <td>${s.name}</td>
                          <td>${s.branch}</td>
                          <td><span className="cgpa-pill">${s.cgpa}</span></td>
                          <td>
                            <span className=${`status-badge ${s.status === 'VERIFIED' ? 'approved' : 'pending'}`}>
                              ${s.status}
                            </span>
                          </td>
                        </tr>
                      `)}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        `;

      case 'verify_students':
        return html`
          <div className="tab-pane animate-fade-in">
            <div className="page-title-bar">
              <h2>Verify Student Profiles</h2>
              <p>Review student academic records and grant verified status badges.</p>
            </div>

            <div className="card">
              <div className="card-header">
                <h3>Student Profile Verification Queue</h3>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Roll No</th>
                        <th>Student Name</th>
                        <th>Branch</th>
                        <th>CGPA</th>
                        <th>Verification Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${state.studentsList.map(s => html`
                        <tr key=${s.id}>
                          <td><strong>${s.rollNo}</strong></td>
                          <td>${s.name}</td>
                          <td>${s.branch}</td>
                          <td><span className="cgpa-pill">${s.cgpa}</span></td>
                          <td>
                            ${s.status === 'PENDING' ? html`
                              <button className="btn btn-sm btn-success" onClick=${() => handleVerify(s.id, true)}>
                                Verify Account ✓
                              </button>
                            ` : html`
                              <button className="btn btn-sm btn-secondary" onClick=${() => handleVerify(s.id, false)}>
                                Revoke Verification
                              </button>
                            `}
                          </td>
                        </tr>
                      `)}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        `;

      case 'recruiters':
        return html`
          <div className="tab-pane animate-fade-in">
            <div className="page-title-bar">
              <h2>Manage Recruiters</h2>
            </div>

            <div className="card">
              <div className="card-header">
                <h3>Recruiter Accounts Directory</h3>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Company Name</th>
                        <th>Industry Sector</th>
                        <th>Contact Person</th>
                        <th>Email</th>
                        <th>Mobile</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>${recruiter.companyName}</strong></td>
                        <td>${recruiter.industry}</td>
                        <td>${recruiter.contactPerson}</td>
                        <td>${recruiter.email}</td>
                        <td>${recruiter.mobile}</td>
                        <td><span className="badge badge-success">Approved Recruiter ✓</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        `;

      case 'job_approvals':
        return html`
          <div className="tab-pane animate-fade-in">
            <div className="page-title-bar">
              <h2>Approve Job Posts</h2>
            </div>

            <div className="jobs-approval-grid">
              ${state.jobs.map(job => html`
                <div key=${job.id} className="card mb-3">
                  <div className="card-header">
                    <h3>${job.title} - ${job.companyName}</h3>
                    <span className=${`status-badge ${job.status.toLowerCase()}`}>${job.status}</span>
                  </div>
                  <div className="card-body">
                    <p>💰 CTC: <strong>${job.ctc}</strong> | Min CGPA: ${job.minCgpa}</p>
                    <p className="text-muted mt-1">${job.description}</p>
                    <div className="form-actions mt-3">
                      ${job.status === 'PENDING' ? html`
                        <button className="btn btn-success" onClick=${() => handleApproveJob(job.id, 'APPROVED')}>Approve Job Post ✓</button>
                        <button className="btn btn-danger" onClick=${() => handleApproveJob(job.id, 'REJECTED')}>Reject ✗</button>
                      ` : html`<span className="text-muted">Approved & Live</span>`}
                    </div>
                  </div>
                </div>
              `)}
            </div>
          </div>
        `;

      case 'notifications':
        return html`
          <div className="tab-pane animate-fade-in">
            <div className="page-title-bar">
              <h2>Send Notifications & Alerts</h2>
            </div>

            <div className="card max-w-2xl">
              <div className="card-header">
                <h3>Broadcast University Notification</h3>
              </div>
              <div className="card-body">
                <form onSubmit=${handleBroadcast}>
                  <div className="form-group">
                    <label>Announcement Title</label>
                    <input 
                      type="text" 
                      value=${bcastTitle}
                      onChange=${e => setBcastTitle(e.target.value)}
                      placeholder="e.g. Campus Placement Alert" 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Message Content</label>
                    <textarea 
                      rows="4" 
                      value=${bcastMsg}
                      onChange=${e => setBcastMsg(e.target.value)}
                      placeholder="Enter announcement..." 
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary btn-block">Broadcast Alert 📢</button>
                </form>
              </div>
            </div>
          </div>
        `;

      case 'reports':
        return html`
          <div className="tab-pane animate-fade-in">
            <div className="page-title-bar">
              <h2>Generate Placement Reports</h2>
            </div>

            <div className="card mb-4">
              <div className="card-header">
                <h3>Report Generator Configurator</h3>
              </div>
              <div className="card-body">
                <form onSubmit=${(e) => { e.preventDefault(); setShowReport(true); }}>
                  <div className="form-group">
                    <label>Report Type</label>
                    <select>
                      <option value="annual_summary">Annual Campus Placement Summary (2026)</option>
                      <option value="branch_wise">Branch-wise Placement Statistics</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary mt-3">Generate Placement Report 📄</button>
                </form>
              </div>
            </div>

            ${showReport && html`
              <div className="card animate-fade-in">
                <div className="card-header">
                  <h3>Generated Report Preview</h3>
                  <button className="btn btn-sm btn-secondary" onClick=${() => window.print()}>🖨️ Print Report</button>
                </div>
                <div className="card-body">
                  <div className="official-report-sheet">
                    <h2>STATE UNIVERSITY - VIRTUAL PLACEMENT CELL REPORT</h2>
                    <p>Placement Rate: ${analytics.placementRate}% | Placed: ${analytics.placedStudents} / ${analytics.totalStudents}</p>
                    <p>Highest Package: ${analytics.highestPackage} | Average Package: ${analytics.avgPackage}</p>
                  </div>
                </div>
              </div>
            `}
          </div>
        `;

      default:
        return html`<div>Select a tab</div>`;
    }
  };

  return html`
    <div className="portal-layout">
      <aside className="portal-sidebar admin-theme">
        <div className="admin-mini-card">
          <div className="admin-avatar-icon">🛡️</div>
          <div className="mini-info">
            <h4 className="admin-title-text">Placement Cell Head</h4>
            <span className="dept-badge">University T&P Department</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button className=${`nav-tab-btn ${activeTab === 'analytics' ? 'active' : ''}`} onClick=${() => setActiveTab('analytics')}>
            <span className="tab-icon">📊</span> Placement Analytics
          </button>
          <button className=${`nav-tab-btn ${activeTab === 'students' ? 'active' : ''}`} onClick=${() => setActiveTab('students')}>
            <span className="tab-icon">🎓</span> Manage Students (${state.studentsList.length})
          </button>
          <button className=${`nav-tab-btn ${activeTab === 'verify_students' ? 'active' : ''}`} onClick=${() => setActiveTab('verify_students')}>
            <span className="tab-icon">🔍</span> Verify Students (${pendingStudents.length})
          </button>
          <button className=${`nav-tab-btn ${activeTab === 'recruiters' ? 'active' : ''}`} onClick=${() => setActiveTab('recruiters')}>
            <span className="tab-icon">🏢</span> Manage Recruiters
          </button>
          <button className=${`nav-tab-btn ${activeTab === 'job_approvals' ? 'active' : ''}`} onClick=${() => setActiveTab('job_approvals')}>
            <span className="tab-icon">⚡</span> Approve Jobs (${pendingJobs.length})
          </button>
          <button className=${`nav-tab-btn ${activeTab === 'notifications' ? 'active' : ''}`} onClick=${() => setActiveTab('notifications')}>
            <span className="tab-icon">📢</span> Send Notifications
          </button>
          <button className=${`nav-tab-btn ${activeTab === 'reports' ? 'active' : ''}`} onClick=${() => setActiveTab('reports')}>
            <span className="tab-icon">📄</span> Generate Reports
          </button>
        </nav>
      </aside>

      <main className="portal-content">
        ${renderTabContent()}
      </main>
    </div>
  `;
}
