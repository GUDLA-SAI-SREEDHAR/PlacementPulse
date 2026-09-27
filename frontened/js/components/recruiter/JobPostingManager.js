import React, { useState } from 'https://esm.sh/react@18';
import htm from 'https://esm.sh/htm';

const html = htm.bind(React.createElement);

export function JobPostingManager({ myJobs = [], onPostJob }) {
  const [jobTitle, setJobTitle] = useState('');
  const [jobCtc, setJobCtc] = useState('');
  const [jobLocation, setJobLocation] = useState('');
  const [jobMinCgpa, setJobMinCgpa] = useState('7.5');
  const [jobLastDate, setJobLastDate] = useState('');
  const [jobSkills, setJobSkills] = useState('');
  const [jobDesc, setJobDesc] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onPostJob({
        title: jobTitle,
        ctc: jobCtc,
        location: jobLocation,
        minCgpa: parseFloat(jobMinCgpa) || 6.0,
        lastDate: jobLastDate || '2026-12-31',
        skillsRequired: jobSkills ? jobSkills.split(',').map(s => s.trim()).filter(Boolean) : [],
        description: jobDesc,
        eligibleBranches: ['Computer Science & Engineering', 'Information Technology']
      });
      alert('Job opening posted successfully!');
      setJobTitle('');
      setJobCtc('');
      setJobLocation('');
      setJobSkills('');
      setJobDesc('');
    } catch (err) {
      alert(err.message || 'Failed to post job.');
    }
  };

  return html`
    <div className="tab-pane animate-fade-in">
      <div className="page-title-bar">
        <h2>Post Job Opportunities</h2>
      </div>

      <div className="card mb-4">
        <div className="card-header">
          <h3>Create New Job Posting</h3>
        </div>
        <div className="card-body">
          <form className="form-grid" onSubmit=${handleSubmit}>
            <div className="form-group">
              <label>Job Title / Role Name</label>
              <input 
                type="text" 
                value=${jobTitle} 
                onChange=${e => setJobTitle(e.target.value)} 
                placeholder="e.g. Software Engineer - SDE 1" 
                required 
              />
            </div>
            <div className="form-group">
              <label>Package CTC (in LPA)</label>
              <input 
                type="text" 
                value=${jobCtc} 
                onChange=${e => setJobCtc(e.target.value)} 
                placeholder="e.g. 15.5 LPA" 
                required 
              />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input 
                type="text" 
                value=${jobLocation} 
                onChange=${e => setJobLocation(e.target.value)} 
                placeholder="e.g. Remote / Hybrid / Bengaluru" 
                required 
              />
            </div>
            <div className="form-group">
              <label>Minimum Eligibility CGPA</label>
              <input 
                type="number" 
                step="0.1" 
                value=${jobMinCgpa} 
                onChange=${e => setJobMinCgpa(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Application Deadline</label>
              <input 
                type="date" 
                value=${jobLastDate} 
                onChange=${e => setJobLastDate(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group form-full">
              <label>Required Technical Skills (Comma separated)</label>
              <input 
                type="text" 
                value=${jobSkills} 
                onChange=${e => setJobSkills(e.target.value)} 
                placeholder="React, Node.js, Python, SQL" 
                required 
              />
            </div>
            <div className="form-group form-full">
              <label>Job Description & Responsibilities</label>
              <textarea 
                rows="3" 
                value=${jobDesc} 
                onChange=${e => setJobDesc(e.target.value)} 
                placeholder="Describe role requirements..." 
                required
              ></textarea>
            </div>
            <div className="form-actions form-full">
              <button type="submit" className="btn btn-primary">Submit Job Posting for Officer Approval</button>
            </div>
          </form>
        </div>
      </div>

      <div className="jobs-grid">
        ${myJobs.length === 0 ? html`<p className="text-muted">No jobs posted yet. Submit a new job posting above!</p>` : myJobs.map(job => html`
          <div key=${job.id} className="job-card">
            <div className="job-card-header">
              <div>
                <h3 className="job-title">${job.title}</h3>
                <span className="company-name">${job.companyName}</span>
              </div>
              <span className=${`badge ${job.status === 'APPROVED' ? 'badge-success' : 'badge-warning'}`}>
                ${job.status}
              </span>
            </div>

            <div className="job-meta-list">
              <span>💰 CTC: <strong>${job.ctc}</strong></span>
              <span>📍 ${job.location}</span>
              <span>🎓 Min CGPA: ${job.minCgpa}</span>
            </div>
          </div>
        `)}
      </div>
    </div>
  `;
}
