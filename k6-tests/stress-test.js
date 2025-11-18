import http from 'k6/http';
import { check, sleep } from 'k6';
import { ENDPOINTS } from './config.js';

export const options = {
    stages: [
        { duration: '2m', target: 50 },
        { duration: '5m', target: 50 },
        { duration: '2m', target: 100 },
        { duration: '5m', target: 100 },
        { duration: '2m', target: 150 },
        { duration: '5m', target: 150 },
        { duration: '3m', target: 0 },
    ],
    thresholds: {
        http_req_duration: ['p(95)<1500'],
        http_req_failed: ['rate<0.1'],
    },
};

export default function () {
    const batch = http.batch([
        ['GET', ENDPOINTS.customers],
        ['GET', ENDPOINTS.products],
        ['GET', ENDPOINTS.orders],
    ]);

    check(batch[0], { 'Batch customers OK': (r) => r.status === 200 });
    check(batch[1], { 'Batch products OK': (r) => r.status === 200 });
    check(batch[2], { 'Batch orders OK': (r) => r.status === 200 });

    sleep(1);
}
