#!/usr/bin/env node
// Scrapes exercise names + thumbnail GIF URLs from fitnessprogramer.com
// Outputs: data/fitnessprogramer-gifs.json  { "exercise name": "gif url", ... }

const MUSCLES = [
  'neck', 'trapezius', 'shoulders', 'chest', 'back', 'erector-spinae',
  'biceps', 'triceps', 'forearm', 'abs', 'leg', 'calf', 'hip', 'cardio', 'full-body',
];

const BASE = 'https://fitnessprogramer.com/exercise-primary-muscle';
const DELAY = 600; // ms between requests — be polite

const HEADERS = {
  'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'accept-language': 'en-US,en;q=0.6',
  'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36',
};

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function parseArticles(html) {
  const results = [];
  // Match each article block
  const articleRe = /<article[^>]*class="entry"[^>]*>([\s\S]*?)<\/article>/g;
  let am;
  while ((am = articleRe.exec(html)) !== null) {
    const block = am[1];

    // Exercise name from h2.title > a
    const nameMatch = block.match(/<h2[^>]*class="title"[^>]*>[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/);
    if (!nameMatch) continue;
    const name = nameMatch[1].trim().replace(/\s+/g, ' ');

    // Thumbnail img src
    const imgMatch = block.match(/<div[^>]*class="thumbnails"[^>]*>[\s\S]*?<img[^>]+src="([^"]+)"/);
    if (!imgMatch) continue;
    const src = imgMatch[1];

    results.push({ name, src });
  }
  return results;
}

function parseLastPage(html) {
  // Look for the highest page number in pagination
  const pageRe = /class="page-numbers"[^>]*>\s*<span class="page">(\d+)<\/span>/g;
  let last = 1;
  let m;
  while ((m = pageRe.exec(html)) !== null) {
    const n = parseInt(m[1], 10);
    if (n > last) last = n;
  }
  return last;
}

async function fetchPage(url) {
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

async function scrapeCategory(muscle) {
  const url = `${BASE}/${muscle}/`;
  console.log(`  → page 1: ${url}`);
  const html = await fetchPage(url);
  const entries = parseArticles(html);
  const lastPage = parseLastPage(html);
  console.log(`     ${entries.length} exercises, ${lastPage} page(s)`);

  for (let p = 2; p <= lastPage; p++) {
    await sleep(DELAY);
    const pageUrl = `${BASE}/${muscle}/page/${p}/`;
    console.log(`  → page ${p}: ${pageUrl}`);
    const pageHtml = await fetchPage(pageUrl);
    const more = parseArticles(pageHtml);
    console.log(`     ${more.length} exercises`);
    entries.push(...more);
  }

  return entries;
}

async function main() {
  const map = {};
  let total = 0;

  for (const muscle of MUSCLES) {
    console.log(`\n[${muscle}]`);
    try {
      const entries = await scrapeCategory(muscle);
      for (const { name, src } of entries) {
        const key = name.toLowerCase();
        if (!map[key]) {
          map[key] = src;
          total++;
        }
      }
    } catch (e) {
      console.error(`  ERROR: ${e.message}`);
    }
    await sleep(DELAY);
  }

  const fs = await import('fs');
  const path = await import('path');
  const outDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
  const outPath = path.join(outDir, 'fitnessprogramer-gifs.json');
  fs.writeFileSync(outPath, JSON.stringify(map, null, 2));
  console.log(`\nDone. ${total} unique exercises → ${outPath}`);
}

main().catch(e => { console.error(e); process.exit(1); });
