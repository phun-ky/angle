// Check what npm would publish: pack the package, check the tarball holds the
// files package.json points at, its LICENSE, README and CHANGELOG, and no
// tests, lint it with publint and @arethetypeswrong/cli, then install it in an
// empty project, check every source map resolves, and call angle() through
// import, require, the old dist path, the UMD build and a browser bundle. It
// also checks that the ES module and CommonJS builds bundle no dependencies.
// Run after `npm run build`.
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { rollup } from 'rollup';

import { execFileSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const BIN = join(ROOT, 'node_modules', '.bin');
/** Run a linter; return its output if it fails. */
const lint = (command, args) => {
  try {
    execFileSync(join(BIN, command), args, {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: 'pipe'
    });

    return undefined;
  } catch (error) {
    return `${error.stdout ?? ''}${error.stderr ?? ''}`.trim();
  }
};
// A bare package name after from, import( or require(
const IMPORT =
  /(?:\bfrom\s*|\bimport\s*\(?\s*|\brequire\s*\(\s*)["']([^"'.][^"']*)["']/g;
/** Every .map file under dir. */
const mapsIn = (dir) =>
  readdirSync(dir, { recursive: true })
    .filter((file) => file.endsWith('.map'))
    .map((file) => join(dir, file));
const npm = (args, cwd) =>
  execFileSync('npm', args, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'inherit']
  });
/** Every file path a package.json points at, without the leading ./ */
const entryPoints = (pkg) => {
  const paths = [];
  const collect = (value) => {
    if (typeof value === 'string') paths.push(value);
    else if (value && typeof value === 'object')
      Object.values(value).forEach(collect);
  };

  collect(pkg.exports);
  collect(pkg.main);
  collect(pkg.module);
  collect(pkg.types);
  collect(pkg.unpkg);
  collect(pkg.jsdelivr);

  // Subpath patterns such as ./dist/* are not files
  return paths
    .filter((path) => !path.includes('*'))
    .map((path) => path.replace(/^\.\//, ''));
};
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
const work = mkdtempSync(join(tmpdir(), 'angle-pack-'));
const problems = [];

try {
  const output = JSON.parse(
    npm(['pack', '--json', '--pack-destination', work], ROOT)
  );
  // An array in npm 11, an object keyed by package name in npm 12
  const packed = Array.isArray(output) ? output[0] : Object.values(output)[0];
  const files = new Set(packed.files.map((file) => file.path));

  // npm adds LICENSE and README.md on its own, if the package has them
  for (const path of [
    ...entryPoints(pkg),
    'LICENSE',
    'README.md',
    'CHANGELOG.md'
  ]) {
    if (!files.has(path)) problems.push(`${path} is not in the tarball`);
  }

  for (const path of files) {
    if (/(^|\/)__tests__\/|\.tsbuildinfo$/.test(path)) {
      problems.push(`${path} should not be published`);
    }
  }

  const tarball = join(work, packed.filename);
  const types = lint('attw', [tarball]);
  const publint = lint('publint', ['--strict', tarball]);

  if (types) problems.push(`@arethetypeswrong/cli:\n${types}`);

  if (publint) problems.push(`publint:\n${publint}`);

  console.log(
    `${pkg.name}@${pkg.version}: ${files.size} files, ${packed.size} bytes`
  );

  if (problems.length === 0) {
    const app = join(work, 'app');
    const installed = join(app, 'node_modules', pkg.name);

    mkdirSync(app);
    writeFileSync(
      join(app, 'package.json'),
      '{ "name": "app", "private": true }\n'
    );
    npm(
      [
        'install',
        '--no-audit',
        '--no-fund',
        '--ignore-scripts',
        // The dependencies come from the registry, preferably the cache
        '--prefer-offline',
        tarball
      ],
      app
    );

    // Runtime dependencies are declared, never bundled: the ES module and
    // CommonJS builds may not contain code from node_modules, and every
    // package they import must be a dependency. Only the UMD build (unpkg),
    // for script tags, may inline them.
    const declared = new Set([
      ...Object.keys(pkg.dependencies ?? {}),
      ...Object.keys(pkg.peerDependencies ?? {})
    ]);
    const importsOf = new Map();
    const moduleBuilds = new Set(
      [
        pkg.exports?.['.']?.import?.default,
        pkg.exports?.['.']?.require?.default,
        pkg.main,
        pkg.module
      ]
        .filter(Boolean)
        .map((path) => path.replace(/^\.\//, ''))
    );

    for (const file of moduleBuilds) {
      const code = readFileSync(join(installed, file), 'utf8');
      const map = `${join(installed, file)}.map`;
      const inlined = existsSync(map)
        ? JSON.parse(readFileSync(map, 'utf8')).sources.filter((source) =>
            source.includes('node_modules/')
          )
        : [];
      const imported = [...code.matchAll(IMPORT)]
        .map(([, specifier]) => specifier)
        .filter((specifier) => !specifier.startsWith('node:'))
        .map((specifier) =>
          specifier
            .split('/')
            .slice(0, specifier.startsWith('@') ? 2 : 1)
            .join('/')
        );

      for (const source of inlined) {
        problems.push(
          `${file} inlines ${source}; declare it in dependencies and keep it external`
        );
      }

      for (const name of new Set(imported)) {
        if (!declared.has(name))
          problems.push(`${file} imports ${name}, which isn't in dependencies`);
      }

      importsOf.set(file, new Set(imported));
    }

    // A browser can't resolve the bare imports of the ES module build, so the
    // README must not load that file from a CDN as is (?module, /+esm or an
    // import map resolve them)
    const esmBuild = (
      pkg.exports?.['.']?.import?.default ?? pkg.module
    )?.replace(/^\.\//, '');

    if (esmBuild && importsOf.get(esmBuild)?.size) {
      const readme = readFileSync(join(ROOT, 'README.md'), 'utf8');
      const raw = new RegExp(
        `https://[^\\s'"]+/${esmBuild.replaceAll('.', '\\.')}(?!\\?module)['"\\s]`,
        'g'
      );

      for (const [url] of readme.matchAll(raw)) {
        problems.push(
          `README.md loads ${url.slice(0, -1)} in a browser, but ${esmBuild} imports ${[...importsOf.get(esmBuild)].join(', ')}, which a browser can't resolve`
        );
      }
    }

    // Our own sources must be published next to the maps; bundled
    // dependencies are not installed, so their source must be embedded
    for (const map of mapsIn(installed)) {
      const { sources, sourcesContent = [] } = JSON.parse(
        readFileSync(map, 'utf8')
      );

      sources.forEach((source, index) => {
        const resolves = source.includes('node_modules/')
          ? typeof sourcesContent[index] === 'string'
          : existsSync(join(dirname(map), source));

        if (!resolves) {
          problems.push(
            `${relative(installed, map)} points at ${source}, which isn't published`
          );
        }
      });
    }

    const expect = `
      const check = (how, angle) => {
        if (typeof angle !== 'function') throw new Error(how + ': angle is ' + typeof angle);
        const value = angle(0, 0, -3, -4);
        if (Math.abs(value - 233.13) > 0.01) throw new Error(how + ': angle(0, 0, -3, -4) gave ' + value);
        console.log(how + ': angle(0, 0, -3, -4) = ' + value.toFixed(2));
      };
    `;
    const name = JSON.stringify(pkg.name);
    const umd = JSON.stringify(join(installed, pkg.unpkg ?? ''));
    const smokes = {
      'ES module import': [
        '--input-type=module',
        '-e',
        `${expect} const { angle } = await import(${name}); check('import', angle);`
      ],
      'CommonJS require': [
        '--input-type=commonjs',
        '-e',
        `${expect} check('require', require(${name}).angle);`
      ],
      // Deep imports worked before exports existed, and must keep working
      'dist path import': [
        '--input-type=module',
        '-e',
        `${expect} const { angle } = await import(${JSON.stringify(`${pkg.name}/dist/angle.esm.js`)}); check('dist path', angle);`
      ],
      // A <script> tag: no module system, the UMD build sets a global
      'UMD script global': [
        '--input-type=commonjs',
        '-e',
        `${expect} const vm = require('node:vm'); const sandbox = {}; vm.runInNewContext(require('node:fs').readFileSync(${umd}, 'utf8'), sandbox); check('UMD global', sandbox.angle?.angle);`
      ],
      // An AMD or CommonJS loader running the UMD build
      'UMD under CommonJS': [
        '--input-type=commonjs',
        '-e',
        `${expect} const vm = require('node:vm'); const module = { exports: {} }; vm.runInNewContext(require('node:fs').readFileSync(${umd}, 'utf8'), { module, exports: module.exports }); check('UMD CommonJS', module.exports.angle);`
      ]
    };

    if (!pkg.unpkg) {
      problems.push('package.json has no "unpkg" field for the UMD build');
      delete smokes['UMD script global'];
      delete smokes['UMD under CommonJS'];
    }

    for (const [how, args] of Object.entries(smokes)) {
      try {
        execFileSync('node', args, { cwd: app, stdio: 'inherit' });
      } catch {
        problems.push(`${how} of the installed tarball failed`);
      }
    }

    // A browser bundler resolving the package from the app
    try {
      const entry = join(app, 'entry.js');

      writeFileSync(
        entry,
        `import { angle } from ${name};\nglobalThis.result = angle(0, 0, -3, -4);\n`
      );

      const bundle = await rollup({
        input: entry,
        plugins: [nodeResolve({ browser: true, rootDir: app })]
      });
      const { output } = await bundle.generate({ format: 'iife' });
      const sandbox = {};

      await bundle.close();
      runInNewContext(output[0].code, sandbox);

      if (Math.abs(sandbox.result - 233.13) > 0.01)
        throw new Error(`angle(0, 0, -3, -4) gave ${sandbox.result}`);

      console.log(
        `browser bundle: angle(0, 0, -3, -4) = ${sandbox.result.toFixed(2)}`
      );
    } catch (error) {
      problems.push(
        `a browser bundle of the installed tarball failed: ${error}`
      );
    }
  }
} finally {
  rmSync(work, { recursive: true, force: true });
}

if (problems.length > 0) {
  console.error('\nThe package would not publish correctly:\n');
  for (const problem of problems) console.error(`  - ${problem}`);
  console.error(
    '\nCheck "files" in package.json, and run npm run build first.'
  );
  process.exit(1);
}

console.log(`\n${pkg.name} packs, installs, and works from every entry point.`);
