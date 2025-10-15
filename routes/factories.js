// routes/factories.js
const express = require('express');
const router = express.Router();
const Factory = require('../models/factory');
const Subscription = require('../models/subscription');
const { Op } = require('sequelize');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 12, governorate, industryType, establishedYear, status, q } = req.query;
    const where = {};
    if (governorate) where.governorate = governorate;
    if (industryType) where.industryType = industryType;
    if (establishedYear) where.establishedYear = Number(establishedYear);
    if (status) where.status = status;
    if (q) where.name = { [Op.iLike]: `%${q}%` };

    const factories = await Factory.findAndCountAll({
      where,
      limit: Number(limit),
      offset: (Number(page) - 1) * Number(limit),
      order: [['createdAt', 'DESC']]
    });

    res.json({ total: factories.count, data: factories.rows });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// تفاصيل مصنع — محمي لأننا نتحقق من اشتراك المستخدم
router.get('/:id', auth(), async (req, res) => {
  try {
    const factory = await Factory.findByPk(req.params.id);
    if (!factory) return res.status(404).json({ msg: 'Not found' });

    // تحقق من الاشتراك لهذا المستخدم
    const sub = await Subscription.findOne({
      where: {
        userId: req.user.id,
        status: 'active',
        currentPeriodEnd: { [Op.gt]: new Date() }
      }
    });

    const safeFactory = factory.toJSON();
    if (!sub) {
      safeFactory.phone = safeFactory.phone ? safeFactory.phone.replace(/(\d{3})(\d{3})(\d+)/, '$1-xxx-$3') : null;
      safeFactory.location = null;
    }
    res.json(safeFactory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;