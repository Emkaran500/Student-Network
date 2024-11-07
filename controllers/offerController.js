const jwt = require("jsonwebtoken");

const Offer = require("../models/Offer");
const User = require("../models/User");

const createOffer = async (req, res) => {
    try {
      const { name, type, description, creator_id } = req.body;
      const status = 'open'
      const offer = await Offer.create({ name, type, description, creator_id, status });
      res.status(201).json(offer);
    } catch (err) {
      res.status(500).json({ error: "Ошибка создания вакансии " + err.message });
    }
};

const getAllOffers = async (req, res) => {
    try {
      const offers = await Offer.findAll();
      res.status(200).json(offers);
    } catch (err) {
      res.status(500).json({ error: "Ошибка получения вакансий " + err.message });
    }
};

const getOfferById = async (req, res) => {
    try {
      const { id } = req.body
      const offer = await Offer.findByPk(id);
      if (offer) {
        res.status(200).json(offer);
      } else {
        res.status(404).json({ error: "Вакансия не найдена" });
      }
    } catch (err) {
      res.status(500).json({ error: "Ошибка получения вакансии " + err.message });
    }
};

const updateOffer = async (req, res) => {
    try {
      const { id, name, description, status } = req.body;
      const offer = await Group.findByPk(id);
      if (offer) {
        offer.name = name || offer.name;
        offer.description = description || offer.description;
        offer.status = status || offer.status;
        await offer.save();
        res.status(200).json(group);
      } else {
        res.status(404).json({ error: "Вакансия не найдена" });
      }
    } catch (err) {
      res.status(500).json({ error: "Ошибка обновления вакансии " + err.message });
    }
};

const deleteOffer = async (req, res) => {
    try {
      const { id } = req.body
      const offer = await Offer.findByPk(id);
      if (offer) {
        await offer.destroy();
        res.status(200).json({ message: "Вакансия удалена" });
      } else {
        res.status(404).json({ error: "Вакансия не найдена" });
      }
    } catch (err) {
      res.status(500).json({ error: "Ошибка удаления вакансии " + err.message });
    }
};

const addUserToOffer = async (req, res) => {
    try {
      const { id, user_id } = req.body
      const offer = await Offer.findByPk(id);
      const user = await User.findByPk(id);
      if (offer && user && offer.status != 'occupied') {
        offer.user_id = user_id
        offer.status = 'occupied'
        await offer.save()
        res.status(200).json({ message: "Вакансия добавлена в профиль" });
      } else {
        res.status(404).json({ error: "Вакансия не найдена" });
      }
    } catch (err) {
      res.status(500).json({ error: "Ошибка добавления вакансии " + err.message });
    }
}

const changeStatusOfOffer = async (req, res) => {
    try {
      const { id } = req.body
      const offer = await Offer.findByPk(id);
      const token = req.headers["authorization"]
      const tokenValue = token.split(" ")[1];
      if (offer) {
        if (jwt.decode(tokenValue).id == offer.creator_id)
        {
            if (offer.status == 'occupied')
            {
              offer.status = 'open'
            }
            else
            {
              offer.status = 'occupied'
            }
            await offer.save()
            res.status(200).json({ message: "Статус вакансии изменён" });
        }
        else
        {
            res.status(400).json({ error: "Вам нельзя менять статус этой вакансии" })
        }
      } else {
        res.status(404).json({ error: "Вакансия не найдена" });
      }
    } catch (err) {
      res.status(500).json({ error: "Ошибка изменения статуса вакансии " + err.message });
    }
}

module.exports = {
    createOffer,
    getAllOffers,
    getOfferById,
    updateOffer,
    deleteOffer,
    addUserToOffer,
    changeStatusOfOffer
  };