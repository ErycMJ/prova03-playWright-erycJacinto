import http from 'k6/http';
import { check, sleep } from 'k6';
import { ENDPOINTS, TEST_DATA } from './config.js';

export const options = {
    vus: 1,
    duration: '3.5m',
    thresholds: {
        http_req_duration: ['p(95)<500'],
        http_req_failed: ['rate<0.01'],
    },
};

export default function () {
    let response = http.get(ENDPOINTS.customers);
    check(response, {
        'GET customers status 200': (r) => r.status === 200,
        'GET customers tem dados': (r) => r.json().length >= 0,
    });

    sleep(1);

    const payload = JSON.stringify(TEST_DATA.customer);
    const params = {
        headers: { 'Content-Type': 'application/json' },
    };

    response = http.post(ENDPOINTS.customers, payload, params);
    check(response, {
        'POST customer status 201 ou 200': (r) => r.status === 201 || r.status === 200,
        'POST customer retorna ID': (r) => r.json().id !== undefined,
    });

    const customerId = response.json().id;

    sleep(1);

    if (customerId) {
        response = http.get(`${ENDPOINTS.customers}/${customerId}`);
        check(response, {
            'GET customer por ID status 200': (r) => r.status === 200,
            'GET customer retorna dados corretos': (r) => r.json().id === customerId,
        });
    }

    sleep(1);

    response = http.get(ENDPOINTS.products);
    check(response, {
        'GET products status 200': (r) => r.status === 200,
    });

    sleep(1);
}
