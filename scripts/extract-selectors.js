const selectors = {
  login: {
    emailInput: [
      'input[name="email"]',
      'input[type="email"]',
      '#email',
      '#email-field',
      '[data-testid="email"]',
      '.email-input'
    ],
    passwordInput: [
      'input[name="password"]',
      'input[type="password"]',
      '#password',
      '#password-field',
      '[data-testid="password"]',
      '.password-input'
    ],
    submitButton: [
      'button[type="submit"]',
      'button:contains("Login")',
      'button:contains("Entrar")',
      '#submit-btn',
      '.btn-login',
      '[data-testid="submit-button"]'
    ],
    errorMessage: [
      '.alert-danger',
      '.error-message',
      '.alert.alert-danger',
      '[role="alert"]',
      '.form-error'
    ]
  },

  home: {
    navbar: [
      'nav',
      'header nav',
      '.navbar',
      '.navbar-main',
      '[data-testid="navbar"]'
    ],
    signInButton: [
      'a[href*="login"]',
      'a[href*="signin"]',
      'button:contains("Sign In")',
      'button:contains("Login")',
      '.btn-signin',
      '[data-testid="signin-btn"]'
    ],
    ctaButton: [
      '.btn-primary',
      'button.btn-primary',
      'a.btn-primary',
      '[data-testid="cta-button"]',
      '.btn-cta'
    ],
    heroSection: [
      '.hero',
      '.hero-section',
      '.jumbotron',
      '[data-testid="hero"]'
    ]
  },

  signup: {
    nameInput: [
      'input[name="name"]',
      'input[name="fullName"]',
      '#name',
      '[data-testid="name"]',
      '.name-input'
    ],
    emailInput: [
      'input[name="email"]',
      'input[type="email"]',
      '#email',
      '[data-testid="email"]'
    ],
    passwordInput: [
      'input[name="password"]',
      'input[type="password"]',
      '#password',
      '[data-testid="password"]'
    ],
    confirmPasswordInput: [
      'input[name="confirmPassword"]',
      'input[name="password_confirm"]',
      '#confirm-password',
      '[data-testid="confirm-password"]'
    ],
    submitButton: [
      'button[type="submit"]',
      'button:contains("Sign Up")',
      'button:contains("Registrar")',
      '.btn-signup'
    ]
  },

  dashboard: {
    userMenu: [
      '.user-menu',
      '.profile-menu',
      '[data-testid="user-menu"]',
      '.dropdown-menu'
    ],
    logoutButton: [
      'button:contains("Logout")',
      'button:contains("Sair")',
      'a[href*="logout"]',
      '.btn-logout'
    ],
    addTransactionButton: [
      'button:contains("Add")',
      'button:contains("Nova Transação")',
      '.btn-add-transaction',
      '[data-testid="add-transaction"]'
    ]
  }
};

/**
 * Testa um seletor
 */
function testSelector(selector) {
  try {
    const elements = document.querySelectorAll(selector);
    return {
      selector,
      found: elements.length > 0,
      count: elements.length,
      element: elements[0]
        ? {
            tag: elements[0].tagName,
            className: elements[0].className,
            id: elements[0].id,
            text: elements[0].textContent?.substring(0, 50)
          }
        : null
    };
  } catch (e) {
    return {
      selector,
      error: e.message,
      found: false
    };
  }
}

/**
 * Testa todos os seletores de uma categoria
 */
function testCategory(categoryName, categorySelectors) {
  console.log(`\n📋 Testando: ${categoryName}`);
  console.log('='.repeat(60));

  Object.entries(categorySelectors).forEach(([key, selectorsArray]) => {
    console.log(`\n🔍 ${key}:`);

    let found = false;
    selectorsArray.forEach(selector => {
      const result = testSelector(selector);

      if (result.found && !found) {
        console.log(`  ✅ ENCONTRADO: ${result.selector}`);
        console.log(`     Tag: <${result.element.tag}>`);
        if (result.element.id) console.log(`     ID: ${result.element.id}`);
        if (result.element.className)
          console.log(`     Classes: ${result.element.className}`);
        console.log(`     Texto: "${result.element.text}..."`);
        found = true;
      } else if (result.found && found) {
      } else {
        console.log(`  ❌ Não encontrado: ${result.selector}`);
      }
    });

    if (!found) {
      console.log(`  ⚠️  Nenhum seletor funcionou para ${key}`);
    }
  });
}

if (typeof window !== 'undefined') {
  window.SelectorExtractor = {
    test: testSelector,
    testAll: categoryName => {
      if (selectors[categoryName]) {
        testCategory(categoryName, selectors[categoryName]);
      } else {
        console.log('Categorias disponíveis:', Object.keys(selectors));
      }
    },
    selectors
  };

  console.log('✅ SelectorExtractor carregado!');
  console.log('Use: window.SelectorExtractor.testAll("login")');
  console.log('Ou: window.SelectorExtractor.test("seu-seletor")');
}

module.exports = { selectors, testSelector, testCategory };
