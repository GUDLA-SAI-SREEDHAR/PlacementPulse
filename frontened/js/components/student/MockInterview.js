import React, { useState } from 'https://esm.sh/react@18';
import htm from 'https://esm.sh/htm';
import { MOCK_INTERVIEW_DOMAINS, evaluateAnswer, speakQuestion } from '../../utils/mockInterviewEngine.js';

const html = htm.bind(React.createElement);

export function MockInterview() {
  const domains = MOCK_INTERVIEW_DOMAINS;
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [evaluation, setEvaluation] = useState(null);

  const handleSelectQuestion = (q) => {
    setActiveQuestion(q);
    setUserAnswer('');
    setEvaluation(null);
  };

  const handleSpeak = () => {
    if (activeQuestion) {
      speakQuestion(activeQuestion.question);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeQuestion && userAnswer.trim()) {
      const result = evaluateAnswer(activeQuestion, userAnswer);
      setEvaluation(result);
    }
  };

  return html`
    <div className="tab-pane animate-fade-in">
      <div className="page-title-bar">
        <h2>Practice Mock Interviews</h2>
        <p>Select a domain, read or listen to questions, and get real-time AI feedback.</p>
      </div>

      <div className="content-row">
        <div className="card card-flex-1">
          <div className="card-header"><h3>Select Question</h3></div>
          <div className="card-body">
            ${domains.map(d => html`
              <div key=${d.id} className="domain-block mb-3">
                <h4>${d.icon} ${d.name}</h4>
                <div className="q-list">
                  ${d.questions.map(q => html`
                    <button 
                      key=${q.id}
                      className=${`q-select-btn ${activeQuestion && activeQuestion.id === q.id ? 'active' : ''}`}
                      onClick=${() => handleSelectQuestion(q)}
                    >
                      ${q.question}
                    </button>
                  `)}
                </div>
              </div>
            `)}
          </div>
        </div>

        <div className="card card-flex-2">
          <div className="card-header">
            <h3>Answer Simulator</h3>
            ${activeQuestion && html`
              <button className="btn btn-sm btn-secondary" onClick=${handleSpeak}>🔊 Read Aloud</button>
            `}
          </div>
          <div className="card-body">
            ${!activeQuestion ? html`
              <p className="text-muted">Select a question from the left panel to begin your interview practice.</p>
            ` : html`
              <div className="mock-question-box mb-3">
                <p className="q-text"><strong>${activeQuestion.question}</strong></p>
                ${activeQuestion.hint && html`<p className="hint-text mt-1">💡 <em>Hint: ${activeQuestion.hint}</em></p>`}
              </div>
              <form onSubmit=${handleSubmit}>
                <textarea 
                  value=${userAnswer}
                  onChange=${(e) => setUserAnswer(e.target.value)}
                  rows="6" 
                  placeholder="Type your technical answer here..." 
                  required
                ></textarea>
                <button type="submit" className="btn btn-success mt-3">Submit for AI Evaluation 🚀</button>
              </form>

              ${evaluation && html`
                <div className="evaluation-report-card mt-3 animate-fade-in">
                  <h4>Score: ${evaluation.score} / 100 (${evaluation.grade})</h4>
                  <p className="mt-1">${evaluation.feedback}</p>
                  
                  <div className="kw-chips mt-2">
                    <strong>Matched Concepts: </strong>
                    ${evaluation.matchedKeywords.length === 0 ? 'None' : evaluation.matchedKeywords.map(kw => html`<span key=${kw} className="chip chip-success">${kw}</span>`)}
                  </div>
                  <div className="kw-chips mt-2">
                    <strong>Suggested Key Terms: </strong>
                    ${evaluation.missingKeywords.length === 0 ? 'All Key Terms Covered!' : evaluation.missingKeywords.map(kw => html`<span key=${kw} className="chip chip-warning">${kw}</span>`)}
                  </div>
                </div>
              `}
            `}
          </div>
        </div>
      </div>
    </div>
  `;
}
