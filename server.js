const express = require('express');
const cors = require('cors');
const path = require('path');
const url = require('url');
const querystring = require('querystring');

const PORT = 3003;

const app = express();

// Enable CORS middleware
app.use(cors());

// In-memory user store
const users = [
  { username: 'testuser', password: 'testpassword' }
];

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  if (pathname === '/login' && req.method === 'POST') {
    // Login Page
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const params = querystring.parse(body);
      const username = params.username;
      const password = params.password;

      // Check if the user exists
      const user = users.find(u => u.username === username && u.password === password);

      if (user) {
        res.status(302).header('Location', '/').end();
      } else {
        res.status(401).type('text/plain').send('Unauthorized');
      }
    });
  } else {
    next(); // Pass the request to the next middleware
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
