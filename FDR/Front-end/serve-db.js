#!/usr/bin/env node
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const dbFile = path.join(process.cwd(), 'mock', 'db.json');
let data = {};

// Load JSON data
function loadData() {
  try {
    console.log('Loading DB from:', dbFile);
    const content = fs.readFileSync(dbFile, 'utf8');
    data = JSON.parse(content);
    console.log('✓ DB loaded');
  } catch (e) {
    console.error('✗ Failed to load DB:', e.message);
    console.error('CWD:', process.cwd());
    process.exit(1);
  }
}

loadData();

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const resourcePath = pathname.replace(/^\//, '').split('/')[0];

  if (req.method === 'GET') {
    if (data[resourcePath]) {
      res.writeHead(200);
      res.end(JSON.stringify(data[resourcePath]));
    } else {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Not found' }));
    }
  } else {
    res.writeHead(405);
    res.end(JSON.stringify({ error: 'Method not allowed' }));
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✓ Mock server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  Object.keys(data).forEach((key) => {
    console.log(`  http://localhost:${PORT}/${key}`);
  });
});
