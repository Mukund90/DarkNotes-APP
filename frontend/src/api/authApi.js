const API_URL = '';
import { generateCorrelationId } from '../utils/correlationId';

export async function signup(email, password) {
  const res = await fetch(`${API_URL}/api/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Correlation-ID': generateCorrelationId(),
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Signup failed');
  }

  return data;
}

export async function login(email, password) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Correlation-ID': generateCorrelationId(),
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Login failed');
  }

  return data;
}

export async function logout(token) {
  const res = await fetch(`${API_URL}/api/auth/logout`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'X-Correlation-ID': generateCorrelationId(),
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Logout failed');
  }

  return data;
}
