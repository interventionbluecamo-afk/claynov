/**
 * Simple confetti animation utility
 * Inspired by habitsgarden style
 */

export function createConfetti() {
  const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4'];
  const confettiCount = 50;
  
  for (let i = 0; i < confettiCount; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * 8 + 4;
      const startX = Math.random() * window.innerWidth;
      const startY = -10;
      const rotation = Math.random() * 360;
      const duration = Math.random() * 2000 + 1500;
      
      confetti.style.cssText = `
        position: fixed;
        left: ${startX}px;
        top: ${startY}px;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        pointer-events: none;
        z-index: 9999;
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        opacity: 0.9;
        animation: confetti-fall ${duration}ms ease-out forwards;
        transform: rotate(${rotation}deg);
      `;
      
      document.body.appendChild(confetti);
      
      setTimeout(() => {
        confetti.remove();
      }, duration);
    }, i * 20);
  }
  
  // Add CSS animation if not already present
  if (!document.getElementById('confetti-styles')) {
    const style = document.createElement('style');
    style.id = 'confetti-styles';
    style.textContent = `
      @keyframes confetti-fall {
        0% {
          transform: translateY(0) rotate(0deg);
          opacity: 0.9;
        }
        100% {
          transform: translateY(${window.innerHeight + 100}px) rotate(${Math.random() * 720 + 360}deg);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

