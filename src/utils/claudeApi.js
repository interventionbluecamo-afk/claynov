/**
 * Claude AI API integration for resume optimization
 * Requires VITE_CLAUDE_API_KEY and VITE_CLAUDE_API_VERSION in .env
 */

export async function optimizeResume(resumeText, jobDescription, tone = 'professional') {
  const apiKey = import.meta.env.VITE_CLAUDE_API_KEY;
  const apiVersion = import.meta.env.VITE_CLAUDE_API_VERSION || '2024-02-15-preview';
  const model = import.meta.env.VITE_CLAUDE_MODEL || 'claude-3-5-sonnet-20241022';

  if (!apiKey) {
    throw new Error('Claude API key not configured. Please add VITE_CLAUDE_API_KEY to your .env file.');
  }

  const systemPrompt = `You are an expert resume optimizer and ATS (Applicant Tracking System) specialist. Your task is to analyze a resume against a job description and provide specific, actionable improvements.

Analyze the resume and job description, then return a JSON object with this exact structure:
{
  "ats_score": <number 0-100>,
  "match_score": <number 0-100>,
  "key_changes": [<array of strings describing major changes made>],
  "gap_analysis": [
    {
      "skill": "<skill name>",
      "status": "missing" | "present" | "added",
      "recommendation": "<specific recommendation>"
    }
  ],
  "optimized_resume": "<full optimized resume text in markdown format>"
}

Guidelines:
- ATS score: How well the resume will parse in ATS systems (keyword optimization, formatting)
- Match score: How well the resume matches the job requirements (skills, experience, qualifications)
- Key changes: 3-5 specific improvements made (be concrete, not vague)
- Gap analysis: Identify missing skills, existing skills that need emphasis, and skills that were added
- Optimized resume: Rewrite the entire resume with improvements, maintaining original structure but optimizing for the job description
- Tone: ${tone} (professional, creative, technical, or executive)

Be specific, actionable, and focused on measurable improvements.`;

  const userPrompt = `Resume to optimize:
${resumeText}

Job Description:
${jobDescription}

Please analyze and optimize this resume for the job description above. Return only valid JSON, no additional text.`;

  try {
    const response = await fetch(`https://api.anthropic.com/v1/messages`, {
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
      throw new Error(errorData.error?.message || `API request failed: ${response.status}`);
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
      // Fallback: return a structured response even if JSON parsing fails
      console.error('Failed to parse Claude response as JSON:', parseError);
      throw new Error('Invalid response format from AI. Please try again.');
    }

    return {
      success: true,
      ...result,
      rawResponse: content
    };
  } catch (error) {
    console.error('Claude API error:', error);
    throw error;
  }
}

