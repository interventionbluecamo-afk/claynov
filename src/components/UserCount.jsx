import { useEffect, useState } from 'react';

const emojis = ['👷', '👨‍💼', '👩‍💼', '👨‍🔧', '👩‍🔧', '👨‍💻', '👩‍💻', '👨‍🏫', '👩‍🏫', '👨‍⚕️', '👩‍⚕️', '👨‍🎓', '👩‍🎓'];

export default function UserCount({ count = 2341 }) {
  const [displayedEmojis, setDisplayedEmojis] = useState([]);

  useEffect(() => {
    // Randomly select exactly 4 emojis
    const shuffled = [...emojis].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 4);
    
    // Create timeout IDs for cleanup
    const timeouts = [];
    
    // Animate in with stagger
    selected.forEach((emoji, index) => {
      const timeoutId = setTimeout(() => {
        setDisplayedEmojis(prev => {
          // Only add if we don't already have 4
          if (prev.length < 4) {
            return [...prev, { emoji, id: `${index}-${emoji}` }];
          }
          return prev;
        });
      }, index * 120);
      timeouts.push(timeoutId);
    });
    
    // Cleanup function to clear timeouts if component unmounts
    return () => {
      timeouts.forEach(clearTimeout);
      setDisplayedEmojis([]); // Reset on unmount
    };
  }, []);

  return (
    <div className="flex items-center gap-3">
      <div className="flex -space-x-2">
        {displayedEmojis.map((item, i) => (
          <div
            key={item.id}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full glass border-2 border-white/50 shadow-lg flex items-center justify-center text-xl animate-bounce-in"
            style={{
              animationDelay: `${i * 120}ms`,
              opacity: 0
            }}
          >
            {item.emoji}
          </div>
        ))}
      </div>
      <span className="text-gray-700 font-medium">{count.toLocaleString()} users</span>
    </div>
  );
}

