
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const PORT = 5950;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Serve the production build from the dist folder
// - no need to use during development!
const distFolderPath = path.join(__dirname, '..', 'dist');
const indexHtmlPath = path.join(distFolderPath, 'index.html');

// start an express server
const app = express();

// make reading request bodies possible
app.use(express.json({ limit: '100MB' }));

// serve the dist folder
app.use(express.static(distFolderPath));

// serve the index file on all unresolved paths
app.get('*', (_req, res) => {
  res.sendFile(indexHtmlPath);
});

// save log
app.post('/api/save-log', (req, res) => {
  fs.writeFileSync(
    path.join(__dirname, '..', 'logs',
      Object.keys(req.body)[0].replaceAll(' ', '-').replaceAll(':', '-') + '.json'),
    JSON.stringify(req.body, null, '  '),
    'utf-8'
  );
  res.json({ ok: true });
});

app.listen(PORT, () => console.log('Listening on http://localhost:' + PORT));