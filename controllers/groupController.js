const Group = require("../models/Group");

const createGroup = async (req, res) => {
    try {
      const { name } = req.body;
      const group = await Group.create({ name });
      res.status(201).json(group);
    } catch (err) {
      res.status(500).json({ error: "Ошибка создания группы " + err.message });
    }
};

const getAllGroups = async (req, res) => {
    try {
      const groups = await Group.findAll();
      res.status(200).json(groups);
    } catch (err) {
      res.status(500).json({ error: "Ошибка получения групп " + err.message });
    }
};

const getGroupById = async (req, res) => {
    try {
      const { id } = req.body
      const group = await Group.findByPk(id);
      if (group) {
        res.status(200).json(group);
      } else {
        res.status(404).json({ error: "Группа не найдена" });
      }
    } catch (err) {
      res.status(500).json({ error: "Ошибка получения группы " + err.message });
    }
};

const updateGroup = async (req, res) => {
    try {
      const { id, name } = req.body;
      const group = await Group.findByPk(id);
      if (group) {
        group.name = name || user.name;
        await group.save();
        res.status(200).json(group);
      } else {
        res.status(404).json({ error: "Группа не найдена" });
      }
    } catch (err) {
      res.status(500).json({ error: "Ошибка обновления группы " + err.message });
    }
};

const deleteGroup = async (req, res) => {
    try {
      const { id } = req.body
      const group = await Group.findByPk(id);
      if (group) {
        await group.destroy();
        res.status(200).json({ message: "Группа удалена" });
      } else {
        res.status(404).json({ error: "Группа не найдена" });
      }
    } catch (err) {
      res.status(500).json({ error: "Ошибка удаления группы " + err.message });
    }
};

module.exports = {
    createGroup,
    getAllGroups,
    getGroupById,
    updateGroup,
    deleteGroup
  };