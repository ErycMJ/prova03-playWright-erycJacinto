import http from 'k6/http';
import { check, sleep } from 'k6';
import { ENDPOINTS } from './config.js';

export const options = {
    stages: [
        { duration: '1m', target: 10 },
        { duration: '30s', target: 200 },
        { duration: '1m', target: 10 },
        { duration: '1m', target: 0 },
    ],
    thresholds: {
        http_req_duration: ['p(95)<2000'],
        http_req_failed: ['rate<0.15'],
    },
};

export default function () {
    const responses = http.batch([
        ['GET', ENDPOINTS.customers],
        ['GET', ENDPOINTS.products],
    ]);

    check(responses[0], { 'Customers respondeu': (r) => r.status >= 200 });
    check(responses[1], { 'Products respondeu': (r) => r.status >= 200 });

    sleep(0.5);
}
