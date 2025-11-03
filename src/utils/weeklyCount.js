/**
 * Weekly counter that resets every Sunday at midnight
 * Increments randomly throughout the week
 */

function getWeekStart() {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // Calculate the start of the current week (Sunday at midnight)
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - day); // Go back to Sunday
  weekStart.setHours(0, 0, 0, 0);
  
  return weekStart;
}

function getWeekKey() {
  const weekStart = getWeekStart();
  // Create a unique key based on week start date (Sunday)
  return `clay_week_${weekStart.getTime()}`;
}

function getRandomIncrement() {
  // Random increment between 1-5 for variety
  return Math.floor(Math.random() * 5) + 1;
}

export function getWeeklyResumeCount() {
  const weekKey = getWeekKey();
  const stored = localStorage.getItem(weekKey);
  
  if (stored) {
    return parseInt(stored, 10);
  }
  
  // New week - start at 0
  localStorage.setItem(weekKey, '0');
  return 0;
}

export function incrementWeeklyCount() {
  const weekKey = getWeekKey();
  const current = getWeeklyResumeCount();
  const increment = getRandomIncrement();
  const newCount = current + increment;
  
  localStorage.setItem(weekKey, newCount.toString());
  return newCount;
}

export function formatWeeklyCount(count) {
  // Format with commas for readability
  return count.toLocaleString('en-US');
}

