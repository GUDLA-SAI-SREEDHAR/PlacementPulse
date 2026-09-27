import React from 'https://esm.sh/react@18';
import htm from 'https://esm.sh/htm';
import { usePortal } from '../../context/PortalContext.js';

const html = htm.bind(React.createElement);

export function JobDrives({ isApplicationsOnly = false, isRecommendationsOnly = false }) {
  const { state, applyForJob } = usePortal();
  const student = state.studentProfile;
  const approvedJobs = state.jobs.filter(j => j.status === 'APPROVED');
  const myApps = state.applications.filter(a => a.studentId === student.id);

  const handleApply = (jobId) => {
    if (applyForJob(jobId)) {
      alert('Application submitted successfully!');
    }
  };

  if (isApplicationsOnly) {
    return html`
      <div className="tab-pane animate-fade-in">
        <div className="page-title-bar">
          <h2>Track Application Status</h2>
          <p>Monitor your active job application status and upcoming interview schedules.</p>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Submitted Applications (${myApps.length})</h3>
          </div>
          <div className="card-body">
            ${myApps.length === 0 ? html`<p className="text-muted">No active applications found.</p>` : html`
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th>Job Title</th>
                      <th>Apply Date</th>
                      <th>ATS Match</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${myApps.map(a => html`
                      <tr key=${a.id}>
                        <td><strong>${a.companyName}</strong></td>
                        <td>${a.jobTitle}</td>
                        <td>${a.applyDate}</td>
                        <td><span className="score-pill-sm">${a.atsScore}%</span></td>
                        <td>
                          <span className=${`status-badge ${a.status.toLowerCase()}`}>
                            ${a.status.replace('_', ' ')}
                          </span>
                          ${a.interviewDetails && html`
                            <div className="mt-1 text-xs text-primary">
                              📅 ${a.interviewDetails.date} at ${a.interviewDetails.time} (${a.interviewDetails.mode})
                            </div>
                          `}
                        </td>
                      </tr>
                    `)}
                  </tbody>
                </table>
              </div>
            `}
          </div>
        </div>
      </div>
    `;
  }

  if (isRecommendationsOnly) {
    return html`
      <div className="tab-pane animate-fade-in">
        <div className="page-title-bar">
          <h2>Personalized Company Recommendations</h2>
          <p>Top hiring companies matched specifically to your skill set, branch, and CGPA.</p>
        </div>

        <div className="jobs-grid">
          ${approvedJobs.map(j => {
            const isApplied = myApps.some(a => a.jobId === j.id);
            return html`
              <div key=${j.id} className="job-card">
                <div className="job-card-header">
                  <div>
                    <h3 className="job-title">${j.title}</h3>
                    <span className="company-name">${j.companyName}</span>
                  </div>
                  <span className="ctc-tag">${j.ctc}</span>
                </div>
                <p className="job-description-text">${j.description}</p>
                <div className="job-card-footer">
                  <span className="badge badge-info">AI Match Score: 92%</span>
                  ${isApplied ? html`
                    <span className="applied-badge">Applied ✓</span>
                  ` : html`
                    <button className="btn btn-sm btn-primary" onClick=${() => handleApply(j.id)}>1-Click Apply</button>
                  `}
                </div>
              </div>
            `;
          })}
        </div>
      </div>
    `;
  }

  return html`
    <div className="tab-pane animate-fade-in">
      <div className="page-title-bar">
        <h2>View Eligible Placement Jobs</h2>
        <p>Explore all active campus drives approved by the university placement cell.</p>
      </div>

      <div className="jobs-grid">
        ${approvedJobs.map(job => {
          const isEligible = student.cgpa >= job.minCgpa;
          const app = myApps.find(a => a.jobId === job.id);

          return html`
            <div key=${job.id} className=${`job-card ${!isEligible ? 'ineligible' : ''}`}>
              <div className="job-card-header">
                <div>
                  <h3 className="job-title">${job.title}</h3>
                  <span className="company-name">${job.companyName}</span>
                </div>
                <span className="ctc-tag">${job.ctc}</span>
              </div>

              <div className="job-meta-list">
                <span>📍 ${job.location}</span>
                <span>🎓 Min CGPA: ${job.minCgpa}</span>
              </div>

              <p className="job-description-text">${job.description}</p>

              <div className="job-card-footer">
                ${!isEligible ? html`
                  <span className="eligibility-msg error">❌ Ineligible (Min ${job.minCgpa})</span>
                ` : app ? html`
                  <span className="applied-badge">Applied ✓ (${app.status})</span>
                ` : html`
                  <button className="btn btn-primary" onClick=${() => handleApply(job.id)}>1-Click Apply</button>
                `}
              </div>
            </div>
          `;
        })}
      </div>
    </div>
  `;
}
