const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

const User = require("../models/User");
const Group = require("../models/Group");

const JWT_SECRET = "very_very_very_secret_key";

Group.hasMany(User, { foreignKey: "group_id" });

const registrateUser = async (req, res) => {
  try {
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, surname, email, password } = req.body;
    const status = 'student'
    const avatar_url = 'https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?semt=ais_hybrid'

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Пользователь с такой почтой уже существует!" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, surname, email, avatar_url, hashedPassword, status });

    const token = jwt.sign(
      { id: user.id, email: user.email, status: user.status },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json( {user, token} );
  } catch (err) {
    res.status(500).json({ error: "Ошибка создания пользователя " + err.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser)
      return res.status(400).json({ message: "Пользователя с такой почтой не существует!" });


    const isMatch = await bcrypt.compare(password, existingUser.hashedPassword);
    if (!isMatch)
      return res.status(400).json({ message: "Неверный пароль!" });

    const token = jwt.sign(
      { id: existingUser.id, email: existingUser.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });;
  } catch (err) {
    res.status(500).json({ error: "Ошибка создания пользователя " + err.message });
  }
};

const addGroupToUser = async (req, res) => {
  try {
    const { id, user_id } = req.body;

    const group = await Group.findByPk(id);

    if (group)
    {
        const user = await User.findByPk(user_id)
        user.group_id = group.id
        await user.save()
    }
    res.status(201).json({ group });
  } catch (err) {
    res.status(500).json({ error: "Ошибка добавления группы " + err.message });
  }
};

const addAchievementToUser = async (req, res) => {
    try {
      const { id, achievement } = req.body;
      const user = await User.findByPk(id);
  
      if (user)
      {
        var achievements = await user.dataValues.achievements
        if (achievements != null)
        {
          if (achievements.split(',').length > 0)
          {
            achievements = achievements + ', ' + achievement
          }
          else
          {
            achievements = achievement
          }
        }
        else
        {
          achievements = achievement
        }

        user.set("achievements", achievements)
        await user.save()
        res.status(201).json({ achievements });
      }
      else
      {
        res.status(404).json({ error: "Пользователь не найден" })
      }
    } catch (err) {
      res.status(500).json({ error: "Ошибка добавления достижения " + err.message });
    }
};

const addAvatarToUser = async (req, res) => {
    try {
      const { id, avatar_url } = req.body;
  
      const user = await User.findByPk(id);
  
      if (user)
      {
        user.set("avatar_url", avatar_url)
        await user.save()
      }
      res.status(201).json({ user });
    } catch (err) {
      res.status(500).json({ error: "Ошибка добавления аватарки " + err.message });
    }
};

const getAllUsersByGroupId = async (req, res) => {
  try {
    const { group_id } = req.body
    const usersWithGroup = await User.findAll({ where: { group_id } });

    if (usersWithGroup) {
      res.json(usersWithGroup);
    } else {
      console.log(`Пользователей в группе ещё нет.`);
    }
  } catch (err) {
    res.status(500).json({ error: "Ошибка при получении пользователей " + err.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: "Ошибка получения пользователей " + err.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: "Пользователь не найден" });
    }
  } catch (err) {
    res.status(500).json({ error: "Ошибка получения пользователя " + err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id, name, surname, about_me, interests, skills, email, password } = req.body;
    const user = await User.findByPk(id);
    if (user) {
      user.name = name || user.name;
      user.surname = surname || user.surname;
      user.about_me = about_me || user.about_me;
      user.interests = interests || user.interests;
      user.skills = skills || user.skills;
      user.email = email || user.email;
      user.password = password || user.password;
      await user.save();
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: "Пользователь не найден" });
    }
  } catch (err) {
    res.status(500).json({ error: "Ошибка обновления пользователя " + err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.body
    const user = await User.findByPk(id);
    if (user) {
      await user.destroy();
      res.status(200).json({ message: "Пользователь удален" });
    } else {
      res.status(404).json({ error: "Пользователь не найден" });
    }
  } catch (err) {
    res.status(500).json({ error: "Ошибка удаления пользователя " + err.message });
  }
};

module.exports = {
  registrateUser,
  loginUser,
  getAllUsers,
  getUserById,
  deleteUser,
  updateUser,
  getAllUsersByGroupId,
  addGroupToUser,
  addAchievementToUser,
  addAvatarToUser
};