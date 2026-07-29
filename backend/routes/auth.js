const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) return res.status(400).json({ error: error.message });

  res.json({ user: data.user, session: data.session });
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return res.status(401).json({ error: error.message });

  res.json({ user: data.user, session: data.session });
});

// POST /api/auth/logout
router.post('/logout', async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token)
    return res.status(400).json({ error: 'No session token provided' });

  const { error } = await supabase.auth.signOut(token);

  if (error) return res.status(400).json({ error: error.message });

  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
