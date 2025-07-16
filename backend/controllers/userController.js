const { User } = require("../models");
const crypto = require('crypto');

const generateApiToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

exports.getOrCreateApiToken = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user.api_token) {
      user.api_token = generateApiToken();
      await user.save();
    }
    res.json({ api_token: user.api_token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({attributes: ['id', 'name', 'email', 'isAdmin', 'isBlocked', 'createdAt'], order: [['createdAt', 'DESC']]});

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const { id, name, email, isAdmin } = req.user;
    res.json({ id, name, email, isAdmin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateUsersStatus = async (req, res) => {
  const { userIds, status } = req.body;

  if (!['block', 'unblock'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status type' });
  }

  try {
    await User.update({isBlocked: status == 'block'}, {where: {id: userIds}});
    res.json({ message: `Users successfully ${status}ed.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating status' });
  }
};

exports.updateUsersRole = async (req, res) => {
  const { userIds, role } = req.body;

  if (!['admin', 'user'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role type' });
  }

  try {
    await User.update( {isAdmin: role == 'admin'}, {where: {id: userIds}});
    res.json({ message: `Users updated to role: ${role}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating role' });
  }
};

exports.deleteUsers = async (req, res) => {
  const { userIds } = req.body;
  try {
    await User.destroy({where: { id: userIds}});
    res.json({ message: 'Users deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting users' });
  }
};

