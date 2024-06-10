// src/routes/api/post.js

const contentType = require('content-type');
const { Fragment } = require('../../model/fragment.js');
const { createSuccessResponse, createErrorResponse } = require('../../response');
const logger = require('../../logger');

const API_URL = process.env.API_URL || 'http://localhost:8080';

module.exports = async (req, res) => {
  try {
    logger.debug('Headers:', req.headers);
    logger.debug('Body:', req.body.toString());

    if (!req.body || req.body.length === 0) {
      return res.status(400).json(createErrorResponse(400, 'No body provided'));
    }

    const { type } = contentType.parse(req);

    // Check for supported content types
    if (!Fragment.isSupportedType(type)) {
      return res.status(415).json(createErrorResponse(415, 'Improper Content-Type'));
    }

    const fragment = new Fragment({
      ownerId: req.user,
      type,
      size: req.body.length,
    });

    await fragment.save();
    await fragment.setData(req.body);

    logger.info({ fragment }, 'Fragment created');

    return res.status(201).json(
      createSuccessResponse({
        Location: `${API_URL}/v1/fragments/${fragment.id}`,
        id: fragment.id,
        'Content-Type': type,
        'Content-Length': req.body.length,
      })
    );
  } catch (err) {
    logger.error('Error in postFragment:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
};
