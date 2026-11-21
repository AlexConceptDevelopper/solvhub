import fs from 'fs';
import path from 'path';

const DOMAIN = 'https://www.solvhub.fr';
const API_URL = 'https://api.solvhub.fr/api';
const today = new Date().toISOString().split('T')[0];

const staticPages = [
  { route: '/', changefreq: 'daily', priority: '1.0' },
  { route: '/problems', changefreq: 'daily', priority: '0.9' },
  { route: '/categories', changefreq: 'weekly', priority: '0.8' },
  { route: '/ranking', changefreq: 'weekly', priority: '0.6' },
  { route: '/ranking/solutions', changefreq: 'weekly', priority: '0.5' },
  { route: '/ranking/contributors', changefreq: 'weekly', priority: '0.5' },
  { route: '/ranking/problems', changefreq: 'weekly', priority: '0.5' },
  { route: '/legal', changefreq: 'yearly', priority: '0.2' },
  { route: '/cgu', changefreq: 'yearly', priority: '0.2' },
  { route: '/privacy', changefreq: 'yearly', priority: '0.2' },
];

function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function normalizeList(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.content)) return payload.content;
  if (payload && Array.isArray(payload.data)) return payload.data;
  return [];
}

async function fetchJson(endpoint) {
  try {
    const res = await fetch(`${API_URL}${endpoint}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return normalizeList(json);
  } catch (err) {
    console.warn(`⚠️ Erreur sur ${endpoint} :`, err.message);
    return [];
  }
}

async function generateSitemap() {
  console.log('⏳ Génération du sitemap SolvHub depuis l’API...');

  const [problems, solutions, categories] = await Promise.all([
    fetchJson('/problems/dto'),
    fetchJson('/solutions/dto'),
    fetchJson('/categories/with-count'),
  ]);

  const dynamicUrls = [];
  const seen = new Set();

  function addDynamicUrl(loc, changefreq, priority) {
    if (!loc || seen.has(loc)) return;
    seen.add(loc);
    dynamicUrls.push({ loc, changefreq, priority });
  }

  // Catégories actives (avec au moins 1 problème) -> /categories/:id
  categories.forEach((cat) => {
    const id = cat.idCategory ?? cat.id;
    const count = cat.problemCount ?? 1;
    if (id != null && count > 0) {
      addDynamicUrl(`${DOMAIN}/categories/${id}`, 'weekly', '0.7');
    }
  });

  // Problèmes -> /problem/:id-:slug
  problems.forEach((p) => {
    const id = p.idProblem ?? p.id;
    if (id == null) return;
    const slug = slugify(p.title);
    const pathSegment = slug ? `${id}-${slug}` : `${id}`;
    addDynamicUrl(`${DOMAIN}/problem/${pathSegment}`, 'weekly', '0.8');
  });

  // Solutions -> /solution/:id-:slug
  solutions.forEach((s) => {
    const id = s.idSolution ?? s.id;
    if (id == null) return;
    const slug = slugify(s.title);
    const pathSegment = slug ? `${id}-${slug}` : `${id}`;
    addDynamicUrl(`${DOMAIN}/solution/${pathSegment}`, 'monthly', '0.8');
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages
  .map(
    (p) => `  <url>
    <loc>${DOMAIN}${p.route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
  )
  .join('\n')}
${dynamicUrls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  const publicDir = path.resolve('public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap.trim());
  console.log(
    `✅ Sitemap généré (${staticPages.length} statiques + ${dynamicUrls.length} dynamiques : ${categories.length} cats, ${problems.length} problèmes, ${solutions.length} solutions).`
  );
}

generateSitemap();