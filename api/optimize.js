/**
 * Vercel Serverless Function - Claude API Proxy
 * This proxies requests to Anthropic API to avoid CORS issues
 * 
 * The API key should be stored in Vercel environment variables, not in the client
 * 
 * Location: /api/optimize.js
 * This creates an endpoint at: https://yourdomain.com/api/optimize
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

  // Get API key from server environment (not exposed to client)
  const apiKey = process.env.CLAUDE_API_KEY;
  
  if (!apiKey) {
    console.error('Claude API key not configured in Vercel environment variables');
    return res.status(500).json({ 
      error: 'Claude API key not configured. Please add CLAUDE_API_KEY to your Vercel environment variables.' 
    });
  }

  const { resumeText, jobDescription, tone = 'professional' } = req.body;

  if (!resumeText || !jobDescription) {
    return res.status(400).json({ error: 'resumeText and jobDescription are required' });
  }

  const apiVersion = process.env.CLAUDE_API_VERSION || '2024-02-15-preview';
  const model = process.env.CLAUDE_MODEL || 'claude-3-5-sonnet-20241022';

  const systemPrompt = `You are an expert resume optimizer and ATS (Applicant Tracking System) specialist with 10+ years of experience helping job seekers land interviews. Your expertise includes:

1. **ATS Optimization**: Understanding how applicant tracking systems parse and rank resumes
2. **Keyword Matching**: Identifying and incorporating relevant keywords from job descriptions
3. **Resume Formatting**: Ensuring resumes are ATS-friendly while remaining human-readable
4. **Content Optimization**: Rewriting bullet points to be quantifiable and impact-focused
5. **Tone Adaptation**: Adjusting language and style to match different professional contexts

**Your Task:**
Analyze the provided resume against the job description. Optimize the resume to:
- Match the job requirements more closely
- Include relevant keywords naturally
- Improve ATS compatibility
- Maintain the candidate's authentic experience (do not fabricate)
- Use the specified tone: ${tone}

**Output Format:**
Return ONLY a valid JSON object with this exact structure (no markdown, no explanations):
{
  "ats_score": <number 0-100>,
  "match_score": <number 0-100>,
  "key_changes": [<array of 3-5 specific strings describing improvements>],
  "gap_analysis": [
    {
      "skill": "<skill name>",
      "status": "missing" | "present" | "added",
      "recommendation": "<specific actionable recommendation>"
    }
  ],
  "optimized_resume": "<complete optimized resume text in clean markdown format>"
}

**Scoring Guidelines:**
- **ATS Score (0-100)**: Rate how well the resume will parse in ATS systems. Consider: keyword density, formatting, section headers, file structure, and ATS-friendly formatting.
- **Match Score (0-100)**: Rate how well the resume matches the job requirements. Consider: required skills, experience level, qualifications, and alignment with job responsibilities.

**Content Guidelines:**
- **Key changes**: List 3-5 concrete, specific improvements (e.g., "Added 'project management' keyword 3 times in experience section" not "improved keywords")
- **Gap analysis**: Identify actual missing skills, skills that need emphasis, and skills you added from the candidate's background
- **Optimized resume**: 
  - Rewrite the ENTIRE resume with improvements
  - Maintain the original structure and sections
  - Use markdown formatting (# for headings, - for bullets, ## for sections)
  - Keep all original information (don't remove experiences)
  - Enhance with quantifiable achievements where possible
  - Naturally incorporate job-relevant keywords
  - Use ${tone} tone throughout

**Critical Rules:**
- NEVER fabricate experience, skills, or achievements
- ONLY enhance what's already in the resume
- Maintain authenticity and honesty
- Focus on better presentation of existing qualifications
- Use industry-standard resume formatting

Return ONLY the JSON object, no additional text.`;

  const userPrompt = `**RESUME TO OPTIMIZE:**

${resumeText}

---

**JOB DESCRIPTION:**

${jobDescription}

---

**INSTRUCTIONS:**
1. Analyze the resume against the job description
2. Identify gaps, missing keywords, and areas for improvement
3. Optimize the resume content while maintaining authenticity
4. Calculate ATS score (0-100) based on keyword optimization and formatting
5. Calculate Match score (0-100) based on alignment with job requirements
6. List 3-5 specific key changes made
7. Provide gap analysis with actionable recommendations
8. Rewrite the complete resume with optimizations
9. Use ${tone} tone throughout

Return ONLY the JSON object with the structure specified in the system prompt.`;

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
        max_tokens: 4096,
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

    // Try to parse JSON from the response
    let result;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[1]);
      } else {
        result = JSON.parse(content);
      }
    } catch (parseError) {
      console.error('Failed to parse Claude response as JSON:', parseError);
      return res.status(500).json({ 
        error: 'Invalid response format from AI. Please try again.',
        rawResponse: content 
      });
    }

    return res.status(200).json({
      success: true,
      ...result,
      rawResponse: content
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to optimize resume. Please try again.' 
    });
  }
}

