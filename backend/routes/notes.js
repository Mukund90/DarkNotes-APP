const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');
const requireAuth = require('../middleware/authMiddleware');

// All routes below require a valid logged-in user
router.use(requireAuth);

// GET /api/notes  -> get all notes for the logged-in user (optional ?search=title)
router.get('/', async (req, res) => {
  const { search } = req.query;

  let query = supabase
    .from('notes')
    .select('*')
    .eq('user_id', req.user.id)
    .order('updated_at', { ascending: false });

  if (search) {
    query = query.ilike('title', `%${search}%`);
  }

  const { data, error } = await query;

  if (error) return res.status(400).json({ error: error.message });
  res.json({ notes: data });
});

// POST /api/notes -> create a new note
router.post('/', async (req, res) => {
  const { title, content } = req.body;

  if (!title) return res.status(400).json({ error: 'Title is required' });

  const { data, error } = await supabase
    .from('notes')
    .insert([{ title, content: content || '', user_id: req.user.id }])
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json({ note: data });
});

// PUT /api/notes/:id -> update an existing note
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  const { data, error } = await supabase
    .from('notes')
    .update({ title, content })
    .eq('id', id)
    .eq('user_id', req.user.id)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Note not found' });

  res.json({ note: data });
});

// DELETE /api/notes/:id -> delete a note
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', id)
    .eq('user_id', req.user.id);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Note deleted successfully' });
});

module.exports = router;
