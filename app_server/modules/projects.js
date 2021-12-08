const mongoose = require('mongoose');
const Types = mongoose.Schema.Types;
const { Schema, genEnum } = require('./utils.js');

const dayHistoryReportSchema = new Schema({
  userId: {
    type: Types.ObjectId,
    required: true,
  },
  title: {
    type: Types.String,
    required: true,
  },
  content: {
    type: Types.String,
    required: true,
  },
});

const dayHistorySchema = new Schema({
  date: Types.Date,
  actualEffort: {
    type: Types.Number,
    required: true,
  },
  reports: [dayHistoryReportSchema],
});

const sprintRecordSchema = new Schema({
  sprintId: {
    type: Types.ObjectId,
    required: true,
  },
  daysHistory: [dayHistorySchema],
});

// some enum
const CARD_STATUS = genEnum({
  STOP: 'Stop',
  DOING: 'Doing',
  DONE: 'Done',
});

const BOARD_CATEGORY = genEnum({
  PRODUCT: 'Product',
  SPRINT: 'Sprint',
  ARCHIVE: 'Archive',
});

const cardSchema = new Schema({
  boardId: Types.ObjectId,
  belongCardId: Types.ObjectId,
  title: {
    type: Types.String,
    required: true,
  },
  subTitle: Types.String,
  content: Types.String,
  totalTime: Types.Number,
  currentDuration: Types.Number,
  status: {
    type: Types.String,
    enum: CARD_STATUS,
    "default": CARD_STATUS.STOP,
  },
  lastActivityAt: Types.Number,
});

const boardSchema = new Schema({
  name: {
    type: Types.String,
    required: true,
  },
  category: {
    type: Types.String,
    enum: BOARD_CATEGORY,
    required: true,
  },
  cycle: Types.Number,  // record sprint cycle length
  description: Types.String,
  projectId: Types.ObjectId,
  cards: [cardSchema],
  sprintRecord: [sprintRecordSchema],
});

const porjectSchema = new Schema({
  name: {
    type: Types.String,
    required: true,
  },
  firstSprintStartAt: {
    type: Types.Date,
    required: true,
  },
  cycle: {
    type: Types.Number,
    required: true,
  },
  description: Types.String,
  members: [Types.ObjectId],
  boards: [boardSchema],
});

mongoose.model('Projects', porjectSchema);
