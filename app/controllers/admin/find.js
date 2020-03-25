const Admin = require('~models/Admin');

module.exports = async (req, res) => {
  const admins = await Admin.getAll();
  return res.json(admins);
};
