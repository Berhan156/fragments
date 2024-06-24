const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

module.exports = async (req, res) => {
  try {
    const expand = req.query.expand === '1';
    const fragments = await Fragment.byUser(req.user, expand);
    res.json(createSuccessResponse({ fragments }));
  } catch (err) {
    res.status(500).json(createErrorResponse(500, err.message));
  }
};
