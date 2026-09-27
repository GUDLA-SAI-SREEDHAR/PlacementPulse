/**
 * ATS Resume Checker & Heatmap Data Generator
 */

export const ATS_KEYWORDS_DICTIONARY = {
  software: ['javascript', 'typescript', 'react', 'node.js', 'python', 'java', 'c++', 'sql', 'git', 'data structures', 'algorithms', 'rest api', 'docker', 'mongodb', 'aws', 'html5', 'css3', 'microservices'],
  data: ['python', 'sql', 'pandas', 'numpy', 'machine learning', 'statistics', 'tableau', 'power bi', 'tensorflow', 'scikit-learn', 'deep learning', 'data visualization', 'r', 'excel'],
  devops: ['docker', 'kubernetes', 'aws', 'linux', 'bash', 'ci/cd', 'terraform', 'ansible', 'jenkins', 'git', 'prometheus', 'grafana', 'python']
};

export function analyzeResume(resumeText, targetRoleCategory = 'software') {
  if (!resumeText || resumeText.trim().length === 0) {
    return {
      atsScore: 0,
      matchedKeywords: [],
      missingKeywords: [],
      sectionScores: { contact: 0, summary: 0, education: 0, skills: 0, experience: 0, projects: 0 },
      heatmapLines: [],
      heatmapData: []
    };
  }

  const textLower = resumeText.toLowerCase();
  const targetKeywords = ATS_KEYWORDS_DICTIONARY[targetRoleCategory] || ATS_KEYWORDS_DICTIONARY.software;

  const matchedKeywords = [];
  const missingKeywords = [];

  targetKeywords.forEach(kw => {
    if (textLower.includes(kw.toLowerCase())) {
      matchedKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  });

  // Section Checkers
  const hasContact = /email|phone|github|linkedin|contact/i.test(resumeText);
  const hasSummary = /summary|profile|about me|objective/i.test(resumeText);
  const hasEducation = /education|b\.tech|degree|cgpa|university|college/i.test(resumeText);
  const hasSkills = /skills|technologies|programming|languages|tools/i.test(resumeText);
  const hasExperience = /experience|intern|internship|work|employment/i.test(resumeText);
  const hasProjects = /project|built|developed|created/i.test(resumeText);

  const sectionScores = {
    contact: hasContact ? 100 : 30,
    summary: hasSummary ? 100 : 50,
    education: hasEducation ? 100 : 40,
    skills: hasSkills ? 100 : 40,
    experience: hasExperience ? 100 : 50,
    projects: hasProjects ? 100 : 40
  };

  const keywordRatio = matchedKeywords.length / targetKeywords.length;
  const sectionRatio = (Object.values(sectionScores).reduce((a, b) => a + b, 0) / 600);

  const atsScore = Math.min(98, Math.round((keywordRatio * 0.6 + sectionRatio * 0.4) * 100));

  // Generate line-by-line heatmap intensity
  const lines = resumeText.split('\n');
  const heatmapLines = lines.map((line, idx) => {
    const lineLower = line.toLowerCase();
    let hitCount = 0;
    targetKeywords.forEach(kw => {
      if (lineLower.includes(kw.toLowerCase())) hitCount++;
    });

    let intensity = 'low'; // 'high', 'medium', 'low', 'heading'
    if (/^[A-Z\s]{4,25}$/.test(line.trim()) || /summary|education|skills|projects|experience|certifications/i.test(line)) {
      intensity = 'heading';
    } else if (hitCount >= 2) {
      intensity = 'high';
    } else if (hitCount === 1 || hitCount > 0) {
      intensity = 'medium';
    }

    return {
      lineNumber: idx + 1,
      text: line,
      hitCount,
      intensity
    };
  });

  return {
    atsScore,
    matchedKeywords,
    missingKeywords,
    sectionScores,
    heatmapLines
  };
}
