const { Fragment } = require('../../model/fragment');
const { createErrorResponse } = require('../../response');
const logger = require('../../logger');

module.exports = async (req, res) => {
  const id = req.params.id.split('.')[0];
  const ext = req.params.id.split('.')[1];

  try {
    logger.debug(`Retrieving fragment with id: ${id}, extension: ${ext}`);

    const fragment = await Fragment.byId(req.user, id);

    if (!fragment) {
      logger.error(`Fragment with id ${id} not found`);
      return res.status(404).json(createErrorResponse(404, 'Fragment not found'));
    }

    const data = await fragment.getData();

    if (ext && ext === 'html' && fragment.mimeType === 'text/markdown') {
      const convertedData = fragment.convertTo('text/html', data);
      res.setHeader('Content-Type', 'text/html');
      return res.status(200).send(convertedData);
    }

    res.setHeader('Content-Type', fragment.type);
    return res.status(200).send(data);
  } catch (err) {
    logger.error(`Error in getById: ${err.message}`);
    if (err.message === 'Fragment not found') {
      return res.status(404).json(createErrorResponse(404, 'Fragment not found'));
    }
    res.status(500).json(createErrorResponse(500, 'Internal Server Error'));
  }
};
