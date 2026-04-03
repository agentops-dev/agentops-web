import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

function hasYesFlag(argv: string[]): boolean {
  return argv.includes('--yes') || argv.includes('-y');
}

function hasOpenFlag(argv: string[]): boolean {
  return argv.includes('--open');
}

function ensureEnvFile(rootDir: string): { created: boolean; reason?: string } {
  const envPath = path.join(rootDir, '.env');
  const envExamplePath = path.join(rootDir, '.env.example');

  if (fs.existsSync(envPath)) {
    return { created: false, reason: '.env already exists' };
  }

  if (!fs.existsSync(envExamplePath)) {
    return { created: false, reason: '.env.example not found' };
  }

  fs.copyFileSync(envExamplePath, envPath);
  return { created: true };
}

function openLocalApp(url: string): void {
  exec(`open "${url}"`, (error) => {
    if (error) {
      console.log(`Could not auto-open browser: ${error.message}`);
      console.log(`Open manually: ${url}`);
      return;
    }
    console.log(`Opened ${url}`);
  });
}

function run(): void {
  const argv = process.argv.slice(2);
  const rootDir = process.cwd();
  const yes = hasYesFlag(argv);
  const open = hasOpenFlag(argv);
  const appUrl = process.env.APP_URL ?? 'http://localhost:3000/app';

  console.log('AgentOps onboarding');
  console.log('-------------------');

  if (!yes) {
    console.log('Tip: run with --yes to skip confirmations: npm run onboard -- --yes');
  }

  const envResult = ensureEnvFile(rootDir);
  if (envResult.created) {
    console.log('Created .env from .env.example');
  } else if (envResult.reason) {
    console.log(`Skipped .env creation: ${envResult.reason}`);
  }

  console.log('');
  console.log('Next steps:');
  console.log('1) Update secrets in .env');
  console.log('2) Start dev server: npm run dev');
  console.log(`3) Open app: ${appUrl}`);

  if (open) {
    console.log('');
    console.log('Open flag detected. Trying to open local app...');
    openLocalApp(appUrl);
  }
}

run();
