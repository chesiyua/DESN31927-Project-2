import express from 'express';
import mongoose from 'mongoose';
import { connectDB } from './db.js';
import { Signup } from './models/Signup.js';

const app = express();
app.use(express.json());

// Make sure MongoDB is connected before any /signups route runs.
async function ensureDb(_req, res, next) {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ error: 'Database connection failed.', detail: err.message });
  }
}

function handleError(err, res) {
  if (err?.name === 'ValidationError') {
    const messages = Object.values(err.errors || {}).map((e) => e.message);
    return res.status(400).json({ error: messages.join(' ') || 'Validation failed.' });
  }
  if (err?.name === 'CastError') {
    return res.status(404).json({ error: 'Sign-up not found.' });
  }
  return res.status(500).json({ error: 'Request failed.', detail: err.message });
}

const router = express.Router();
router.use(ensureDb);

// CREATE — POST /api/signups
router.post('/signups', async (req, res) => {
  try {
    const created = await Signup.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    handleError(err, res);
  }
});

// READ ALL — GET /api/signups (newest first)
router.get('/signups', async (_req, res) => {
  try {
    const items = await Signup.find({}).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    handleError(err, res);
  }
});

// READ ONE — GET /api/signups/:id
router.get('/signups/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ error: 'Sign-up not found.' });
    }
    const item = await Signup.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Sign-up not found.' });
    res.json(item);
  } catch (err) {
    handleError(err, res);
  }
});

// UPDATE — PUT /api/signups/:id
router.put('/signups/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ error: 'Sign-up not found.' });
    }
    const updated = await Signup.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ error: 'Sign-up not found.' });
    res.json(updated);
  } catch (err) {
    handleError(err, res);
  }
});

// DELETE — DELETE /api/signups/:id
router.delete('/signups/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ error: 'Sign-up not found.' });
    }
    const deleted = await Signup.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Sign-up not found.' });
    res.json({ message: 'Sign-up deleted.', id: deleted._id });
  } catch (err) {
    handleError(err, res);
  }
});

// Same router works locally (/api/...) and on Netlify (/.netlify/functions/api/...)
app.use('/api', router);
app.use('/.netlify/functions/api', router);

app.use((_req, res) => res.status(404).json({ error: 'Not found.' }));

export default app;
