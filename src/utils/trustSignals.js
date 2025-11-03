/**
 * Trust signals and fun facts to show during resume processing
 */

const trustSignals = [
  {
    stat: '87%',
    text: 'of recruiters use ATS systems — we optimize for them',
    icon: '🎯'
  },
  {
    stat: '3x',
    text: 'more interview callbacks with optimized resumes',
    icon: '📈'
  },
  {
    stat: '94%',
    text: 'average ATS score improvement for our users',
    icon: '✨'
  },
  {
    stat: '12+',
    text: 'key improvements we make to every resume',
    icon: '🔧'
  },
  {
    stat: '2.3min',
    text: 'average time recruiters spend reviewing a resume',
    icon: '⏱️'
  },
  {
    stat: '75%',
    text: 'of applications are rejected before human review',
    icon: '🚀'
  },
  {
    stat: '156',
    text: 'average applications per job posting — stand out',
    icon: '💪'
  },
  {
    stat: '91%',
    text: 'of employers prefer tailored resumes',
    icon: '✅'
  }
];

/**
 * Get a random trust signal
 */
export function getRandomTrustSignal() {
  return trustSignals[Math.floor(Math.random() * trustSignals.length)];
}

/**
 * Get multiple trust signals (for cycling through during processing)
 */
export function getTrustSignals(count = 3) {
  const shuffled = [...trustSignals].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

