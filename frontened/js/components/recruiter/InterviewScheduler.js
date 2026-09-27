import React, { useState } from 'https://esm.sh/react@18';
import htm from 'https://esm.sh/htm';

const html = htm.bind(React.createElement);

export function InterviewScheduler({ myApps, onUpdateStatus }) {
  const [schedAppId, setSchedAppId] = useState(myApps[0]?.id || '');
  const [schedDate, setSchedDate] = useState('');
  const [schedTime, setSchedTime] = useState('');
  const [schedMode, setSchedMode] = useState('Virtual (Google Meet)');
  const [schedLink, setSchedLink] = useState('');

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    if (!schedAppId) return;
    onUpdateStatus(schedAppId, 'INTERVIEW_SCHEDULED', {
      date: schedDate,
      time: schedTime,
      mode: schedMode,
      link: schedLink
    });
    alert('Interview scheduled successfully!');
    setSchedDate('');
    setSchedTime('');
    setSchedLink('');
  };

  const scheduledApps = myApps.filter(a => a.interviewDetails);

  return html`
    <div className="tab-pane animate-fade-in">
      <div className="page-title-bar">
        <h2>Schedule Interviews & Drives</h2>
      </div>

      <div className="content-row">
        <div className="card card-flex-1">
          <div className="card-header">
            <h3>Schedule Slot</h3>
          </div>
          <div className="card-body">
            <form onSubmit=${handleScheduleSubmit}>
              <div className="form-group">
                <label>Candidate:</label>
                <select value=${schedAppId} onChange=${e => setSchedAppId(e.target.value)} required>
                  ${myApps.map(a => html`<option key=${a.id} value=${a.id}>${a.studentName} (${a.rollNo})</option>`)}
                </select>
              </div>
              <div className="form-group">
                <label>Date</label>
                <input type="date" value=${schedDate} onChange=${e => setSchedDate(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Time Slot</label>
                <input type="text" value=${schedTime} onChange=${e => setSchedTime(e.target.value)} placeholder="11:00 AM EST" required />
              </div>
              <div className="form-group">
                <label>Mode</label>
                <select value=${schedMode} onChange=${e => setSchedMode(e.target.value)}>
                  <option value="Virtual (Google Meet)">Virtual (Google Meet)</option>
                  <option value="On-Campus Auditorium">On-Campus Auditorium</option>
                </select>
              </div>
              <div className="form-group">
                <label>Meeting Link / Venue</label>
                <input type="text" value=${schedLink} onChange=${e => setSchedLink(e.target.value)} placeholder="https://meet.google.com/..." required />
              </div>
              <button type="submit" className="btn btn-primary btn-block">Confirm Interview Schedule</button>
            </form>
          </div>
        </div>

        <div className="card card-flex-2">
          <div className="card-header">
            <h3>Scheduled Rounds</h3>
          </div>
          <div className="card-body">
            ${scheduledApps.length === 0 ? html`<p className="text-muted">No interviews scheduled yet.</p>` : scheduledApps.map(a => html`
              <div key=${a.id} className="interview-card mb-2">
                <h4>${a.studentName} (${a.rollNo})</h4>
                <p>📅 ${a.interviewDetails.date} at ${a.interviewDetails.time} (${a.interviewDetails.mode})</p>
              </div>
            `)}
          </div>
        </div>
      </div>
    </div>
  `;
}
