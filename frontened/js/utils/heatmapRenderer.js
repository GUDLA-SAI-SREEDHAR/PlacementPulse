/**
 * Canvas & DOM Resume Heatmap Visualizer
 */

export function renderResumeHeatmap(containerElement, heatmapLines) {
  if (!containerElement) return;

  containerElement.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'heatmap-wrapper-card';

  const header = document.createElement('div');
  header.className = 'heatmap-header';
  header.innerHTML = `
    <div class="heatmap-title">
      <span class="pulse-dot"></span> ATS Visual Scanner & Keyword Heatmap
    </div>
    <div class="heatmap-legend">
      <span class="legend-item high"><span class="color-box high"></span> Target Keywords Match</span>
      <span class="legend-item medium"><span class="color-box medium"></span> Moderate Match</span>
      <span class="legend-item heading"><span class="color-box heading"></span> Section Header</span>
      <span class="legend-item low"><span class="color-box low"></span> Standard Text</span>
    </div>
  `;

  const paper = document.createElement('div');
  paper.className = 'heatmap-paper';

  const scannerLine = document.createElement('div');
  scannerLine.className = 'ats-scanner-laser';
  paper.appendChild(scannerLine);

  heatmapLines.forEach(lineObj => {
    const lineRow = document.createElement('div');
    lineRow.className = `heatmap-line-row ${lineObj.intensity}`;
    
    const numBadge = document.createElement('span');
    numBadge.className = 'line-num';
    numBadge.textContent = lineObj.lineNumber;

    const contentSpan = document.createElement('span');
    contentSpan.className = 'line-text';
    contentSpan.textContent = lineObj.text || ' ';

    lineRow.appendChild(numBadge);
    lineRow.appendChild(contentSpan);

    if (lineObj.hitCount > 0) {
      const matchBadge = document.createElement('span');
      matchBadge.className = 'match-tag';
      matchBadge.textContent = `+${lineObj.hitCount} kw`;
      lineRow.appendChild(matchBadge);
    }

    paper.appendChild(lineRow);
  });

  wrapper.appendChild(header);
  wrapper.appendChild(paper);
  containerElement.appendChild(wrapper);
}
