/**
 * Simple authentication utility (localStorage-based)
 * For MVP - can be replaced with real auth later
 */

export function signUp(email, password, name) {
  // Check if user already exists
  const existingUsers = JSON.parse(localStorage.getItem('clay_users') || '[]');
  if (existingUsers.find(u => u.email === email)) {
    throw new Error('An account with this email already exists');
  }

  // Create new user
  const newUser = {
    id: Date.now().toString(),
    email,
    password, // In production, this should be hashed
    name,
    createdAt: new Date().toISOString()
  };

  existingUsers.push(newUser);
  localStorage.setItem('clay_users', JSON.stringify(existingUsers));

  // Auto sign in
  localStorage.setItem('clay_current_user', JSON.stringify(newUser));
  return newUser;
}

export function signIn(email, password) {
  const users = JSON.parse(localStorage.getItem('clay_users') || '[]');
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Remove password before storing
  const { password: _, ...userWithoutPassword } = user;
  localStorage.setItem('clay_current_user', JSON.stringify(userWithoutPassword));
  return userWithoutPassword;
}

export function signOut() {
  localStorage.removeItem('clay_current_user');
}

export function getCurrentUser() {
  const userStr = localStorage.getItem('clay_current_user');
  return userStr ? JSON.parse(userStr) : null;
}

export function isAuthenticated() {
  return !!getCurrentUser();
}


