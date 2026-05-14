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
    expectedStreamIds: ['fleet-health', 'telemetry-ingest', 'command-latency', 'battery-state'],
  },
  {
    name: 'harborlift-robotics',
    url: 'http://localhost:4201',
    expectedText: 'Yard Operations',
    addTileId: 'container-move-progress',
    expectedStreamIds: [
      'container-move-progress',
      'container-throughput',
      'dock-utilization',
      'aisle-congestion',
      'route-blockage',
      'charging-queue-depth',
      'charging-wait-minutes',
      'handoff-status',
    ],
  },
  {
    name: 'terragrid-autonomy',
    url: 'http://localhost:4202',
    expectedText: 'Field Operations',
    addTileId: 'route-progress',
    expectedStreamIds: [
      'gps-route-progress',
      'field-coverage',
      'inspection-progress',
      'battery-state',
      'drive-temperature',
      'wind-speed',
      'payloads-ready',
      'hazard-markers',
      'terrain-state',
      'payload-state',
      'weather-conditions',
    ],
  },
];

async function verifyResponsiveLayout(page, dashboardName) {
  const viewports = [
    { name: 'desktop', width: 1440, height: 1000 },
    { name: 'tablet', width: 900, height: 900 },
    { name: 'mobile', width: 390, height: 844 },
  ];

  for (const viewport of viewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.waitForTimeout(300);
    const result = await page.evaluate((isDesktop) => {
      const rect = (selector) => {
        const element = document.querySelector(selector);
        if (!element) {
          return null;
        }

        const bounds = element.getBoundingClientRect();
        return {
          top: Number(bounds.top.toFixed(2)),
          left: Number(bounds.left.toFixed(2)),
          bottom: Number(bounds.bottom.toFixed(2)),
          width: Number(bounds.width.toFixed(2)),
          height: Number(bounds.height.toFixed(2)),
        };
      };

      const shell = rect('.dashboard-shell');
      const rail = rect('viam-rail-nav');
      window.scrollTo(0, 600);
      const header = rect('viam-platform-top-app-bar');
      const railAfterScroll = rect('viam-rail-nav');

      return {
        shellAtLeastViewport: Boolean(shell && shell.height >= window.innerHeight),
        noHorizontalOverflow:
          document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1,
        headerSticky: Boolean(header && header.top === 0),
        railFlushLeft: !isDesktop || Boolean(rail && rail.left === 0),
        railCoversViewportBottom:
          !isDesktop || Boolean(rail && rail.bottom >= window.innerHeight - 1),
        railCoversScrolledViewportBottom:
          !isDesktop ||
          Boolean(railAfterScroll && railAfterScroll.bottom >= window.innerHeight - 1),
      };
    }, viewport.name === 'desktop');

    const failed = Object.entries(result)
      .filter(([, value]) => value !== true)
      .map(([name]) => name);

    if (failed.length > 0) {
      throw new Error(
        `${dashboardName} ${viewport.name} layout verification failed: ${failed.join(', ')}`,
      );
    }

    await page.evaluate(() => window.scrollTo(0, 0));
  }

  await page.setViewportSize({ width: 1440, height: 1000 });
}

async function verifyTelemetry(page, dashboard) {
  await page.waitForFunction(
    (streamIds) => {
      const samples = window.__ninjaTelemetrySamples;
      return (
        Array.isArray(samples) &&
        streamIds.every((streamId) => samples.some((sample) => sample?.streamId === streamId))
      );
    },
    dashboard.expectedStreamIds,
    { timeout: 60_000 },
  );

  await page.waitForFunction(
    () =>
      Array.isArray(window.__ninjaMachines) &&
      window.__ninjaMachines.length > 0 &&
      window.__ninjaMachines.every((machine) => typeof machine?.batteryPercent === 'number'),
    null,
    { timeout: 45_000 },
  );
}

async function verifySelectContrast(page, dashboardName) {
  const result = await page.locator('select[aria-label^="Resize"]').first().evaluate((select) => {
    const selectStyle = getComputedStyle(select);
    const option = select.options[0];
    const optionStyle = option ? getComputedStyle(option) : null;

    return {
      selectColor: selectStyle.color,
      selectBackground: selectStyle.backgroundColor,
      optionColor: optionStyle?.color ?? '',
      optionBackground: optionStyle?.backgroundColor ?? '',
    };
  });

  const unreadable =
    result.selectColor === result.selectBackground ||
    result.optionColor === result.optionBackground ||
    !result.optionColor ||
    !result.optionBackground;

  if (unreadable) {
    throw new Error(
      `${dashboardName} tile size select contrast failed: ${JSON.stringify(result)}`,
    );
  }
}

await mkdir(videoRoot, { recursive: true });

const browser = await chromium.launch({ headless: false });
const manifest = [];

try {
  for (const dashboard of dashboards) {
    const tempVideoDir = path.join(videoRoot, '_recording-temp', dashboard.name);
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
    await verifyResponsiveLayout(page, dashboard.name);

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
    await verifyTelemetry(page, dashboard);

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

    await page.locator('label.edit-toggle').click({ force: true });
    await page.locator('viam-tile-add-form').waitFor({ timeout: 10_000 });

    const tileCountBeforeAdd = await page.locator('viam-dashboard-tile').count();
    const addSelect = page.getByLabel('Available tiles');
    const availableTileIds = await addSelect
      .locator('option')
      .evaluateAll((options) => options.map((option) => option.value));
    if (!availableTileIds.includes(dashboard.addTileId)) {
      throw new Error(
        `${dashboard.name} add-tile list did not include ${dashboard.addTileId}`,
      );
    }
    await addSelect.selectOption(dashboard.addTileId);
    await page.locator('form.tile-add-form button[type="submit"]').click({ force: true });
    await page.waitForTimeout(300);
    if ((await page.locator('viam-dashboard-tile').count()) === tileCountBeforeAdd) {
      await page.locator('form.tile-add-form').evaluate((form) => form.requestSubmit());
    }
    await page.waitForFunction(
      (count) => document.querySelectorAll('viam-dashboard-tile').length > count,
      tileCountBeforeAdd,
      { timeout: 10_000 },
    );

    const resizeSelect = page.locator('select[aria-label^="Resize"]').first();
    await verifySelectContrast(page, dashboard.name);
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
      expectedStreamsObserved: dashboard.expectedStreamIds,
      selectContrastVerified: true,
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
