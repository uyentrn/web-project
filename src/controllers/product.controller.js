const { handle, sendEmptySuccess, sendSuccess } = require('./response');
const { body, id, optionalNonNegativeInteger, optionalPositiveInteger, optionalString, requiredString } = require('./validation');

module.exports = function createProductController(productService) {
  if (!productService) throw new Error('Product controller requires a product service.');

  function listOptions(query = {}) {
    return {
      category: optionalString(query.category, 'Category'),
      brand: optionalString(query.brand, 'Brand'),
      scent: optionalString(query.scent, 'Scent'),
      min_price: query.min_price,
      limit: optionalPositiveInteger(query.limit, 'Limit'),
      offset: optionalNonNegativeInteger(query.offset, 'Offset'),
    };
  }

  return {
    list: handle(async (req, res) => sendSuccess(res, await productService.list(listOptions(req.query)))),

    search: handle(async (req, res) => {
      const query = req.query || {};
      const data = await productService.search(requiredString(query.q, 'Search query'), {
        limit: optionalPositiveInteger(query.limit, 'Limit'),
        offset: optionalNonNegativeInteger(query.offset, 'Offset'),
      });
      return sendSuccess(res, data);
    }),

    getById: handle(async (req, res) => sendSuccess(res, await productService.getById(id(req.params?.id, 'Product ID')))),

    create: handle(async (req, res) => sendSuccess(res, await productService.create(body(req)), 201)),

    update: handle(async (req, res) => sendSuccess(res, await productService.update(id(req.params?.id, 'Product ID'), body(req)))),

    remove: handle(async (req, res) => {
      await productService.remove(id(req.params?.id, 'Product ID'));
      return sendEmptySuccess(res);
    }),
  };
};
