const request = require('supertest');
const createApp = require('../../src/app');

function success(data = { ok: true }) {
  return (_req, res) => res.status(200).json({ status: 'success', data });
}

function createControllers() {
  return {
    auth: { register: success(), login: success(), refresh: success(), logout: success(null) },
    user: { getProfile: success(), updateProfile: success() },
    brand: { list: success(), getById: success() },
    category: { list: success(), getById: success(), create: success(), update: success(), remove: success(null) },
    product: { list: success({ products: [] }), search: success({ products: [] }), getById: success(), create: success(), update: success(), remove: success(null) },
    cart: { get: success({ items: [] }), addItem: success(), updateItem: success(), removeItem: success(null) },
    wishlist: { get: success(), addItem: success(), removeItem: success(null) },
    order: { checkout: success(), list: success(), getById: success() },
    payment: { create: success(), getById: success() },
    review: { listForProduct: success([]), create: success(), update: success(), remove: success(null) },
  };
}

function app() {
  return createApp({
    controllers: createControllers(),
    logger: { info: jest.fn() },
    tokenIssuer: {
      verifyAccess: jest.fn(async (token) => {
        if (token === 'customer-token') return { sub: 'user-1', sid: 'session-1', role: 'customer' };
        if (token === 'admin-token') return { sub: 'admin-1', sid: 'session-2', role: 'admin' };
        throw new Error('invalid token');
      }),
    },
  });
}

describe('application routes and security', () => {
  it('serves public catalog endpoints', async () => {
    const response = await request(app()).get('/api/products');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'success', data: { products: [] } });
  });

  it('rejects a protected cart request without a bearer token', async () => {
    const response = await request(app()).get('/api/cart');

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ status: 'error', message: 'Authentication is required.' });
  });

  it('rejects malformed JSON at the global error handler', async () => {
    const response = await request(app()).post('/api/cart').set('Authorization', 'Bearer customer-token').set('Content-Type', 'application/json').send('{');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ status: 'error', message: 'Request body must contain valid JSON.' });
  });

  it('rejects a customer attempting an admin product write', async () => {
    const response = await request(app()).post('/api/products').set('Authorization', 'Bearer customer-token').send({ name: 'Blocked' });

    expect(response.status).toBe(403);
    expect(response.body).toEqual({ status: 'error', message: 'You are not allowed to perform this action.' });
  });

  it('allows an admin product write', async () => {
    const response = await request(app()).post('/api/products').set('Authorization', 'Bearer admin-token').send({ name: 'Allowed' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'success', data: { ok: true } });
  });

  it('returns a consistent 404 response for an unknown endpoint', async () => {
    const response = await request(app()).get('/api/not-a-route');

    expect(response.status).toBe(404);
    expect(response.body).toEqual(expect.objectContaining({ status: 'error' }));
  });
});
