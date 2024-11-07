const express = require('express');
const { body } = require("express-validator");
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middlewares/authenticateToken')


router.post('/users/registrate', [
    body("name")
      .isLength({ min: 1 })
      .withMessage("Имя пользователя должно содержать минимум 1 символ")
      .matches(/^[A-Z]/)
      .withMessage('Имя пользователя должно начинаться с заглавной буквы.'),
    body("surname")
      .isLength({ min: 1 })
      .withMessage("Фамилия пользователя должна содержать минимум 1 символ")
      .matches(/^[A-Z]/)
      .withMessage('Фамилия пользователя должна начинаться с заглавной буквы.'),
    body("email")
      .normalizeEmail()
      .isEmail()
      .withMessage('Введите правильный адрес электронной почты.'),
    body("password")
      .isLength({ min: 6 })
      .withMessage('Пароль должен содержать минимум 6 символов.')
      .matches(/^[A-Z]/)
      .withMessage('Пароль должен начинаться с заглавной буквы.')
      .matches(/\d/)
      .withMessage('Пароль должен содержать хотя бы одну цифру.')
      .matches(/^[A-Za-z0-9]+$/)
      .withMessage('Пароль может содержать только буквы и цифры, без специальных символов.'),
    ], userController.registrateUser);

router.post('/users/login', [
    body("email")
      .normalizeEmail()
      .isEmail()
      .withMessage("Введите корректный email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage('Пароль должен содержать минимум 6 символов.')
      .matches(/^[A-Z]/)
      .withMessage('Пароль должен начинаться с заглавной буквы.')
      .matches(/\d/)
      .withMessage('Пароль должен содержать хотя бы одну цифру.')
      .matches(/^[A-Za-z0-9]+$/)
      .withMessage('Пароль может содержать только буквы и цифры, без специальных символов.'),
    ], userController.loginUser);

router.get('/users', authenticateToken, userController.getAllUsers);

router.get('/users/group/:id', authenticateToken, userController.getAllUsersByGroupId);

router.get('/users/:id', authenticateToken, userController.getUserById);

router.put('/users/:id', authenticateToken, userController.updateUser);

router.delete('/users/:id', authenticateToken, userController.deleteUser);

router.put('/users/group/:id', authenticateToken, userController.addGroupToUser);

router.put('/users/avatar/:id', authenticateToken, userController.addAvatarToUser);

router.put('/users/achievements/:id', authenticateToken, userController.addAchievementToUser);

module.exports = router;