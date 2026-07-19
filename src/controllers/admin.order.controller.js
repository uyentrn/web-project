const { handle, sendSuccess } = require('./response');
const { id, pagination } = require('./validation');

module.exports = function createAdminOrderController(orderService) {
  if (!orderService) {
    throw new Error('Admin order controller requires an order service.');
  }

  return {
    list: handle(async (req, res) => {
      const data = await orderService.listAll(pagination(req.query));
      return sendSuccess(res, data);
    }),

    getById: handle(async (req, res) => {
      const data = await orderService.getById(id(req.params?.id, 'Order ID'));
      return sendSuccess(res, data);
    }),
  };
};