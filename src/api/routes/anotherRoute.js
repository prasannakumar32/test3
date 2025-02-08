import express from 'express';

const router = express.Router();

// ...existing code...

// Example route
router.get('/example', (req, res) => {
  res.json({ message: 'This is an example route' });
});

// New POST route
router.post('/submit', (req, res) => {
  const formData = req.body;
  // Process form data here
  res.json({ message: 'Form submitted successfully', data: formData });
});

// ...existing code...

export default router;
