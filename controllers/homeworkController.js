const jwt = require("jsonwebtoken");

const Homework = require("../models/Homework");
const Grade = require("../models/Grade");
const User = require("../models/User");
const Group = require("../models/Group");

User.hasMany(Homework, { foreignKey: "creator_id" });
Group.hasMany(Homework, { foreignKey: "group_id" });
Homework.hasMany(Grade, { foreignKey: "hw_id" });
User.hasMany(Grade, { foreignKey: "user_id" });

const createHomework = async (req, res) => {
    try {
      const { creator_id, group_id, name, description, fileUrl, deadlineStr } = req.body;
      const deadline = new Date(deadlineStr)
      console.log(deadline)

      const homework = await Homework.create({ creator_id, group_id, name, description, fileUrl, deadline })
      res.status(201).json(homework);
    } catch (err) {
      res.status(500).json({ error: "Ошибка создания группы " + err.message });
    }
};

const deleteHomework = async (req, res) => {
    try {
        const { id } = req.body
        const homework = await Homework.findByPk(id);
      if (homework) {
        const hw_id = homework.id
        const grades = await Grade.findAll({hw_id})
        grades.forEach(async (grade) =>
        {
          await grade.destroy()
        })
        await homework.destroy();
        res.status(200).json({ message: "Домашнее задание удалено" });
      } else {
        res.status(404).json({ error: "Домашнее задание не найдено" });
      }
    } catch (err) {
      res.status(500).json({ error: "Ошибка удаления домашнего задания " + err.message });
    }
}

const getHomeworksByGroupId = async (req, res) => {
    try {
      const { id } = req.body
      const group = await Group.findByPk(id);
      if (group) {
        const homeworks = await Homework.findAll({id})
        if (homeworks) {
          res.status(200).json(homeworks);
        } else {
          res.status(200).json([]);
        }
      } else {
        res.status(404).json({ error: "Группа не найдена" });
      }
    } catch (err) {
        res.status(500).json({ error: "Ошибка получения домашнего задания " + err.message });
    }
}

const getHomeworkById = async (req, res) => {
    try {
      const { id } = req.body
      const homework = await Homework.findByPk(id);
      if (homework) {
        res.status(200).json(homework);
      } else {
        res.status(404).json({ error: "Домашнее задание не найдено" });
      }
    } catch (err) {
        res.status(500).json({ error: "Ошибка получения домашнего задания " + err.message });
    }
}

const giveGradeToHomework = async (req, res) => {
    try {
      const { id } = req.body
      const homework = await Homework.findByPk(id);
      if (homework) {
        const token = req.headers["authorization"]
        const tokenValue = token.split(" ")[1];
        if (jwt.decode(tokenValue).id == homework.creator_id)
        {
          const { amount, user_id } = req.body
          if (amount <= 0 || amount > 12)
          {
            res.status(400).json({ error: "Неправильная оценка заданию" })
            return
          }

          const hw_id = homework.id
          const grade = await Grade.create({ hw_id, user_id, amount })
          res.status(201).json(grade);
        }
        else {
          res.status(400).json({ error: "Вы не можете дать оценку заданию" })
        }
      } else {
        res.status(404).json({ error: "Домашнее задание не найдено" });
      }
    } catch (err) {
        res.status(500).json({ error: "Ошибка выдачи оценки " + err.message });
    }
}

module.exports = {
    createHomework,
    deleteHomework,
    getHomeworksByGroupId,
    getHomeworkById,
    giveGradeToHomework
};