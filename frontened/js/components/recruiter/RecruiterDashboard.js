import React from 'https://esm.sh/react@18';
import htm from 'https://esm.sh/htm';

const html = htm.bind(React.createElement);

export function RecruiterDashboard({ recruiter, myJobs, myApps, shortlisted }) {
  const selectedCount = myApps.filter(a => a.status === 'SELECTED').length;

  return html`
    <div className="tab-pane animate-fade-in">
      <div className="welcome-hero-card recruiter">
        <div className="hero-text">
          <h2>Recruiter Console: ${recruiter.companyName}</h2>
          <p>Manage campus recruitment drives, candidate applications, and interview scheduling.</p>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">💼</div>
          <div className="metric-info">
            <span className="metric-val">${myJobs.length}</span>
            <span className="metric-lbl">Active Job Postings</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📑</div>
          <div className="metric-info">
            <span className="metric-val">${myApps.length}</span>
            <span className="metric-lbl">Total Applicants</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">⭐</div>
          <div className="metric-info">
            <span className="metric-val">${shortlisted.length}</span>
            <span className="metric-lbl">Shortlisted Candidates</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">✅</div>
          <div className="metric-info">
            <span className="metric-val">${selectedCount}</span>
            <span className="metric-lbl">Offers Extended</span>
          </div>
        </div>
      </div>
    </div>
  `;
}
