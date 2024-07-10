const { Fragment } = require('../../model/fragment');
const { createErrorResponse } = require('../../response');
const logger = require('../../logger');

module.exports = async (req, res) => {
  const id = req.params.id;

  try {
    logger.debug(`Retrieving fragment info with id: ${id}`);

    const fragment = await Fragment.byId(req.user, id);

    if (!fragment) {
      logger.error(`Fragment with id ${id} not found`);
      return res.status(404).json(createErrorResponse(404, 'Fragment not found'));
    }

    return res.status(200).json({
      status: 'ok',
      fragment: {
        id: fragment.id,
        ownerId: fragment.ownerId,
        created: fragment.created,
        updated: fragment.updated,
        type: fragment.type,
        size: fragment.size,
      },
    });
  } catch (err) {
    logger.error(`Error in getInfo: ${err.message}`);
    if (err.message === 'Fragment not found') {
      return res.status(404).json(createErrorResponse(404, 'Fragment not found'));
    }
    res.status(500).json(createErrorResponse(500, 'Internal Server Error'));
  }
};
