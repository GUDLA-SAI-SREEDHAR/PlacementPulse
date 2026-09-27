import React from 'https://esm.sh/react@18';
import htm from 'https://esm.sh/htm';

const html = htm.bind(React.createElement);

export function StudentApplicationsTable({ myApps = [] }) {
  return html`
    <div className="tab-pane animate-fade-in">
      <div className="page-title-bar">
        <h2>View Student Applications</h2>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>All Applicants (${myApps.length} Candidates)</h3>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Roll No</th>
                  <th>Branch</th>
                  <th>CGPA</th>
                  <th>ATS Score</th>
                  <th>Job Title</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${myApps.length === 0 ? html`
                  <tr>
                    <td colSpan="7" className="text-center text-muted">No student applications submitted yet.</td>
                  </tr>
                ` : myApps.map(a => html`
                  <tr key=${a.id}>
                    <td><strong>${a.studentName}</strong></td>
                    <td>${a.rollNo}</td>
                    <td>${a.branch}</td>
                    <td><span className="cgpa-pill">${a.cgpa}</span></td>
                    <td><span className="score-pill-sm">${a.atsScore}%</span></td>
                    <td>${a.jobTitle}</td>
                    <td><span className=${`status-badge ${a.status.toLowerCase()}`}>${a.status.replace('_', ' ')}</span></td>
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
