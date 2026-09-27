import React, { useState } from 'https://esm.sh/react@18';
import htm from 'https://esm.sh/htm';

const html = htm.bind(React.createElement);

export function CandidateCommunication() {
  const [msgSubject, setMsgSubject] = useState('');
  const [msgContent, setMsgContent] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    alert('Announcement message sent to candidate notifications!');
    setMsgSubject('');
    setMsgContent('');
  };

  return html`
    <div className="tab-pane animate-fade-in">
      <div className="page-title-bar">
        <h2>Communicate with Students</h2>
        <p>Send direct messages and updates to applicants or shortlisted candidates.</p>
      </div>

      <div className="card max-w-2xl">
        <div className="card-header">
          <h3>Send Direct Message / Alert</h3>
        </div>
        <div className="card-body">
          <form onSubmit=${handleSendMessage}>
            <div className="form-group">
              <label>Subject</label>
              <input 
                type="text" 
                value=${msgSubject}
                onChange=${e => setMsgSubject(e.target.value)}
                placeholder="e.g. Next Round Preparation Notes" 
                required 
              />
            </div>
            <div className="form-group">
              <label>Message Content</label>
              <textarea 
                rows="4" 
                value=${msgContent}
                onChange=${e => setMsgContent(e.target.value)}
                placeholder="Enter message to candidates..." 
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary btn-block">Send Announcement 💬</button>
          </form>
        </div>
      </div>
    </div>
  `;
}
