const { handle, sendSuccess } = require('./response');
const { body, id, authenticatedUser, pagination, requiredString } = require('./validation');

module.exports = function createOrderController(orderService) {
  if (!orderService) throw new Error('Order controller requires an order service.');

  return {
    checkout: handle(async (req, res) => {
      const { userId } = authenticatedUser(req);
      const data = await orderService.checkout(userId, { shippingAddress: requiredString(body(req).shippingAddress, 'Shipping address') });
      return sendSuccess(res, data, 201);
    }),

    list: handle(async (req, res) => {
      const { userId } = authenticatedUser(req);
      return sendSuccess(res, await orderService.listForUser(userId, pagination(req.query)));
    }),

    getById: handle(async (req, res) => {
      const { userId } = authenticatedUser(req);
      return sendSuccess(res, await orderService.getForUser(userId, id(req.params?.id, 'Order ID')));
    }),
  };
};
