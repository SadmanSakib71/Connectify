const mapUserToResponse = (user) => ({
  id: user.id,
  firstName: user.first_name,
  lastName: user.last_name,
  email: user.email,
  createdAt: user.created_at,
});

module.exports = { mapUserToResponse };
