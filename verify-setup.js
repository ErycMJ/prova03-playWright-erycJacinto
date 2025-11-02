#!/usr/bin/env node

/**
 * Script de verificação de dependências e configuração do projeto
 * Uso: node verify-setup.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFileExists(filePath) {
  return fs.existsSync(path.join(process.cwd(), filePath));
}

function getNodeVersion() {
  try {
    const output = execSync('node --version', { encoding: 'utf-8' });
    return output.trim();
  } catch {
    return null;
  }
}

function runCheck() {
  log('\n🔍 Verificando configuração do projeto E2E Playwright...\n', 'blue');

  const checks = [
    { name: 'Node.js instalado', fn: () => getNodeVersion() !== null },
    { name: 'package.json', fn: () => checkFileExists('package.json') },
    { name: 'playwright.config.ts', fn: () => checkFileExists('playwright.config.ts') },
    { name: 'tsconfig.json', fn: () => checkFileExists('tsconfig.json') },
    { name: 'src/scenarios/', fn: () => checkFileExists('src/scenarios') },
    { name: 'src/support/elements/', fn: () => checkFileExists('src/support/elements') },
    { name: 'src/support/pages/', fn: () => checkFileExists('src/support/pages') },
    { name: 'src/support/fixtures/', fn: () => checkFileExists('src/support/fixtures') },
    { name: '.github/workflows/ci.yml', fn: () => checkFileExists('.github/workflows/ci.yml') },
    { name: 'sonar-project.properties', fn: () => checkFileExists('sonar-project.properties') }
  ];

  let passed = 0;
  let failed = 0;

  checks.forEach(check => {
    if (check.fn()) {
      log(`✅ ${check.name}`, 'green');
      passed++;
    } else {
      log(`❌ ${check.name}`, 'red');
      failed++;
    }
  });

  log(`\n📊 Resultados: ${passed} passaram, ${failed} falharam\n`, 'blue');

  const nodeVersion = getNodeVersion();
  log(`Node.js: ${nodeVersion}`, nodeVersion && nodeVersion.includes('v22') ? 'green' : 'yellow');

  try {
    const playwright = execSync('npm list @playwright/test 2>&1', { encoding: 'utf-8' });
    if (playwright.includes('@playwright/test@1.56.1')) {
      log('✅ Playwright 1.56.1 instalado', 'green');
    } else {
      log('⚠️  Versão diferente do Playwright', 'yellow');
    }
  } catch {
    log('❌ Playwright não instalado', 'red');
  }

  if (failed === 0) {
    log('\n🎉 Projeto configurado corretamente!\n', 'green');
    return 0;
  } else {
    log('\n⚠️  Alguns arquivos estão faltando. Execute npm install\n', 'yellow');
    return 1;
  }
}

process.exit(runCheck());
