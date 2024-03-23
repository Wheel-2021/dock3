export default defineEventHandler(async (event) => {
  const user = event.context.user;
  if (!user) {
    return {
      user: null,
    };
  }
  return {
    user: {
      id: user.id,
      mail: user.mail,
      name: user.name,
      filename: user.filename ? user.filename : null,
      role: user.role,
    },
  };
});
