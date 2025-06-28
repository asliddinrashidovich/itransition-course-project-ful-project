const User = require('../models/user.model');

// [GET] /api/users/all – faqat admin ko‘radi
exports.getAllUsers = async (req, res) => {
  try {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'isAdmin', 'createdAt'],
      order: [['createdAt', 'DESC']],
    });

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// [GET] /api/users/me – o‘zini ko‘rish
exports.getMe = async (req, res) => {
  try {
    const { id, name, email, isAdmin } = req.user;
    res.json({ id, name, email, isAdmin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// PATCH status (block/unblock)
exports.updateUsersStatus = async (req, res) => {
  const { userIds, status } = req.body;
  try {
    await User.update({ isBlocked: status === 'block' }, { where: { id: userIds } });
    res.json({ message: `Users ${status}ed successfully` });
  } catch (err) {
    res.status(500).json({ message: 'Error updating status' });
  }
};

// PATCH role (admin/user)
exports.updateUsersRole = async (req, res) => {
  const { userIds, role } = req.body;
  try {
    await User.update({ isAdmin: role === 'admin' }, { where: { id: userIds } });
    res.json({ message: `Users updated to role: ${role}` });
  } catch (err) {
    res.status(500).json({ message: 'Error updating role' });
  }
};

// DELETE users
exports.deleteUsers = async (req, res) => {
  const { userIds } = req.body;
  try {
    await User.destroy({ where: { id: userIds } });
    res.json({ message: 'Users deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting users' });
  }
};
