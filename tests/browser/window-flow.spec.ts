import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

async function enterThroughOrb(page: Page) {
  await page.goto('/');
  await expect(page.getByRole('button', { name: /boot sugra os/i })).toBeVisible();
  const canvas = page.locator('.world-canvas canvas');
  await canvas.waitFor({ state: 'visible' });
  // Desktop composition places the interactive SUGRA orb at this canvas point.
  await canvas.click({ position: { x: 850, y: 340 } });
  await expect(page.getByRole('dialog', { name: 'SUGRA application window' })).toBeVisible({ timeout: 12_000 });
}

test('3D orb opens SUGRA; windows close, reopen, stack, focus, minimize, drag, and adapt to mobile', async ({ page }) => {
  test.setTimeout(180_000);
  const projectErrors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') projectErrors.push(message.text());
  });
  page.on('pageerror', (error) => projectErrors.push(error.message));

  await enterThroughOrb(page);
  const sugraWindow = page.getByRole('dialog', { name: 'SUGRA application window' });
  await expect(sugraWindow.getByRole('heading', { name: 'THE WORLD OF SUGARS' })).toBeVisible();

  // Critical milestone: open → close → open again from the dock.
  await page.getByRole('button', { name: 'Close SUGRA' }).click();
  await expect(sugraWindow).toHaveCount(0);
  await page.getByRole('button', { name: 'Open SUGRA', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'SUGRA application window' })).toBeVisible();

  // Multiple windows coexist; clicking a window focuses it and the dock restores minimized apps.
  await page.getByRole('button', { name: 'Open SUGRA launcher' }).click();
  await page.locator('.launcher-app').filter({ hasText: 'LORE' }).click();
  const loreWindow = page.getByRole('dialog', { name: 'LORE application window' });
  const reopenedSugra = page.getByRole('dialog', { name: 'SUGRA application window' });
  await expect(loreWindow).toBeVisible();
  await expect(reopenedSugra).toBeVisible();
  await expect(loreWindow).toHaveAttribute('data-active', 'true');

  // The dock focuses an existing app without creating a duplicate window.
  await page.getByRole('button', { name: 'Focus SUGRA' }).click();
  await expect(reopenedSugra).toHaveAttribute('data-active', 'true');
  const beforeDrag = await reopenedSugra.boundingBox();
  expect(beforeDrag).not.toBeNull();
  await page.mouse.move(beforeDrag!.x + 140, beforeDrag!.y + 22);
  await page.mouse.down();
  await page.mouse.move(beforeDrag!.x + 205, beforeDrag!.y + 75, { steps: 5 });
  await page.mouse.up();
  const afterDrag = await reopenedSugra.boundingBox();
  expect(afterDrag).not.toBeNull();
  expect(afterDrag!.x).toBeGreaterThan(beforeDrag!.x + 20);
  expect(afterDrag!.y).toBeGreaterThan(beforeDrag!.y + 20);
  await expect(reopenedSugra).toHaveAttribute('data-active', 'true');

  await page.getByRole('button', { name: 'Minimize SUGRA' }).click();
  await expect(reopenedSugra).toHaveCount(0);
  await page.getByRole('button', { name: 'Focus SUGRA' }).click();
  const restoredSugra = page.getByRole('dialog', { name: 'SUGRA application window' });
  await expect(restoredSugra).toBeVisible();
  await page.getByRole('button', { name: 'Maximize SUGRA' }).click();
  await expect(restoredSugra).toHaveClass(/is-maximized/);
  await page.getByRole('button', { name: 'Restore SUGRA' }).click();
  await expect(restoredSugra).not.toHaveClass(/is-maximized/);

  // Check the requested narrow phone widths with the real browser layout engine.
  for (const width of [320, 360, 375, 390, 412, 430]) {
    await page.setViewportSize({ width, height: 800 });
    const overflow = await page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
    expect(overflow, `horizontal overflow at ${width}px`).toBeLessThanOrEqual(0);
    const box = await page.getByRole('dialog', { name: 'SUGRA application window' }).boundingBox();
    expect(box, `SUGRA window missing at ${width}px`).not.toBeNull();
    expect(box!.width, `SUGRA window wider than ${width}px`).toBeLessThanOrEqual(width);
  }

  await page.setViewportSize({ width: 320, height: 800 });
  for (const controlName of ['Minimize SUGRA', 'Maximize SUGRA', 'Close SUGRA']) {
    const target = await page.getByRole('button', { name: controlName }).boundingBox();
    expect(target, `${controlName} target exists at 320px`).not.toBeNull();
    expect(target!.width, `${controlName} is at least 44px wide`).toBeGreaterThanOrEqual(44);
    expect(target!.height, `${controlName} is at least 44px high`).toBeGreaterThanOrEqual(44);
  }
  const startTarget = await page.getByRole('button', { name: 'Open SUGRA launcher' }).boundingBox();
  expect(startTarget).not.toBeNull();
  expect(startTarget!.width).toBeGreaterThanOrEqual(44);
  expect(startTarget!.height).toBeGreaterThanOrEqual(44);
  await page.getByRole('button', { name: 'Open SUGRA launcher' }).click();
  const launcherBox = await page.getByRole('dialog', { name: 'SUGRA application launcher' }).boundingBox();
  expect(launcherBox).not.toBeNull();
  expect(launcherBox!.x).toBeGreaterThanOrEqual(0);
  expect(launcherBox!.x + launcherBox!.width).toBeLessThanOrEqual(320);

  await page.locator('.launcher-close').click();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.getByRole('button', { name: 'Open GALLERY', exact: true }).click();
  const gallery = page.getByRole('dialog', { name: 'GALLERY application window' });
  await expect(gallery).toBeVisible();
  await gallery.getByRole('button', { name: 'Open artwork: SUGAR SIGNAL 001' }).click();
  const viewer = page.getByRole('dialog', { name: 'SUGAR SIGNAL 001 viewer' });
  await expect(viewer).toBeVisible();
  const viewerBox = await viewer.boundingBox();
  expect(viewerBox).not.toBeNull();
  expect(viewerBox!.x).toBe(0);
  expect(viewerBox!.width).toBe(1440);
  await viewer.locator('.viewer-controls').getByRole('button', { name: 'Next artwork' }).click();
  await expect(page.getByRole('dialog', { name: 'CUBE / SOFT FORM viewer' })).toBeVisible();
  await page.getByRole('dialog', { name: 'CUBE / SOFT FORM viewer' }).getByRole('button', { name: 'Close artwork viewer' }).click();
  await expect(page.getByRole('dialog', { name: 'CUBE / SOFT FORM viewer' })).toHaveCount(0);
  const appNames = ['SUGRA', 'LORE', 'TOKENOMICS', 'BUY', 'GALLERY', 'COMMUNITY', 'FAQ', 'CONTRACT', 'WALLET', 'ACTIVITY', 'TERMINAL', 'WORLD'];

  for (const appName of appNames) {
    await page.getByRole('button', { name: 'Open SUGRA launcher' }).click();
    const launcher = page.getByRole('dialog', { name: 'SUGRA application launcher' });
    await launcher.getByRole('button', { name: new RegExp(`^${appName}\\b`) }).click();
    const appWindow = page.getByRole('dialog', { name: `${appName} application window` });
    await expect(appWindow, `${appName} opens from the launcher`).toBeVisible();
    await expect(appWindow, `${appName} receives focus`).toHaveAttribute('data-active', 'true');
    await expect(appWindow.locator('.window-content'), `${appName} has usable content`).not.toBeEmpty();
  }

  const terminal = page.getByRole('dialog', { name: 'TERMINAL application window' });
  const commandInput = terminal.getByRole('textbox', { name: 'Enter a terminal command' });
  const runCommand = async (command: string) => {
    await page.getByRole('button', { name: 'Focus TERMINAL', exact: true }).click();
    await commandInput.fill(command);
    await commandInput.press('Enter');
  };

  await runCommand('help');
  await expect(terminal.getByText('AVAILABLE COMMANDS')).toBeVisible();
  await runCommand('world');
  await expect(page.getByRole('dialog', { name: 'WORLD application window' })).toBeVisible();
  await expect(terminal.getByText('Opening the world map…')).toBeVisible();
  await runCommand('lore');
  await expect(page.getByRole('dialog', { name: 'LORE application window' })).toBeVisible();
  await expect(terminal.getByText('ARGUS.WORLD / THE WORLD OF EYES')).toBeVisible();
  await runCommand('gallery');
  await expect(page.getByRole('dialog', { name: 'GALLERY application window' })).toBeVisible();
  await expect(terminal.getByText('ARCHIVE READY')).toBeVisible();
  await runCommand('wallet');
  await expect(page.getByRole('dialog', { name: 'WALLET application window' })).toBeVisible();
  await expect(terminal.getByText('WALLET CONNECTION IS USER-INITIATED.')).toBeVisible();
  await runCommand('activity');
  await expect(page.getByRole('dialog', { name: 'ACTIVITY application window' })).toBeVisible();
  await expect(terminal.getByText('NO SUGRA ONCHAIN ACTIVITY YET.')).toBeVisible();
  await runCommand('network');
  await expect(terminal.getByText('NETWORK / ARC')).toBeVisible();
  await expect(terminal.getByText('CHAIN ID / TBD')).toBeVisible();
  await runCommand('contract');
  await expect(terminal.getByText('CONTRACT / TBD')).toBeVisible();
  await expect(terminal.getByText('TOKEN STATUS / NOT YET DEPLOYED')).toBeVisible();
  await runCommand('sugar');
  await expect(terminal.getByText('SUGRA IS STILL RUNNING.')).toBeVisible();
  await runCommand('clear');
  await expect(terminal.locator('.terminal-entry')).toHaveCount(0);
  await page.waitForTimeout(250);
  expect(projectErrors).toEqual([]);
});
