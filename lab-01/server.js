// Lab 1 - Tasks 4 to 6: Express server and routes
const express = require('express');

const app = express();
const PORT = 3000;

// GET / - welcome message
app.get('/', (request, response) => {
  response.status(200).send('Welcome to my Node.js and Express server!');
});

// GET /about - return your name and section as JSON
app.get('/about', (request, response) => {
  response.status(200).json({
    name: 'J DURGA PRASAD',
    section: 'AIML-2B / 207'
  });
});

// GET /time - return the current date and time
app.get('/time', (request, response) => {
  response.status(200).send(new Date().toString());
});

// Keep this 404 handler AFTER all valid routes
app.use((request, response) => {
  response.status(404).send('404 - Page not found');
});

app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}`);
});
