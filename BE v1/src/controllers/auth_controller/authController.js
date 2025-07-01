const argon2 = require("argon2");
const model = require("../../models/auth.model");
const api = require("../../tools/common");
const { generateToken } = require("../../services/auth.service");

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return api.error(res, "Please provide both username and password", 400);
    }

    let users = await model.login(username); // Pastikan ini mengembalikan data yang sesuai
    if (users.length === 0) {
      return api.error(res, "Account Not Found", 404);
    }

    const user = users[0]; // Jika model.login() mengembalikan array
    if (!user.password) {
      return api.error(res, "Invalid user data: No password found", 500);
    }

    const passwordIsMatch = await verifyPassword(password, user.password);
    if (passwordIsMatch) {
      const payload = {
        id: user.id,
        username: user.username,
        roleId: user.role_id,
      };
      const token = generateToken(payload);
      return res.json({ token, user });
    } else {
      return api.error(res, "Incorrect Password!", 400);
    }
  } catch (err) {
    return api.error(res, "Internal Server Error", 500);
  }
};

const verifyPassword = async (plainPassword, hashedPassword) => {
  try {
    if (!hashedPassword || typeof hashedPassword !== "string") {
      console.log("Invalid hashed password provided");
    }
    return await argon2.verify(hashedPassword, plainPassword);
  } catch (err) {
    return false;
  }
};

module.exports = {
  login,
};
