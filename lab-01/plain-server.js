// Lab 1 - Task 3: Basic Node.js HTTP server
const http = require('http');

const server = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' });
  response.end('Hello');
});

server.listen(3000, () => {
  console.log('Plain HTTP server running at http://localhost:3000');
});
