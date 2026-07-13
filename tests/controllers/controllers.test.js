const createAuthController = require('../../src/controllers/auth.controller');
const createCartController = require('../../src/controllers/cart.controller');

function response() {
  const res = { status: jest.fn(), json: jest.fn(), send: jest.fn() };
  res.status.mockReturnValue(res);
  return res;
}

describe('controllers', () => {
  it('returns the registration payload in the documented success envelope', async () => {
    const authService = { register: jest.fn().mockResolvedValue({ user: { id: 'user-1' }, accessToken: 'access', refreshToken: 'refresh' }) };
    const controller = createAuthController(authService);
    const res = response();

    await controller.register({ body: { email: 'ada@example.com', password: 'long-enough', name: 'Ada' } }, res);

    expect(authService.register).toHaveBeenCalledWith({ email: 'ada@example.com', password: 'long-enough', name: 'Ada' });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ status: 'success', data: expect.objectContaining({ accessToken: 'access' }) }));
  });

  it('returns a validation envelope instead of calling the service for invalid login input', async () => {
    const authService = { login: jest.fn() };
    const res = response();

    await createAuthController(authService).login({ body: { email: '' } }, res);

    expect(authService.login).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ status: 'error' }));
  });

  it('returns 401 when a cart request reaches the controller without authenticated identity', async () => {
    const cartService = { get: jest.fn() };
    const res = response();

    await createCartController(cartService).get({}, res);

    expect(cartService.get).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ status: 'error', message: 'Authentication is required.' });
  });
});
