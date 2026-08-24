import { readFile } from 'fs/promises';
import path from 'path';

const cache = new Map();

async function loadFile(rel) {
  if (cache.has(rel)) return cache.get(rel);
  const p = path.join(process.cwd(), 'templates', rel);
  const text = await readFile(p, 'utf8');
  cache.set(rel, text);
  return text;
}

export async function getHomeBody()    { return loadFile('home-body.html'); }
export async function getHomeStyles()  { return loadFile('home-style.css'); }
export async function getPrivacyBody() { return loadFile('privacy-body.html'); }
export async function getPrivacyStyles(){ return loadFile('privacy-style.css'); }
export async function getTermsBody()   { return loadFile('terms-body.html'); }
export async function getTermsStyles() { return loadFile('terms-style.css'); }
