const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const HOST = '127.0.0.1';
const PORT = Number(process.env.PORT || 3000);
const ROOT_DIR = __dirname;
const DATA_DIR = path.join(ROOT_DIR, 'data');

const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.mp4': 'video/mp4',
  '.png': 'image/png',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8'
};

const apiHandlers = {
  '/api/contact': {
    file: 'contact-submissions.ndjson',
    required: ['name', 'designation', 'email', 'phone', 'institution', 'institutionType'],
    message: 'Message received. Our team will get back to you shortly.'
  },
  '/api/careers': {
    file: 'career-applications.ndjson',
    required: ['name', 'email', 'phone', 'role', 'experience', 'motivation'],
    message: 'Application received. Thank you for applying to IQ-Line.'
  },
  '/api/newsletter': {
    file: 'newsletter-subscriptions.ndjson',
    required: ['email'],
    message: 'You are subscribed to the IQ-Line newsletter.'
  }
};

const server = http.createServer(async (request, response) => {
  try {
    const requestUrl = new URL(request.url, 'http://' + request.headers.host);

    if (request.method === 'POST' && apiHandlers[requestUrl.pathname]) {
      await handleApiRequest(request, response, requestUrl.pathname);
      return;
    }

    if (request.method === 'GET' || request.method === 'HEAD') {
      await serveStaticFile(requestUrl.pathname, response, request.method === 'HEAD');
      return;
    }

    sendJson(response, 405, { error: 'Method not allowed.' });
  } catch (error) {
    sendJson(response, 500, { error: 'Internal server error.', details: error.message });
  }
});

server.listen(PORT, HOST, () => {
  console.log('IQ-Line site running at http://' + HOST + ':' + PORT);
});

async function handleApiRequest(request, response, pathname) {
  const config = apiHandlers[pathname];
  const payload = await parseJsonBody(request);
  const missingFields = config.required.filter(field => !String(payload[field] || '').trim());

  if (missingFields.length > 0) {
    sendJson(response, 400, {
      error: 'Missing required fields.',
      fields: missingFields
    });
    return;
  }

  await fs.promises.mkdir(DATA_DIR, { recursive: true });

  const record = {
    type: pathname.replace('/api/', ''),
    receivedAt: new Date().toISOString(),
    payload
  };

  await fs.promises.appendFile(
    path.join(DATA_DIR, config.file),
    JSON.stringify(record) + '\n',
    'utf8'
  );

  sendJson(response, 200, {
    ok: true,
    message: config.message
  });
}

async function parseJsonBody(request) {
  const chunks = [];

  for await (const chunk of request) {
    chunks.push(chunk);
  }

  const rawBody = Buffer.concat(chunks).toString('utf8').trim();
  if (!rawBody) {
    return {};
  }

  return JSON.parse(rawBody);
}

async function serveStaticFile(requestPath, response, headOnly) {
  let safePath = decodeURIComponent(requestPath);

  if (safePath === '/') {
    safePath = '/index.html';
  }

  const normalized = path.normalize(safePath).replace(/^(\.\.[/\\])+/, '');
  const filePath = path.join(ROOT_DIR, normalized);

  if (!filePath.startsWith(ROOT_DIR)) {
    sendJson(response, 403, { error: 'Forbidden path.' });
    return;
  }

  let stats;
  try {
    stats = await fs.promises.stat(filePath);
  } catch (error) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
    return;
  }

  const targetPath = stats.isDirectory() ? path.join(filePath, 'index.html') : filePath;
  const extension = path.extname(targetPath).toLowerCase();
  const contentType = MIME_TYPES[extension] || 'application/octet-stream';

  response.writeHead(200, { 'Content-Type': contentType });
  if (headOnly) {
    response.end();
    return;
  }

  fs.createReadStream(targetPath).pipe(response);
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8'
  });
  response.end(JSON.stringify(payload));
}
