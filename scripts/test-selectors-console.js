/**
 * 🔍 Script para Testar Seletores
 * Cole no Console do DevTools (F12 > Console) na página
 * Vai testar automaticamente os seletores mais comuns
 */

// Seletores mais prováveis para Login
const loginSelectors = {
  email: [
    'input[name="email"]',
    'input[type="email"]',
    '#email',
    '#email-input',
    '[data-testid="email"]',
    '.email-input',
    'input[placeholder*="email"]',
    'input[placeholder*="Email"]',
  ],
  password: [
    'input[name="password"]',
    'input[type="password"]',
    '#password',
    '#password-input',
    '[data-testid="password"]',
    '.password-input',
    'input[placeholder*="password"]',
    'input[placeholder*="Senha"]',
  ],
  submit: [
    'button[type="submit"]',
    'button.btn-primary',
    'button:has-text("Entrar")',
    'button:has-text("Login")',
    '.btn-submit',
    '[data-testid="submit"]',
    'button[name="submit"]',
  ],
  error: [
    '.alert-danger',
    '.alert.alert-danger',
    '[role="alert"]',
    '.error-message',
    '.form-error',
    '[class*="error"]',
  ],
};

// Função para testar seletor
function testSelector(selector) {
  try {
    const elements = document.querySelectorAll(selector);
    return {
      selector,
      found: elements.length > 0,
      count: elements.length,
      element: elements[0] ? {
        tag: elements[0].tagName,
        type: elements[0].type,
        name: elements[0].name,
        id: elements[0].id,
        className: elements[0].className,
        placeholder: elements[0].placeholder,
        text: elements[0].textContent?.substring(0, 50),
      } : null,
    };
  } catch (e) {
    return {
      selector,
      error: e.message,
      found: false,
    };
  }
}

// Testar uma categoria
function testCategory(categoryName, selectors) {
  console.log(`\n📋 ${categoryName.toUpperCase()}`);
  console.log('='.repeat(70));

  selectors.forEach((selector) => {
    const result = testSelector(selector);
    if (result.found) {
      console.log(`\n✅ ENCONTRADO: ${selector}`);
      console.log(`   Tag: <${result.element.tag}>`);
      if (result.element.type) console.log(`   Type: ${result.element.type}`);
      if (result.element.name) console.log(`   Name: ${result.element.name}`);
      if (result.element.id) console.log(`   ID: ${result.element.id}`);
      if (result.element.placeholder) console.log(`   Placeholder: ${result.element.placeholder}`);
      console.log(`   Classes: ${result.element.className}`);
      console.log(`   Texto: "${result.element.text}"`);
    }
  });
}

// Executar testes
console.log('🔍 TESTANDO SELETORES DE LOGIN');
console.log('='.repeat(70));

testCategory('Email Input', loginSelectors.email);
testCategory('Password Input', loginSelectors.password);
testCategory('Submit Button', loginSelectors.submit);
testCategory('Error Message', loginSelectors.error);

console.log('\n' + '='.repeat(70));
console.log('✅ TESTES COMPLETOS!');
console.log('\nCopie os seletores ✅ encontrados para:');
console.log('src/support/elements/LoginElements.ts');
