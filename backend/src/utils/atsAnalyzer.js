/**
 * Smart ATS Resume Analyzer
 * Evaluates candidate resume text against target role skill requirements
 */
function analyzeResumeATS(resumeText = '', requiredSkills = []) {
  if (!resumeText) {
    return {
      score: 50,
      matchedSkills: [],
      missingSkills: requiredSkills,
      strengths: ['Basic formatting detected'],
      improvements: ['Add relevant technical keywords to improve ATS score'],
    };
  }

  const normalizedText = resumeText.toLowerCase();
  const matchedSkills = [];
  const missingSkills = [];

  requiredSkills.forEach((skill) => {
    const escaped = skill.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (regex.test(normalizedText) || normalizedText.includes(skill.toLowerCase())) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  });

  const skillMatchRatio = requiredSkills.length > 0 ? matchedSkills.length / requiredSkills.length : 0.8;
  const keywordScore = Math.round(skillMatchRatio * 60);

  // Layout & Quality checks
  let layoutScore = 20;
  if (normalizedText.includes('education')) layoutScore += 5;
  if (normalizedText.includes('experience') || normalizedText.includes('projects')) layoutScore += 5;
  if (normalizedText.length > 300) layoutScore += 5;
  if (normalizedText.includes('cgpa') || normalizedText.includes('gpa')) layoutScore += 5;

  const score = Math.min(100, keywordScore + layoutScore);

  const strengths = [];
  if (matchedSkills.length > 0) {
    strengths.push(`Found ${matchedSkills.length} key technical skills: ${matchedSkills.join(', ')}`);
  }
  if (normalizedText.includes('cgpa') || normalizedText.includes('gpa')) {
    strengths.push('Academic performance (CGPA/GPA) clearly documented');
  }

  const improvements = [];
  if (missingSkills.length > 0) {
    improvements.push(`Incorporate target role keywords: ${missingSkills.join(', ')}`);
  }
  if (!normalizedText.includes('github') && !normalizedText.includes('linkedin')) {
    improvements.push('Add links to GitHub profile and project repositories');
  }

  return {
    score,
    matchedSkills,
    missingSkills,
    strengths,
    improvements,
  };
}

module.exports = { analyzeResumeATS };
