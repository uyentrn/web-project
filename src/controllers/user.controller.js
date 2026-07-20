const {
  handle,
  sendSuccess,
} = require('./response');

const {
  body,
  optionalString,
  authenticatedUser,
} = require('./validation');

module.exports = function createUserController(userService) {
  if (!userService) {
    throw new Error('User controller requires a user service.');
  }

  return {
    getProfile: handle(async (req, res) => {
      const { userId } = authenticatedUser(req);

      const user = await userService.getProfile(userId);

      return sendSuccess(res, user);
    }),

    updateProfile: handle(async (req, res) => {
      const input = body(req);

      const { userId } = authenticatedUser(req);

      const user = await userService.updateProfile(userId, {
        name: optionalString(input.name, 'Name'),
      });

      return sendSuccess(res, user);
    }),
  };
};