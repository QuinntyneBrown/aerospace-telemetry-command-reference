import { createRequire } from 'node:module';
import { mkdir, rename, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(new URL('../frontend/package.json', import.meta.url));
const { chromium } = require('playwright');

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');
const videoRoot = path.join(repoRoot, 'artifacts', 'videos');

const dashboards = [
  {
    name: 'white-label-operations-console',
    url: 'http://localhost:4200',
    expectedText: 'Reference Operations',
    addTileId: 'command-latency-chart',
  },
  {
    name: 'harborlift-robotics',
    url: 'http://localhost:4201',
    expectedText: 'Yard Operations',
    addTileId: 'container-move-progress',
  },
  {
    name: 'terragrid-autonomy',
    url: 'http://localhost:4202',
    expectedText: 'Field Operations',
    addTileId: 'route-progress',
  },
];

await mkdir(videoRoot, { recursive: true });

const browser = await chromium.launch({ headless: false });
const manifest = [];

try {
  for (const dashboard of dashboards) {
    const tempVideoDir = path.join(videoRoot, `${dashboard.name}-raw`);
    await rm(tempVideoDir, { recursive: true, force: true });
    await mkdir(tempVideoDir, { recursive: true });

    const context = await browser.newContext({
      viewport: { width: 1440, height: 1000 },
      recordVideo: {
        dir: tempVideoDir,
        size: { width: 1440, height: 1000 },
      },
    });

    const page = await context.newPage();
    page.on('console', (message) => {
      if (message.type() === 'error') {
        console.log(`[${dashboard.name}] browser console error: ${message.text()}`);
      }
    });

    await page.goto(dashboard.url, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.getByText(dashboard.expectedText).waitFor({ timeout: 45_000 });
    await page.locator('canvas').first().waitFor({ timeout: 45_000 });

    await page.waitForFunction(
      () =>
        Array.isArray(window.__ninjaTelemetrySamples) &&
        window.__ninjaTelemetrySamples.length > 0 &&
        window.__ninjaTelemetrySamples.some(
          (sample) => sample?.metadata?.source === 'backend-signalr',
        ),
      null,
      { timeout: 45_000 },
    );

    const initialSampleCount = await page.evaluate(() => window.__ninjaTelemetrySamples.length);
    await page.waitForFunction(
      (count) => window.__ninjaTelemetrySamples.length > count,
      initialSampleCount,
      { timeout: 45_000 },
    );

    await page.waitForFunction(
      () => {
        const canvas = document.querySelector('canvas');
        if (!(canvas instanceof HTMLCanvasElement) || canvas.width === 0 || canvas.height === 0) {
          return false;
        }

        const context = canvas.getContext('2d');
        if (!context) {
          return false;
        }

        const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
        for (let index = 3; index < pixels.length; index += 4) {
          if (pixels[index] > 0) {
            return true;
          }
        }

        return false;
      },
      null,
      { timeout: 10_000 },
    );

    await page.getByLabel('Toggle dashboard edit mode').check({ force: true });

    const tileCountBeforeAdd = await page.locator('viam-dashboard-tile').count();
    const addSelect = page.getByLabel('Available tiles');
    await addSelect.selectOption(dashboard.addTileId);
    await page.getByRole('button', { name: 'Add' }).click();
    await page.waitForFunction(
      (count) => document.querySelectorAll('viam-dashboard-tile').length > count,
      tileCountBeforeAdd,
      { timeout: 10_000 },
    );

    const resizeSelect = page.locator('select[aria-label^="Resize"]').first();
    await resizeSelect.selectOption('full');
    await page.waitForTimeout(900);
    await resizeSelect.selectOption('medium');
    await page.waitForTimeout(900);

    const tileCountBeforeRemove = await page.locator('viam-dashboard-tile').count();
    await page.locator('button[aria-label^="Remove"]').last().click();
    await page.waitForFunction(
      (count) => document.querySelectorAll('viam-dashboard-tile').length < count,
      tileCountBeforeRemove,
      { timeout: 10_000 },
    );

    await page.waitForTimeout(3_000);
    const observedSampleCount = await page.evaluate(
      () => window.__ninjaTelemetrySamples?.length ?? 0,
    );

    const video = page.video();
    await context.close();

    const rawPath = await video.path();
    const finalPath = path.join(videoRoot, `${dashboard.name}.webm`);
    await rm(finalPath, { force: true });
    await rename(rawPath, finalPath);
    await rm(tempVideoDir, { recursive: true, force: true });

    manifest.push({
      dashboard: dashboard.name,
      url: dashboard.url,
      video: finalPath,
      telemetrySamplesObserved: observedSampleCount,
    });

    console.log(`Recorded ${dashboard.name}: ${finalPath}`);
  }
} finally {
  await browser.close();
}

await writeFile(
  path.join(videoRoot, 'manifest.json'),
  JSON.stringify({ generatedAt: new Date().toISOString(), videos: manifest }, null, 2),
);
