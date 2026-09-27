import React from 'https://esm.sh/react@18';
import htm from 'https://esm.sh/htm';

const html = htm.bind(React.createElement);

export function CompanyProfile({ recruiter = {} }) {
  return html`
    <div className="tab-pane animate-fade-in">
      <div className="page-title-bar">
        <h2>Company Profile</h2>
      </div>
      <div className="card max-w-2xl">
        <div className="card-header">
          <h3>Company Details</h3>
        </div>
        <div className="card-body">
          <div className="form-grid">
            <div className="form-group">
              <label>Company Name</label>
              <input type="text" value=${recruiter.companyName || ''} readOnly className="input-disabled" />
            </div>
            <div className="form-group">
              <label>Industry Sector</label>
              <input type="text" value=${recruiter.industry || ''} readOnly className="input-disabled" />
            </div>
            <div className="form-group">
              <label>Contact Person</label>
              <input type="text" value=${recruiter.contactPerson || ''} readOnly className="input-disabled" />
            </div>
            <div className="form-group">
              <label>Work Email</label>
              <input type="text" value=${recruiter.email || ''} readOnly className="input-disabled" />
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
