import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logout } from '../api/authApi';

export default function Navbar() {
  const { token, user, setSession, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      if (token) await logout(token);
    } catch (err) {
      console.error(err);
    } finally {
      setSession(null);
      navigate('/login');
    }
  }

  return (
    <div className="navbar">
      <h1>DarkNotes</h1>
      {isAuthenticated && (
        <div className="navbar-right">
          <span className="user-email">{user?.email}</span>
          <button className="btn btn-outline" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
