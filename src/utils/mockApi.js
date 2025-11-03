/**
 * Mock API for testing without Claude API key
 * Returns realistic mock data
 */

export async function mockOptimizeResume(resumeText, jobDescription, tone = 'professional') {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Mock realistic response
  return {
    success: true,
    ats_score: Math.floor(Math.random() * 15) + 85, // 85-100
    match_score: Math.floor(Math.random() * 15) + 85, // 85-100
    key_changes: [
      'Enhanced technical keywords matching job requirements',
      'Restructured experience section for better ATS parsing',
      'Added quantifiable achievements and metrics',
      'Optimized summary for keyword density',
      `Adjusted tone to ${tone} style`
    ],
    gap_analysis: [
      {
        skill: 'Project Management',
        status: 'present',
        recommendation: 'Emphasize this skill with specific examples'
      },
      {
        skill: 'Agile Methodology',
        status: 'added',
        recommendation: 'Added relevant Agile experience from your background'
      },
      {
        skill: 'Stakeholder Communication',
        status: 'present',
        recommendation: 'Highlight cross-functional collaboration examples'
      },
      {
        skill: 'Data Analysis',
        status: 'missing',
        recommendation: 'Consider adding data-driven decision making examples'
      }
    ],
    optimized_resume: `# ${tone.charAt(0).toUpperCase() + tone.slice(1)} Resume

## Professional Summary
Results-driven professional with extensive experience in delivering high-impact solutions. Proven track record of exceeding expectations through strategic thinking and execution.

## Experience

### Senior Role
• Led cross-functional teams to deliver projects 30% ahead of schedule
• Increased efficiency by implementing streamlined processes
• Collaborated with stakeholders to align on strategic objectives

### Previous Role  
• Managed multiple projects simultaneously while maintaining quality standards
• Improved team productivity through process optimization
• Built strong relationships with clients and partners

## Skills
• Strategic Planning
• Team Leadership
• Process Improvement
• Stakeholder Management
• Problem Solving

${resumeText.substring(0, 500)}`
  };
}


