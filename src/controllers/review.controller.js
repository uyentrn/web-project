const { invalid } = require('../services/errors');
const { handle, sendEmptySuccess, sendSuccess } = require('./response');
const { body, id, authenticatedUser, optionalString, pagination, requiredPositiveInteger } = require('./validation');

module.exports = function createReviewController(reviewService) {
  if (!reviewService) throw new Error('Review controller requires a review service.');

  function reviewInput(input, { partial = false } = {}) {
    const result = {};
    if (!partial || input.rating !== undefined) {
      const rating = requiredPositiveInteger(input.rating, 'Rating');
      if (rating > 5) throw invalid('Rating must be an integer from 1 to 5.');
      result.rating = rating;
    }
    if (!partial || input.comment !== undefined) {
      result.comment = input.comment === null ? null : optionalString(input.comment, 'Comment');
    }
    return result;
  }

  return {
    listForProduct: handle(async (req, res) => sendSuccess(res, await reviewService.listForProduct(id(req.params?.id, 'Product ID'), pagination(req.query)))),

    create: handle(async (req, res) => {
      const { userId } = authenticatedUser(req);
      const data = await reviewService.create(userId, id(req.params?.id, 'Product ID'), reviewInput(body(req)));
      return sendSuccess(res, data, 201);
    }),

    update: handle(async (req, res) => {
      const { userId } = authenticatedUser(req);
      const data = await reviewService.update(userId, id(req.params?.reviewId, 'Review ID'), reviewInput(body(req), { partial: true }));
      return sendSuccess(res, data);
    }),

    remove: handle(async (req, res) => {
      const { userId } = authenticatedUser(req);
      await reviewService.remove(userId, id(req.params?.reviewId, 'Review ID'));
      return sendEmptySuccess(res);
    }),
  };
};
