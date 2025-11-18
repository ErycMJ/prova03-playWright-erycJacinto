export const BASE_URL = 'http://localhost:3333';

export const ENDPOINTS = {
    customers: `${BASE_URL}/customers`,
    orders: `${BASE_URL}/orders`,
    products: `${BASE_URL}/products`,
};

export const TEST_DATA = {
    customer: {
        name: 'Test Customer K6',
        email: 'k6test@example.com',
        cpf: '12345678901',
    },
    product: {
        name: 'Test Product K6',
        price: 99.99,
        stock: 100,
    },
};
