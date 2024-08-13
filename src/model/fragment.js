const { randomUUID } = require('crypto');
const contentType = require('content-type');
const markdownIt = require('markdown-it')();

// Functions for working with fragment metadata/data using our DB
const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data');

class Fragment {
  // Constructor to initialize a fragment object
  constructor({ id, ownerId, created, updated, type, size = 0 }) {
    this.id = id || randomUUID();
    this.ownerId = ownerId;
    this.created = created || new Date();
    this.updated = updated || new Date();
    this.type = type;
    this.size = size;

    // Validate required fields
    if (!ownerId) {
      throw new Error('No owner id provided');
    }
    if (!type) {
      throw new Error('No type provided');
    }
    if (typeof size !== 'number') {
      throw new Error('Size is not a number');
    }
    if (size < 0) {
      throw new Error('Size is less than 0');
    }
    if (!Fragment.isSupportedType(type)) {
      throw new Error('Type is not supported');
    }
  }

  // Static method to get all fragments for a user
  static async byUser(ownerId, expand = false) {
    if (expand) {
      const fragments = await listFragments(ownerId); // Get list of fragments
      return Promise.all(fragments.map((f) => Fragment.byId(ownerId, f))); // Return full fragment objects if expand is true
    }
    return listFragments(ownerId); // Return fragment IDs
  }

  // Static method to get a fragment by ID
  static async byId(ownerId, id) {
    try {
      const fragment = await readFragment(ownerId, id); // Read fragment metadata
      if (!fragment) {
        throw new Error('Fragment not found');
      }
      return fragment;
    } catch (err) {
      console.error(`Error in byId: ${err.message}`);
      throw new Error('Fragment not found');
    }
  }

  // Static method to delete a fragment
  static delete(ownerId, id) {
    return deleteFragment(ownerId, id); // Delete fragment from DB
  }

  // Method to save a fragment
  save() {
    this.updated = new Date().toISOString();
    return writeFragment(this);
  }

  // Method to get fragment data
  getData() {
    return readFragmentData(this.ownerId, this.id);
  }

  // Method to set fragment data
  async setData(data) {
    this.size = data.length; // Update size
    this.updated = new Date().toISOString(); // Update the last modified date
    await writeFragmentData(this.ownerId, this.id, data);
  }

  // Getter for MIME type without encoding
  get mimeType() {
    const { type } = contentType.parse(this.type); // Parse MIME type
    return type; // Return MIME type
  }

  // Check if the fragment is a text type
  get isText() {
    return this.mimeType.startsWith('text/'); // Return true if MIME type starts with 'text/'
  }

  // Supported formats for conversion
  get formats() {
    if (this.isText) {
      return ['text/plain', 'text/markdown', 'text/html', 'text/csv'];
    }
    if (this.mimeType === 'application/json') {
      return ['application/json', 'application/yaml', 'text/plain'];
    }
    return []; // No other formats supported
  }

  // Static method to check if a type is supported
  static isSupportedType(value) {
    const { type } = contentType.parse(value); // Parse MIME type
    const supportedTypes = [
      'text/plain',
      'text/markdown',
      'text/html',
      'text/csv',
      'application/json',
      'application/yaml',
    ]; // List of supported types
    return supportedTypes.includes(type); // Check if type is in the list
  }

  // Method to convert fragment data to another type
  convertTo(type, data) {
    if (type === 'text/html' && this.mimeType === 'text/markdown') {
      const convertedData = markdownIt.render(data.toString()); // Convert Markdown to HTML
      return Buffer.from(convertedData); // Return converted data as a buffer
    }
    throw new Error(`Conversion from ${this.mimeType} to ${type} is not supported`); // Error if conversion not supported
  }
}

module.exports.Fragment = Fragment;
