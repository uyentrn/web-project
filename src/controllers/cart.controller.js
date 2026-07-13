const { handle, sendEmptySuccess, sendSuccess } = require('./response');
const { body, id, authenticatedUser, requiredPositiveInteger } = require('./validation');

module.exports = function createCartController(cartService) {
  if (!cartService) throw new Error('Cart controller requires a cart service.');

  return {
    get: handle(async (req, res) => {
      const { userId } = authenticatedUser(req);
      return sendSuccess(res, await cartService.get(userId));
    }),

    addItem: handle(async (req, res) => {
      const { userId } = authenticatedUser(req);
      const input = body(req);
      const data = await cartService.addItem(userId, {
        variantId: id(input.variant_id, 'Variant ID'),
        quantity: requiredPositiveInteger(input.quantity, 'Quantity'),
      });
      return sendSuccess(res, data, 201);
    }),

    updateItem: handle(async (req, res) => {
      const { userId } = authenticatedUser(req);
      const input = body(req);
      const data = await cartService.updateItem(userId, id(req.params?.itemId, 'Cart item ID'), requiredPositiveInteger(input.quantity, 'Quantity'));
      return sendSuccess(res, data);
    }),

    removeItem: handle(async (req, res) => {
      const { userId } = authenticatedUser(req);
      await cartService.removeItem(userId, id(req.params?.itemId, 'Cart item ID'));
      return sendEmptySuccess(res);
    }),
  };
};
