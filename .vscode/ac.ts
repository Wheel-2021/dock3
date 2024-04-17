export default defineEventHandler(async (event) => {
  const user = event.context.user;
  console.log('middleware', event.context);
  if (event.node.req.originalUrl?.indexOf('/api/admin') === 0) {
    if (!(user && user.role === 'admin')) {
      sendError(
        event,
        createError({
          statusCode: 401,
          statusMessage: 'Unauthenticated',
        })
      );
    }
  }
});
