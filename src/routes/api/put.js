const { createSuccessResponse, createErrorResponse } = require('../../response');
const Fragment = require('../../model/fragment');
const logger = require('../../logger');

module.exports = async (req, res) => {
  try {
    // Find the existing fragment by ID and instantiate it as a Fragment object
    const fragmentData = await Fragment.byId(req.user, req.params.id);
    const fragment = new Fragment(fragmentData);

    logger.debug({ fragment }, 'PUT /fragments/:id');
    logger.debug(
      { fragmentType: fragment.type, contentType: req.headers['content-type'] },
      'Fragment type and content type'
    );

    // Valid conversions mapping
    const validConversions = {
      'text/plain': ['text/plain'],
      'text/markdown': ['text/markdown', 'text/html', 'text/plain'],
      'text/html': ['text/html', 'text/plain'],
      'text/csv': ['text/csv', 'text/plain', 'application/json'],
      'application/json': ['application/json', 'application/yaml', 'text/plain'],
      'application/yaml': ['application/yaml', 'text/plain'],
      'image/png': ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif'],
      'image/jpeg': ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif'],
      'image/webp': ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif'],
      'image/avif': ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif'],
      'image/gif': ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif'],
    };

    const originalType = fragment.type;
    const newType = req.headers['content-type'];

    // Check if the content type in the request is different from the original type
    if (originalType !== newType) {
      // Validate if the conversion is allowed
      if (!validConversions[originalType] || !validConversions[originalType].includes(newType)) {
        return res
          .status(400)
          .json(
            createErrorResponse(400, "A fragment's type cannot be changed to the specified type.")
          );
      }

      // Proceed with conversion, changing the type
      fragment.type = newType;
    }

    // Recalculate the size of the new data
    const newData = req.body;
    const newSize = Buffer.byteLength(newData);

    // Update the fragment's size and save the new data
    fragment.size = newSize;
    await fragment.setData(newData); // Ensure this is called on an instance of Fragment
    await fragment.save();

    logger.debug({ fragment }, 'Updated fragment successfully');

    res.status(200).json(createSuccessResponse({ fragment }));
  } catch (error) {
    logger.error('Error updating fragment:', error);
    res.status(404).json(createErrorResponse(404, error.message));
  }
};
