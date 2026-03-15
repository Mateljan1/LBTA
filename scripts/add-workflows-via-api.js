#!/usr/bin/env node
/**
 * Add .github/workflows/*.yml to the repo via GitHub API.
 * Use when git push fails with "refusing to allow an OAuth App to create or update workflow ... without workflow scope".
 *
 * 1. Create a Personal Access Token (PAT) at https://github.com/settings/tokens
 *    with scope: workflow (and repo).
 * 2. Run: GITHUB_TOKEN=ghp_YourToken node scripts/add-workflows-via-api.js
 * 3. Run: git pull origin main
 *
 * Requires: Node 18+ (fetch), and workflow files present at .github/workflows/
 */

const fs = require('fs');
const path = require('path');

const token = process.env.GITHUB_TOKEN;
if (!token) {
  console.error('Set GITHUB_TOKEN (with workflow scope). Example: GITHUB_TOKEN=ghp_xxx node scripts/add-workflows-via-api.js');
  process.exit(1);
}

let repo = process.env.GITHUB_REPO;
if (!repo) {
  try {
    const rem = fs.readFileSync(path.join(__dirname, '..', '.git/config'), 'utf8');
    const m = rem.match(/url = .*github\.com[:/]([^/]+\/[^/\s]+)/);
    if (m) repo = m[1].replace(/\.git$/, '');
  } catch (_) {}
  if (!repo) repo = 'Mateljan1/LBTA';
}
const [owner, repoName] = repo.split('/');
const workflows = [
  { path: '.github/workflows/quality-gate.yml', localPath: path.join(__dirname, '..', '.github/workflows/quality-gate.yml') },
  { path: '.github/workflows/lighthouse-scheduled.yml', localPath: path.join(__dirname, '..', '.github/workflows/lighthouse-scheduled.yml') },
];

async function getSha(o, r, filePath) {
  const res = await fetch(`https://api.github.com/repos/${o}/${r}/contents/${encodeURIComponent(filePath)}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github.v3+json' },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`${filePath} get: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.sha;
}

async function putFile(o, r, filePath, content, sha) {
  const body = {
    message: `Add ${filePath} via API (workflow scope)`,
    content: Buffer.from(content, 'utf8').toString('base64'),
    branch: 'main',
  };
  if (sha) body.sha = sha;
  const res = await fetch(`https://api.github.com/repos/${o}/${r}/contents/${encodeURIComponent(filePath)}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`${filePath} put: ${res.status} ${t}`);
  }
  return res.json();
}

(async () => {
  for (const { path: filePath, localPath } of workflows) {
    if (!fs.existsSync(localPath)) {
      console.error(`Missing ${localPath}`);
      process.exit(1);
    }
    const content = fs.readFileSync(localPath, 'utf8');
    const sha = await getSha(owner, repoName, filePath);
    await putFile(owner, repoName, filePath, content, sha);
    console.log(`Created/updated ${filePath}`);
  }
  console.log('Done. Run: git pull origin main');
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
