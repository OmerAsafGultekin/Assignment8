import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

// Hard-coded programme courses
const COURSES = [
  { id: 'CS101', title: 'Introduction to Computer Systems', credits: 6 },
  { id: 'CS204', title: 'Computer Networks and Security', credits: 5 },
  { id: 'CS302', title: 'Web Server Architecture', credits: 5 }
];

// Serve static files
app.use(express.static('public'));

// Basic text and redirect routes
app.get('/hello', (req, res) => {
  res.send("Hello from Omer Asaf's server");
});

app.get('/robots.txt', (req, res) => {
  res.type('text/plain').send('User-agent: *\nDisallow:');
});

app.get('/old-page', (req, res) => {
  res.redirect('/hello');
});

// JSON API routes
app.get('/api/courses', (req, res) => {
  res.json(COURSES);
});

app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    nodeVersion: process.version,
    uptimeSeconds: Math.floor(process.uptime())
  });
});

app.get('/api/headers', (req, res) => {
  res.json({
    userAgent: req.get('User-Agent') || null,
    accept: req.get('Accept') || null
  });
});

app.post('/api/subscribe', (req, res) => {
  res.status(201).json({ subscribed: true });
});

app.get('/api/admin', (req, res) => {
  res.status(403).json({ error: 'Forbidden' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});