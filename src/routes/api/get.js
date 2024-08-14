// src/routes/api/get.js

const { createSuccessResponse, createErrorResponse } = require('../../response');
const logger = require('../../logger');
const Fragment = require('../../model/fragment');

module.exports = async (req, res) => {
  try {
    const fragments = await Fragment.byUser(req.user, req.query.expand === '1');
    logger.debug({ fragments }, 'GET /fragments');
    res.setHeader('Location', `${process.env.API_URL}/v1/fragments/${fragments.id}`);
    res.status(200).json(createSuccessResponse({ fragments }));
  } catch (error) {
    res.status(404).json(createErrorResponse(404, error.message));
  }
};
