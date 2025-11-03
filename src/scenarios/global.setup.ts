import { test as setup } from '@playwright/test';

setup('global setup', async () => {
  // Setup global para todos os testes
  // Pode ser usado para setup de dados, login compartilhado, etc
  console.log('🚀 Global setup iniciado');
});
