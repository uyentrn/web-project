const { handle, sendEmptySuccess, sendSuccess } = require('./response');
const { body, id, requiredString } = require('./validation');

module.exports = function createCategoryController(categoryService) {
  if (!categoryService) throw new Error('Category controller requires a category service.');

  return {
    list: handle(async (_req, res) => sendSuccess(res, await categoryService.list())),
    getById: handle(async (req, res) => sendSuccess(res, await categoryService.getById(id(req.params?.id, 'Category ID')))),
    create: handle(async (req, res) => sendSuccess(res, await categoryService.create({ name: requiredString(body(req).name, 'Category name') }), 201)),
    update: handle(async (req, res) => sendSuccess(res, await categoryService.update(id(req.params?.id, 'Category ID'), { name: requiredString(body(req).name, 'Category name') }))),
    remove: handle(async (req, res) => {
      await categoryService.remove(id(req.params?.id, 'Category ID'));
      return sendEmptySuccess(res);
    }),
  };
};
