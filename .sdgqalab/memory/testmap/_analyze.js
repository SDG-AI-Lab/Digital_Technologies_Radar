/**
 * Structural coverage analysis for sdgqalab-testmap.
 * Classification: tests under pages/** (and tests/App) → integration;
 * co-located component/helper/radar/ui/layout tests → unit;
 * page helper widgets under pages/** with pure helpers → unit if colocated *.test
 * and path matches helpers/SelectMultiple/ProjectSlider/PopOverView.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../../..');
const SRC = path.join(ROOT, 'src');
const IGNORE = [
  /\.d\.ts$/,
  /setupTests/,
  /react-app-env/,
  /reportWebVitals/,
  /[\\/]index\.ts$/,
  /[\\/]types\.ts$/,
  /[\\/]types[\\/]/,
  /\.scss$/,
  /\.css$/,
  /projectslider\.dtest/,
  /[\\/]integration[\\/]/,
  /^tests\//,
  /^unit\//, // dedicated unit test folder — not production sources
  /[\\/]mocks[\\/]/,
  /[\\/]__mocks__[\\/]/
];

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === 'node_modules' || ent.name === 'coverage') continue;
      walk(p, acc);
    } else acc.push(p);
  }
  return acc;
}

function toPosix(p) {
  return p.split(path.sep).join('/');
}

function relSrc(abs) {
  return toPosix(path.relative(SRC, abs));
}

function isIgnored(rel) {
  return IGNORE.some((re) => re.test(rel.replace(/\\/g, '/')));
}

function scopeOf(rel) {
  const top = rel.split('/')[0];
  const known = [
    'components',
    'pages',
    'helpers',
    'radar',
    'ui',
    'layouts',
    'navigation'
  ];
  if (known.includes(top)) return top;
  return 'root';
}

/** Unit-classified page widgets (pure helpers / small widgets). */
const PAGE_UNIT_RE =
  /pages\/(homePage\/helpers|map-view\/helpers|map-view\/ProjectSlider|projectAction\/SelectMultiple|projectAction\/helpers|views\/PopOverView)\./;

function classifyTest(rel) {
  // Dedicated unit suites (incl. page modules exercised in isolation)
  if (rel.startsWith('unit/') || rel.includes('.unit.test.')) return 'unit';
  // tests under src/tests or pages → integration (except page unit widgets)
  if (rel.startsWith('tests/') || rel === 'tests/App.test.tsx') return 'integration';
  if (rel.includes('/integration/') || rel.includes('.integration.test.'))
    return 'integration';
  if (rel.startsWith('pages/')) {
    // colocated page tests are integration; widget unit exceptions
    const base = rel.replace(/\.test\.(tsx?|jsx?)$/, '');
    if (PAGE_UNIT_RE.test(base + '.')) return 'unit';
    return 'integration';
  }
  if (rel.startsWith('navigation/') && rel.includes('AppNav.test'))
    return 'integration';
  // components, helpers, radar, ui, layouts colocated → unit
  return 'unit';
}

function extractImports(content) {
  const mods = new Set();
  const re =
    /(?:import\s+(?:type\s+)?(?:[\s\S]*?)\s+from\s+|require\()\s*['"]([^'"]+)['"]/g;
  let m;
  while ((m = re.exec(content))) {
    const spec = m[1];
    if (spec.startsWith('.') || !spec.includes('/')) {
      // relative — resolve later with test file dir
      mods.add(spec);
    } else {
      // alias without extension: components/..., helpers/..., pages/..., etc.
      mods.add(spec);
    }
  }
  return [...mods];
}

function resolveImport(fromRel, spec) {
  const candidates = [];
  if (spec.startsWith('.')) {
    const base = path.posix.normalize(
      path.posix.join(path.posix.dirname(fromRel), spec)
    );
    candidates.push(base);
  } else {
    // strip leading aliases that map to src/
    candidates.push(spec);
    if (spec.startsWith('src/')) candidates.push(spec.slice(4));
  }
  const exts = ['', '.ts', '.tsx', '.js', '.jsx', '/index.ts', '/index.tsx'];
  for (const c of candidates) {
    for (const e of exts) {
      const rel = c + e;
      const abs = path.join(SRC, rel);
      if (fs.existsSync(abs) && fs.statSync(abs).isFile()) {
        return relSrc(abs);
      }
    }
  }
  return null;
}

function directMatch(sourceRel, testRels) {
  const stem = sourceRel.replace(/\.(tsx?|jsx?)$/, '');
  const base = path.posix.basename(stem);
  return testRels.some((t) => {
    const tStem = t.replace(/\.test\.(tsx?|jsx?)$/, '');
    return (
      tStem === stem ||
      tStem.endsWith('/' + base) ||
      t.includes(base + '.test.')
    );
  });
}

// --- collect sources ---
const allFiles = walk(SRC);
const sources = allFiles
  .filter((f) => /\.(ts|tsx)$/.test(f))
  .map(relSrc)
  .filter((r) => !r.includes('.test.'))
  .filter((r) => !isIgnored(r))
  .filter((r) => !r.includes('/integration/'))
  .sort();

const tests = allFiles
  .filter((f) => /\.test\.(ts|tsx)$/.test(f))
  .map(relSrc)
  .sort();

// Also App.test under src/tests
const appTest = path.join(SRC, 'tests/App.test.tsx');
if (fs.existsSync(appTest) && !tests.includes('tests/App.test.tsx')) {
  tests.push('tests/App.test.tsx');
}

const unitTests = tests.filter((t) => classifyTest(t) === 'unit');
const integTests = tests.filter((t) => classifyTest(t) === 'integration');

function coveredBy(testList) {
  const covered = new Set();
  for (const t of testList) {
    const abs = path.join(SRC, t);
    if (!fs.existsSync(abs)) continue;
    const content = fs.readFileSync(abs, 'utf8');
    // direct sibling match
    for (const s of sources) {
      if (directMatch(s, [t])) covered.add(s);
    }
    for (const spec of extractImports(content)) {
      const resolved = resolveImport(t, spec);
      if (resolved && sources.includes(resolved)) covered.add(resolved);
    }
  }
  return covered;
}

const unitCovered = coveredBy(unitTests);
const integCovered = coveredBy(integTests);

const scopes = [
  'components',
  'pages',
  'helpers',
  'radar',
  'ui',
  'layouts',
  'navigation',
  'root'
];

const by_scope = {};
for (const scope of scopes) {
  const scopeSources = sources.filter((s) => scopeOf(s) === scope);
  const scopeUnitTests = unitTests.filter((t) => {
    if (scope === 'root') return t.startsWith('tests/') || t === 'Logo.test.tsx';
    return t.startsWith(scope + '/');
  });
  const scopeIntegTests = integTests.filter((t) => {
    if (scope === 'root') return t.startsWith('tests/');
    if (scope === 'pages') return t.startsWith('pages/');
    if (scope === 'navigation') return t.startsWith('navigation/');
    // integration tests that live under pages/integration cover other scopes via imports
    return false;
  });
  // For integration test file counts per scope: count tests whose primary target is that scope
  // For pages scope, all pages/** integration tests; for others, 0 colocated unless navigation
  const unit_covered = scopeSources.filter((s) => unitCovered.has(s)).length;
  const integration_covered = scopeSources.filter((s) =>
    integCovered.has(s)
  ).length;
  by_scope[scope] = {
    source_files: scopeSources.length,
    sources: scopeSources,
    unit_test_files: scopeUnitTests.length,
    integration_test_files:
      scope === 'pages'
        ? integTests.filter((t) => t.startsWith('pages/')).length
        : scope === 'navigation'
          ? integTests.filter((t) => t.startsWith('navigation/')).length
          : scope === 'root'
            ? integTests.filter((t) => t.startsWith('tests/')).length
            : 0,
    unit_covered,
    integration_covered,
    unit_file_coverage_pct: scopeSources.length
      ? Math.round((unit_covered / scopeSources.length) * 1000) / 10
      : 0,
    integration_file_coverage_pct: scopeSources.length
      ? Math.round((integration_covered / scopeSources.length) * 1000) / 10
      : 0,
    unit_uncovered: scopeSources.filter((s) => !unitCovered.has(s)),
    integration_uncovered: scopeSources.filter((s) => !integCovered.has(s))
  };
}

// Cross-scope: pages/integration tests inflate integration_test_files only under pages,
// but integration_covered counts imports into components/helpers/etc.

const cypressDir = path.join(ROOT, 'cypress/e2e');
const cypress_specs = walk(cypressDir)
  .filter((f) => /\.cy\.(ts|js)$/.test(f))
  .map((f) => toPosix(path.relative(ROOT, f)))
  .sort();

const unit_pct =
  Math.round((unitCovered.size / sources.length) * 1000) / 10;
const integ_pct =
  Math.round((integCovered.size / sources.length) * 1000) / 10;

const out = {
  audited_at: new Date().toISOString(),
  frontend: {
    total_source_files: sources.length,
    sources,
    unit_test_files: unitTests.length,
    integration_test_files: integTests.length,
    unit_covered_files: [...unitCovered].sort(),
    integration_covered_files: [...integCovered].sort(),
    unit_file_coverage_pct: unit_pct,
    integration_file_coverage_pct: integ_pct,
    unit_tests: unitTests,
    integration_tests: integTests,
    by_scope,
    health: [],
    cypress_specs
  },
  api: {
    total_source_files: 1,
    sources: ['api.js'],
    test_files: walk(path.join(ROOT, 'tests/api'))
      .filter((f) => /\.test\.js$/.test(f))
      .map((f) => toPosix(path.relative(ROOT, f)))
  }
};

const outPath = path.join(__dirname, '_analysis.json');
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log(
  JSON.stringify(
    {
      sources: sources.length,
      unit_tests: unitTests.length,
      integ_tests: integTests.length,
      unit_covered: unitCovered.size,
      unit_pct,
      integ_covered: integCovered.size,
      integ_pct,
      by_scope: Object.fromEntries(
        Object.entries(by_scope).map(([k, v]) => [
          k,
          {
            src: v.source_files,
            u: v.unit_file_coverage_pct,
            i: v.integration_file_coverage_pct,
            u_cov: v.unit_covered,
            i_cov: v.integration_covered
          }
        ])
      )
    },
    null,
    2
  )
);
