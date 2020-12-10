const express = require('express');
const asyncMiddleware = require('../middleware/asyncMiddleware');
const UserModel = require('../models/userModel');

const router = express.Router();

router.post('/submit-time', async (req, res, next) => {
  try {
    const { email, time } = req.body;
    await UserModel.updateOne({ email }, { time });
    res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.log(error);
  }
});

router.get(
  '/times',
  asyncMiddleware(async (req, res, next) => {
    const users = await UserModel.find({}, 'name time -_id')
      .sort({ shortestTime: -1 })
      .limit(10);
    res.status(200).json(users);
  })
);

module.exports = router;
