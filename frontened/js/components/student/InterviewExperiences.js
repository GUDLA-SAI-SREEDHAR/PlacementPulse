import React from 'https://esm.sh/react@18';
import htm from 'https://esm.sh/htm';
import { usePortal } from '../../context/PortalContext.js';

const html = htm.bind(React.createElement);

export function InterviewExperiences() {
  const { state, addInterviewExperience } = usePortal();
  const experiences = state.interviewExperiences || [];

  const handleShare = async () => {
    const company = prompt('Company Name:');
    const role = prompt('Role Title:');
    const tips = prompt('Key Interview Tips & Preparation Guidance:');

    if (company && role) {
      try {
        await addInterviewExperience({
          company,
          role,
          author: state.studentProfile?.name || 'Student',
          difficulty: 'Medium',
          tips: tips || 'Focus on core technical fundamentals and system design basics.'
        });
        alert('Your interview experience has been published!');
      } catch (err) {
        alert(err.message || 'Failed to submit interview experience.');
      }
    }
  };

  return html`
    <div className="tab-pane animate-fade-in">
      <div className="page-title-bar">
        <h2>Interview Experience Hub</h2>
        <button className="btn btn-primary" onClick=${handleShare}>+ Share Your Experience</button>
      </div>

      <div className="experiences-list">
        ${experiences.length === 0 ? html`<p className="text-muted">No interview experiences shared yet. Be the first to contribute!</p>` : experiences.map(exp => html`
          <div key=${exp.id} className="card experience-card mb-3">
            <div className="card-header">
              <h3>${exp.company} - ${exp.role}</h3>
              <span className="badge badge-purple">${exp.difficulty}</span>
            </div>
            <div className="card-body">
              <p className="mb-2"><strong>Shared by:</strong> ${exp.author} (${exp.date || 'Recent'})</p>
              ${exp.rounds && html`
                <div className="rounds-list mb-3">
                  ${exp.rounds.map((r, i) => html`
                    <div key=${i} className="round-item mb-1">
                      <strong>${r.title}:</strong> ${r.details}
                    </div>
                  `)}
                </div>
              `}
              <p><strong>Tips & Guidance:</strong> ${exp.tips}</p>
            </div>
          </div>
        `)}
      </div>
    </div>
  `;
}
