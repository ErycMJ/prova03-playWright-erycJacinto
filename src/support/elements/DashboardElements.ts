export const dashboardElements = {
  sidebar: 'aside',
  sidebarLogo: 'aside a[href="/"]',
  dashboardLink: 'a[href*="dashboard"]',
  transactionLink: 'a[href*="transaction"]',
  categoryLink: 'a[href*="category"]',
  profileLink: 'a[href*="profile"]',
  goalsLink: 'a[href*="goals"]',

  navbar: 'nav',
  userMenu: '[role="menu"]',
  profileButton: 'button[aria-label*="profile"]',
  logoutButton: 'a[href*="signout"], button:has-text("Logout")',

  mainContent: 'main',
  dashboardTitle: 'h1',

  addTransactionButton: 'button:has-text("Add"), button:has-text("Nova")',
  transactionList: 'table, div[role="grid"]',
  transactionRow: 'tr, div[role="row"]',
  transactionAmount: 'td:nth-child(2)',
  transactionCategory: 'td:nth-child(3)',
  transactionDate: 'td:nth-child(4)',

  categorySelect: 'select[name="category"], [role="combobox"]',
  amountInput: 'input[name="amount"], input[type="number"]',
  descriptionInput: 'input[name="description"], textarea[name="description"]',
  dateInput: 'input[type="date"]',
  submitButton: 'button[type="submit"]',

  errorAlert: '[role="alert"]',
  successAlert: '[role="status"]',
  loadingSpinner: '[role="progressbar"]',

  modal: '[role="dialog"]',
  modalCloseButton: 'button[aria-label="close"], button[aria-label="Close"]'
};
