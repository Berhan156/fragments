// src/routes/api/get.js

const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

module.exports = async (req, res) => {
  try {
    const fragments = await Fragment.byUser(req.user);
    res.json(createSuccessResponse({ fragments }));
  } catch (err) {
    res.status(500).json(createErrorResponse(500, err.message));
  }
};
