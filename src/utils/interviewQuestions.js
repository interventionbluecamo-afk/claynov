/**
 * Generate interview questions based on resume and job description
 * Uses the same proxy as Claude API
 */

export async function generateInterviewQuestions(resumeText, jobDescription) {
  const apiUrl = import.meta.env.VITE_API_URL || '/api/interview-questions';

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        resumeText,
        jobDescription
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API request failed: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to generate interview questions');
    }

    return {
      success: true,
      questions: data.questions || []
    };
  } catch (error) {
    console.error('Interview questions API error:', error);
    
    // Fallback to mock questions
    return mockInterviewQuestions(resumeText, jobDescription);
  }
}

/**
 * Mock interview questions for development
 */
function mockInterviewQuestions(resumeText, jobDescription) {
  return {
    success: true,
    questions: [
      "Tell me about your experience with [relevant skill from job description].",
      "How do you approach [key responsibility from job description]?",
      "Can you walk me through a project where you [relevant achievement]?",
      "What challenges have you faced in [relevant context], and how did you overcome them?",
      "How do you stay current with trends in [industry/field]?",
      "Describe a time when you had to work with a difficult stakeholder or team member.",
      "What would you say are your greatest strengths for this role?",
      "Why are you interested in this position and our company?"
    ]
  };
}

