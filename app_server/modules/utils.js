const mongoose = require('mongoose');
const Types = mongoose.Schema.Types;

// Common attributes of every record in the database
const record = {
  createdAt: Types.Number,
  updatedAt: Types.Number,
  // id: { ref: "_id", },
};

const commonSchemaOptions = {
  timestamps: {
    currentTime: Date.now
  },
};

class Schema extends mongoose.Schema {
  constructor(types, options) {
    super({
      ...record,
      ...types
    }, {
      ...commonSchemaOptions,
      ...options,
    });
  }
};

const genEnum = (obj) =>
  Object.entries(obj).reduce((arr, [key, value]) => {
    arr.push(value);
    arr[key] = value;
    return arr;
  }, []);

module.exports = {
  record,
  commonSchemaOptions,
  Schema,
  genEnum,
};
