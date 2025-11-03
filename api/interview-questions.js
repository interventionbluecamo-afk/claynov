/**
 * Vercel Serverless Function - Interview Questions Generator
 * Generates personalized interview questions based on resume and job description
 */

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get API key from server environment
  const apiKey = process.env.CLAUDE_API_KEY;
  
  if (!apiKey) {
    console.error('Claude API key not configured in Vercel environment variables');
    return res.status(500).json({ 
      error: 'Claude API key not configured. Please add CLAUDE_API_KEY to your Vercel environment variables.' 
    });
  }

  const { resumeText, jobDescription } = req.body;

  if (!resumeText || !jobDescription) {
    return res.status(400).json({ error: 'resumeText and jobDescription are required' });
  }

  const apiVersion = process.env.CLAUDE_API_VERSION || '2024-02-15-preview';
  const model = process.env.CLAUDE_MODEL || 'claude-3-5-sonnet-20241022';

  const systemPrompt = `You are an expert interview coach and career advisor. Your task is to generate personalized interview questions based on a candidate's resume and a specific job description.

Generate 8-10 relevant interview questions that:
1. Relate directly to the job requirements and responsibilities
2. Reference specific skills and experiences from the candidate's resume
3. Include behavioral questions (STAR method style)
4. Include technical questions if applicable
5. Include questions about the candidate's motivation and fit

Return ONLY a JSON array of question strings, no additional text or markdown formatting.
Example format: ["Question 1?", "Question 2?", "Question 3?"]`;

  const userPrompt = `**CANDIDATE'S RESUME:**

${resumeText}

---

**JOB DESCRIPTION:**

${jobDescription}

---

Generate 8-10 personalized interview questions that would help this candidate prepare for an interview for this specific role. Make questions specific to their background and the job requirements.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': apiVersion
      },
      body: JSON.stringify({
        model: model,
        max_tokens: 2048,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Anthropic API error:', errorData);
      return res.status(response.status).json({ 
        error: errorData.error?.message || `API request failed: ${response.status}` 
      });
    }

    const data = await response.json();
    
    // Extract text from Claude's response
    let content = '';
    if (data.content && data.content.length > 0) {
      content = data.content[0].text;
    }

    // Try to parse JSON array from the response
    let questions = [];
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```(?:json)?\s*(\[[\s\S]*\])\s*```/);
      if (jsonMatch) {
        questions = JSON.parse(jsonMatch[1]);
      } else {
        questions = JSON.parse(content);
      }
      
      // Ensure it's an array
      if (!Array.isArray(questions)) {
        throw new Error('Response is not an array');
      }
    } catch (parseError) {
      console.error('Failed to parse Claude response as JSON:', parseError);
      // Fallback: try to extract questions from text
      const lines = content.split('\n').filter(line => line.trim().length > 0);
      questions = lines
        .filter(line => line.includes('?') || /^\d+\./.test(line.trim()))
        .map(line => line.replace(/^\d+\.\s*/, '').trim())
        .filter(q => q.length > 10);
      
      if (questions.length === 0) {
        return res.status(500).json({ 
          error: 'Invalid response format from AI. Please try again.',
          rawResponse: content 
        });
      }
    }

    return res.status(200).json({
      success: true,
      questions: questions.slice(0, 10) // Limit to 10 questions
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to generate interview questions. Please try again.' 
    });
  }
}

