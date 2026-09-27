/**
 * AI Mock Interview Simulator Engine
 */

export const MOCK_INTERVIEW_DOMAINS = [
  {
    id: 'dsa',
    name: 'Data Structures & Algorithms',
    icon: '⚡',
    questions: [
      {
        id: 'q1',
        question: 'Explain how a Hash Table works internally. How do you handle collisions?',
        keywords: ['hash function', 'buckets', 'chaining', 'open addressing', 'linear probing', 'O(1)', 'time complexity'],
        hint: 'Mention key concepts like Hash Functions, Bucket Arrays, Chaining (Linked Lists), and Open Addressing.'
      },
      {
        id: 'q2',
        question: 'What is the difference between Depth First Search (DFS) and Breadth First Search (BFS)? When would you use BFS over DFS?',
        keywords: ['stack', 'queue', 'level order', 'shortest path', 'recursion', 'unweighted graph'],
        hint: 'Compare Queue vs Stack usage, and mention BFS is ideal for finding shortest path in unweighted graphs.'
      }
    ]
  },
  {
    id: 'web',
    name: 'Frontend & Web Development',
    icon: '🌐',
    questions: [
      {
        id: 'q3',
        question: 'What is the Event Loop in JavaScript? Explain Call Stack, Web APIs, and Task Queue.',
        keywords: ['call stack', 'event loop', 'callback queue', 'microtask', 'promises', 'non-blocking', 'single threaded'],
        hint: 'Describe single-threaded execution, non-blocking I/O, Call Stack, Callback Queue, and Promise microtasks.'
      },
      {
        id: 'q4',
        question: 'Explain Virtual DOM in React and how Reconciliation works.',
        keywords: ['diffing algorithm', 'virtual dom', 'render', 'state change', 're-render', 'performance'],
        hint: 'Explain in-memory lightweight representation, state updates, and React diffing algorithm.'
      }
    ]
  },
  {
    id: 'system_design',
    name: 'System Design & High Availability',
    icon: '⚙️',
    questions: [
      {
        id: 'q5',
        question: 'How would you design a Scalable URL Shortener service (like bit.ly)?',
        keywords: ['base62', 'hashing', 'cache', 'redis', 'database', 'load balancer', 'uuid', 'redirect'],
        hint: 'Cover API endpoints, Base62 encoding, Redis caching layer, Database schema, and Load Balancer.'
      }
    ]
  }
];

export function evaluateAnswer(questionObj, userResponse) {
  if (!userResponse || userResponse.trim().length < 10) {
    return {
      score: 30,
      grade: 'Needs Improvement',
      matchedKeywords: [],
      missingKeywords: questionObj.keywords,
      feedback: 'Your answer is too short. Try to elaborate on technical details and provide concrete examples.'
    };
  }

  const textLower = userResponse.toLowerCase();
  const matched = [];
  const missing = [];

  questionObj.keywords.forEach(kw => {
    if (textLower.includes(kw.toLowerCase())) {
      matched.push(kw);
    } else {
      missing.push(kw);
    }
  });

  const keywordCoverage = matched.length / questionObj.keywords.length;
  const lengthBonus = Math.min(20, Math.round(userResponse.split(' ').length / 5));

  const rawScore = Math.round(keywordCoverage * 75 + lengthBonus);
  const finalScore = Math.max(45, Math.min(96, rawScore));

  let grade = 'Satisfactory';
  let feedback = 'Good attempt! You covered some key points, but can improve by adding more terminology.';

  if (finalScore >= 85) {
    grade = 'Excellent / Highly Recommended';
    feedback = 'Outstanding response! You demonstrated strong technical depth, clear communication, and relevant keywords.';
  } else if (finalScore >= 70) {
    grade = 'Strong Answer';
    feedback = 'Well structured answer. Mentioning additional concepts like ' + missing.slice(0, 2).join(', ') + ' will make it even stronger.';
  }

  return {
    score: finalScore,
    grade,
    matchedKeywords: matched,
    missingKeywords: missing,
    feedback
  };
}

export function speakQuestion(text) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  }
}
