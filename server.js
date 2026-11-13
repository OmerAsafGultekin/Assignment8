import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static('public'));

// Basic text and redirect routes
app.get('/hello', (req, res) => {
  res.send("Hello from Omer Asaf's server");
});

app.get('/robots.txt', (req, res) => {
  res.send('User-agent: *\nDisallow:');
});

app.get('/old-page', (req, res) => {
  res.redirect('/hello');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});