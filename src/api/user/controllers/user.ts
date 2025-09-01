export default {
  async getAllUsers(ctx) {
    const filters = ctx.query.filters || {};
    const sort = ctx.query.sort || ['id:asc'];
    let { page, pageSize } = ctx.query;

    const config = await strapi
      .service('api::metadata.metadata')
      .getContentTypeConfiguration('plugin::users-permissions.user');
    page = page || 1;
    pageSize = pageSize || config.settings.pageSize;

    const allFields = strapi.getModel(
      'plugin::users-permissions.user'
    ).attributes;
    const safeFields = [];
    for (const fieldName in allFields) {
      const field = allFields[fieldName];
      if (
        !['resetPasswordToken', 'confirmationToken'].includes(fieldName) &&
        field.type !== 'password' &&
        field.type !== 'relation'
      ) {
        safeFields.push(fieldName);
      }
    }

    const users = await strapi.entityService.findMany(
      'plugin::users-permissions.user',
      {
        fields: safeFields,
        populate: ['role'],
        limit: parseInt(pageSize, 10),
        start: (page - 1) * pageSize,
        filters,
        sort,
      }
    );

    // Count total
    const total = await strapi.db
      .query('plugin::users-permissions.user')
      .count({
        where: ctx.query.filters || {},
      });

    return {
      data: users,
      meta: {
        pagination: {
          page: parseInt(page, 10),
          pageSize: parseInt(pageSize, 10),
          pageCount: Math.ceil(total / pageSize),
          total,
        },
      },
    };
  },

  async changeMyPassword(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('Authentication required');
    }

    const { currentPassword, newPassword, confirmPassword } = ctx.request.body;

    // Validate required fields
    if (!currentPassword || !newPassword || !confirmPassword) {
      return ctx.badRequest(
        'Current password, new password, and confirm password are required'
      );
    }

    // Validate new password confirmation
    if (newPassword !== confirmPassword) {
      return ctx.badRequest('New password and confirm password do not match');
    }

    // Validate new password strength (minimum 6 characters)
    if (newPassword.length < 6) {
      return ctx.badRequest('New password must be at least 6 characters long');
    }

    try {
      const bcrypt = require('bcryptjs');

      // Get the current user with password field
      const currentUser = await strapi.db
        .query('plugin::users-permissions.user')
        .findOne({
          where: {
            id: user.id,
          },
          select: ['id', 'email', 'password'],
        });

      if (!currentUser) {
        return ctx.notFound('User not found');
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(
        currentPassword,
        currentUser.password
      );

      if (!isCurrentPasswordValid) {
        return ctx.badRequest('Current password is incorrect');
      }

      // Hash the new password
      const saltRounds = 10;
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

      // Update the user's password
      await strapi.db.query('plugin::users-permissions.user').update({
        where: {
          id: user.id,
        },
        data: {
          password: hashedNewPassword,
        },
      });

      return ctx.send({
        message: 'Password changed successfully',
      });
    } catch (error) {
      strapi.log.error('Error changing password:', error);
      return ctx.internalServerError(
        'An error occurred while changing the password'
      );
    }
  },

  async changeUserPassword(ctx) {
    const { id: userId } = ctx.state.user;
    const { newPassword, confirmPassword } = ctx.request.body;

    // Validate new password confirmation
    if (newPassword !== confirmPassword) {
      return ctx.badRequest('New password and confirm password do not match');
    }

    // Validate new password strength (minimum 6 characters)
    if (newPassword.length < 6) {
      return ctx.badRequest('New password must be at least 6 characters long');
    }

    try {
      const bcrypt = require('bcryptjs');

      // Get the current user with password field
      const currentUser = await strapi.db
        .query('plugin::users-permissions.user')
        .findOne({
          where: {
            id: userId,
          },
          select: ['id', 'email', 'password'],
        });

      if (!currentUser) {
        return ctx.notFound('User not found');
      }

      // Hash the new password
      const saltRounds = 10;
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

      // Update the user's password
      await strapi.db.query('plugin::users-permissions.user').update({
        where: {
          id: userId,
        },
        data: {
          password: hashedNewPassword,
        },
      });

      return ctx.send({
        message: 'Password changed successfully',
      });
    } catch (error) {
      strapi.log.error('Error changing password:', error);
      return ctx.internalServerError(
        'An error occurred while changing the password'
      );
    }
  },

  async getCurrentUser(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('Authentication required');
    }

    const safeFields = ['id', 'email', 'username'];
    const currentUser = await strapi.db
      .query('plugin::users-permissions.user')
      .findOne({
        where: {
          id: user.id,
        },
        select: safeFields,
        populate: ['role'],
      });

    return ctx.send(currentUser);
  },

  async updateCurrentUser(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('Authentication required');
    }

    const { body } = ctx.request;

    const updatedUser = await strapi.db
      .query('plugin::users-permissions.user')
      .update({
        where: {
          id: user.id,
        },
        data: body,
      });

    return updatedUser;
  },
};
