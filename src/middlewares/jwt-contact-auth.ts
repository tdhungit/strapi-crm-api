import jwt from 'jsonwebtoken';

interface JwtPayload {
  id: number;
}

export default (config, { strapi }) => {
  return async (ctx, next) => {
    const authHeader = ctx.request.headers.authorization;
    if (authHeader?.startsWith('Token ')) {
      const token = authHeader.substring(6);
      try {
        const payload = jwt.verify(
          token,
          process.env.JWT_SECRET_CONTACT as string,
        ) as JwtPayload;
        ctx.state.contact = { ...payload };
      } catch (err) {
        // Có thể ghi log lỗi để debug
        return ctx.unauthorized('Invalid or expired token.');
      }
    }
    await next();
  };
};
