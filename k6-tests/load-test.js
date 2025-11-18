import http from 'k6/http';
import { check, sleep } from 'k6';
import { ENDPOINTS, TEST_DATA } from './config.js';

export const options = {
    stages: [
        { duration: '2m', target: 7  },
        { duration: '5m', target: 10 },
        { duration: '2m', target: 20 },
        { duration: '5m', target: 20 },
        { duration: '2m', target: 92 },
    ],
    thresholds: {
        http_req_duration: ['p(95)<800'],
        http_req_failed: ['rate<0.05'],
    },
};

export default function () {
    const params = {
        headers: { 'Content-Type': 'application/json' },
    };

    let response = http.get(ENDPOINTS.products);
    check(response, {
        'Lista produtos OK': (r) => r.status === 200,
    });

    sleep(2);

    const customerPayload = JSON.stringify({
        ...TEST_DATA.customer,
        email: `k6-${__VU}-${Date.now()}@example.com`,
        cpf: `${100000000 + __VU}`,
    });

    response = http.post(ENDPOINTS.customers, customerPayload, params);
    check(response, {
        'Cria customer OK': (r) => r.status === 201 || r.status === 200,
    });

    const customerId = response.json().id;

    sleep(1);

    response = http.get(ENDPOINTS.customers);
    check(response, {
        'Lista customers OK': (r) => r.status === 200,
    });

    sleep(2);

    if (customerId) {
        response = http.get(`${ENDPOINTS.customers}/${customerId}`);
        check(response, {
            'Busca customer OK': (r) => r.status === 200,
        });
    }

    sleep(1);

    response = http.get(ENDPOINTS.orders);
    check(response, {
        'Lista orders OK': (r) => r.status === 200,
    });

    sleep(3);
}
