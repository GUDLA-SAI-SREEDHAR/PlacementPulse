import React from 'https://esm.sh/react@18';
import htm from 'https://esm.sh/htm';

const html = htm.bind(React.createElement);

export function CandidatePipeline({ myApps = [], onUpdateStatus }) {
  const handleStatusUpdate = async (appId, status) => {
    try {
      await onUpdateStatus(appId, status);
      alert(`Candidate status updated to: ${status}`);
    } catch (err) {
      alert(err.message || 'Status update failed.');
    }
  };

  return html`
    <div className="tab-pane animate-fade-in">
      <div className="page-title-bar">
        <h2>Shortlist Candidates & Update Selection Status</h2>
        <p>Manage candidate selection pipeline: Shortlist, Schedule Interview, Select, or Reject.</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Candidate Status Pipeline</h3>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Roll No</th>
                  <th>ATS Match</th>
                  <th>Applied For</th>
                  <th>Current Pipeline Status</th>
                  <th>Update Action</th>
                </tr>
              </thead>
              <tbody>
                ${myApps.length === 0 ? html`
                  <tr>
                    <td colSpan="6" className="text-center text-muted">No student applications received yet.</td>
                  </tr>
                ` : myApps.map(a => html`
                  <tr key=${a.id}>
                    <td><strong>${a.studentName}</strong></td>
                    <td>${a.rollNo}</td>
                    <td><span className=${`score-pill-sm ${a.atsScore >= 80 ? 'high' : 'med'}`}>${a.atsScore}%</span></td>
                    <td>${a.jobTitle}</td>
                    <td><span className=${`status-badge ${a.status.toLowerCase()}`}>${a.status.replace('_', ' ')}</span></td>
                    <td>
                      <div className="action-btn-group">
                        <button className="btn btn-sm btn-success" onClick=${() => handleStatusUpdate(a.id, 'SHORTLISTED')}>Shortlist ⭐</button>
                        <button className="btn btn-sm btn-purple" onClick=${() => handleStatusUpdate(a.id, 'INTERVIEW_SCHEDULED')}>Schedule 📅</button>
                        <button className="btn btn-sm btn-primary" onClick=${() => handleStatusUpdate(a.id, 'SELECTED')}>Select Offer ✅</button>
                        <button className="btn btn-sm btn-danger" onClick=${() => handleStatusUpdate(a.id, 'REJECTED')}>Reject ❌</button>
                      </div>
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
}
