const mongoose = require('mongoose');
const Prj = mongoose.model('Projects');
const Usr = mongoose.model('Users');

const getPrjsByUsr = async (req, res) => {
  if (!req.query.usrID)
    return res.status(400).json({ "massage": "All fields required", });
  try {
    let prjs = await Prj.find({members: req.query.usrID}).exec();
    return res.status(200).json(prjs);
  } catch (err) {
    return res.status(400).json({"message": "The parameter format is incorrect."});
  }
};

const addPrj = async (req, res) => {
  const prjInfo = req.body;
  if (!prjInfo.name || !prjInfo.cycle || !prjInfo.firstSprintStartAt || !prjInfo.members || !prjInfo.members.length)
    return res.status(400).json({"message": "field to build project is missing"});
  const boards = prjInfo.boards || [];
  for (const board of boards) {
    if (!board.name || !board.category)
      return res.status(400).json({"message": "field to build board is missing"});
    const cards = board.cards;
    if (cards) for (const card of cards) {
      if (!card.title)
      return res.status(400).json({"message": "field to build card is missing"});
    }
  }
  const members = prjInfo.members;
  const users = await Usr.find({_id: {$in: members}}).exec();
  if (users.length != members.length)
    return res.status(400).json({"massage": "unable to match all members"});
  let success = true;
  const prj = new Prj(prjInfo);
  for (const board of prj.boards) {
    board.projectId = prj._id;
    for (const card of board.cards) {
      card.boardId = board._id;
    }
  }
  await prj.save((err) => {
    if (!err) return;
    success = false;
    return res.status(400).json(err);
  });
  if (!success) return;
  await Usr.updateMany({ _id: { $in: members } }, { $addToSet: { projectId: prj._id }}).exec();
  return res.status(200).json(prj);
};

const delPrj = async (req, res) => {
  let prjID = req.params.prjID;
  if (!prjID)
    return res.status(400).json({"massage": "All fields required",});
  try {
    const { deletedCount } = await Prj.deleteOne({_id: prjID}).exec();
    if (deletedCount == 0)
      return res.status(400).json({"massage": "cannot find project",});
    prjID = new mongoose.Types.ObjectId(prjID);
    await Usr.updateMany({projectId: prjID}, {$pull: {projectId: prjID}}).exec();
    return res.status(200).json({"success": true});
  } catch (err) {
    return res.status(400).json({"message": "The parameter format is incorrect."});
  }
};

const updatePrj = async (req, res) => {
  const { prjID } = req.params;
  if (!prjID) return res.status(400).json({ "massage": "All fields required", });
  const prjInfo = req.body;
  delete prjInfo._id;
  delete prjInfo.boards;
  if (!prjInfo.name || !prjInfo.cycle || !prjInfo.firstSprintStartAt || !prjInfo.members || !prjInfo.members.length)
    return res.status(400).json({"message": "field to build project is missing"});
  const oldPrj = await Prj.findById(prjID).exec();
  if (!oldPrj) return res.status(400).json({"massage": "project not found"});

  const members = prjInfo.members;
  const users = await Usr.find({_id: {$in: members}}).exec();
  if (users.length != members.length)
    return res.status(400).json({"massage": "unable to match all members"});
  
  const newMembersId = members;
  const oldMembersId = oldPrj.members.map(u => "" + u._id);
  if ((new Set([...newMembersId, ...oldMembersId])).size == oldMembersId.length)
    delete prjInfo.members;
  else {
    await Usr.updateMany({ _id: { $nin: newMembersId } }, { $pull: { projectId: oldPrj._id } }).exec();
    await Usr.updateMany({ _id: { $in: newMembersId } }, { $addToSet: { projectId: oldPrj._id } }).exec();
    oldPrj.members = prjInfo.members;
  }

  "name,cycle,firstSprintStartAt".split(",")
  .forEach(prop => {
    oldPrj[prop] = prjInfo[prop];
  });
  await oldPrj.save((err, prj) => {
    if (err) return res.status(400).json(err);
    res.status(200).json(prj);
  });
};

const getPrj = async (req, res) => {
  const { prjID } = req.params;
  if (!prjID) return res.status(400).json({ "massage": "All fields required", });
  const prj = await Prj.findById(prjID).exec();
  if (!prj) return res.status(400).json({"massage": "project not found"});
  return res.status(200).json(prj);
};


const addBoard = async (req, res) => {
  const { prjID } = req.params;
  if (!prjID) return res.status(400).json({ "massage": "All fields required", });
  const board = req.body;
  if (!board.name || !board.category)
    return res.status(400).json({"message": "field to build board is missing"});
  const cards = board.cards;
  if (cards) for (const card of cards) {
    if (!card.title)
      return res.status(400).json({"message": "field to build card is missing"});
  }
  const prj = await Prj.findById(prjID).exec();
  if (!prj) return res.status(400).json({"massage": "project not found"});
  prj.boards.push(board);
  prj.save((err, prj) => {
    if (err) return res.status(400).json(err);
    const board = prj.boards[prj.boards.length - 1];
    board.projectId = prj._id;
    for (const card of board.cards) card.boardId = board._id;
    prj.save((err, prj) => {
      if (err) return res.status(400).json(err);
      const board = prj.boards[prj.boards.length - 1];
      return res.status(200).json(board);
    });
  });
};

const delBoard = async (req, res) => {
  const { prjID, boardID } = req.params;
  if (!prjID || !boardID) return res.status(400).json({ "massage": "All fields required", });
  try {
    const { deletedCount } = await Prj.updateMany({ _id: prjID }, {
      $pull: { boards: { _id: boardID } }
    }).exec();
    if (deletedCount == 0)
      return res.status(400).json({"massage": "cannot find project or board",});
    return res.status(200).json({"success": true});
  } catch (err) {
    console.warn(err);
    return res.status(400).json({"message": "The parameter format is incorrect."});
  }
};

const updateBoard = async (req, res) => {
  const { prjID, boardID } = req.params;
  if (!prjID || !boardID) return res.status(400).json({ "massage": "All fields required", });

  const boardInfo = req.body;
  delete boardInfo._id;
  delete boardInfo.cards;
  if (!boardInfo.name || !boardInfo.category)
    return res.status(400).json({"message": "field to build board is missing"});
  const prj = await Prj.findOne({_id: prjID, "boards._id": boardID}).exec();
  if (!prj) return res.status(400).json({"massage": "project not found"});

  const board = prj.boards.find(b => boardID == "" + b._id);
  "name,category,cycle,description".split(",").filter(s => s in boardInfo)
  .forEach(prop => board[prop] = boardInfo[prop]);

  await prj.save((err, prj) => {
    if (err) return res.status(400).json(err);
    res.status(200).json(prj.boards.find(b => boardID == "" + b._id));
  });
};

const getBoard = async (req, res) => {
  const { prjID, boardID } = req.params;
  if (!prjID || !boardID) return res.status(400).json({ "massage": "All fields required", });
  try {
    let prj = await Prj.findById(prjID).exec();
    if (!prj) return res.status(404).json({"massage": "board not found"});
    let board = prj.boards.find(b => "" + b._id == boardID);
    if (!board) return res.status(404).json({"massage": "board not found"});
    return res.status(200).json(board);
  } catch (err) {
    console.warn(err);
    return res.status(400).json({"message": "The parameter format is incorrect."});
  }
};


const addCard = async (req, res) => {
  const { prjID, boardID } = req.params;
  const card = req.body;
  if (!prjID || !boardID || !card) return res.status(400).json({ "massage": "All fields required", });
  if (!card.title) return res.status(400).json({"message": "field to build card is missing"});
  if (card.boardId != boardID) return res.status(400).json({"massage": "board id not match"});
  card.boardId = boardID;
  const prj = await Prj.findById(prjID).exec();
  if (!prj) return res.status(400).json({"massage": "project not found"});
  const board = prj.boards.find(b => boardID == "" + b._id);
  if (!board) return res.status(400).json({"massage": "board not found"});
  if (card.belongCardId && !prj.boards.some(b => b.cards.some(c => cardInfo.belongCardId == "" + c._id)))
    return res.status(400).json({"massage": "belong card not found"});

  board.cards.push(card);
  prj.save((err, prj) => {
    if (err) return res.status(400).json(err);
    const cards = prj.boards.find(b => boardID == "" + b._id).cards;
    const card = cards[cards.length - 1];
    return res.status(200).json(card);
  });
};

const delCard = async (req, res) => {
  const { prjID, boardID, cardID } = req.params;
  if (!prjID || !boardID || !cardID) return res.status(400).json({ "massage": "All fields required", });
  try {
    const { deletedCount } = await Prj.updateMany({ _id: prjID, "boards._id": boardID }, {
      $pull: { "boards.$.cards": { _id: cardID } }
    }).exec();
    if (deletedCount == 0)
      return res.status(400).json({"massage": "cannot find project or board",});
    return res.status(200).json({"success": true});
  } catch (err) {
    console.warn(err);
    return res.status(400).json({"message": "The parameter format is incorrect."});
  }
};

const updateCard = async (req, res) => {
  const { prjID, boardID: oldBoardID, cardID } = req.params;
  if (!prjID || !oldBoardID || !cardID) return res.status(400).json({ "massage": "All fields required", });
  const cardInfo = req.body;
  if ("title" in cardInfo && !cardInfo.title)
    return res.status(400).json({"message": "title field to card is missing"});

  // console.log(prjID, oldBoardID, cardID);
  const prj = await Prj.findOne({_id: prjID, "boards._id": oldBoardID, "boards.cards._id": cardID}).exec();
  const oldBoard = prj?.boards.find(b => oldBoardID == "" + b._id);
  const nowBoard = cardInfo.boardId? prj?.boards.find(b => cardInfo.boardId == "" + b._id): oldBoard;
  if (!prj || !nowBoard) return res.status(400).json({"massage": "project/board/card not found"});
  if (cardInfo.belongCardId && !nowBoard.cards.some(c => cardInfo.belongCardId == "" + c._id))
    return res.status(400).json({"massage": "belong card not found"});

  const card = oldBoard.cards.find(c => cardID == "" + c._id);
  if (oldBoard != nowBoard) {
    let newCard = {};
    "_id,createdAt,updatedAt,boardId,belongCardId,title,subTitle,content,totalTime,currentDuration,status,lastActivityAt"
    .split(",").forEach(prop => {
      // console.log(prop, card[prop], cardInfo[prop]);
      if (!cardInfo[prop] && !card[prop]) return;
      newCard[prop] = cardInfo[prop] || card[prop];
    });
    oldBoard.cards.splice(oldBoard.cards.indexOf(card), 1);
    nowBoard.cards.push(newCard);
  }
  else {
    "boardId,belongCardId,title,subTitle,content,totalTime,currentDuration,status,lastActivityAt"
    .split(",").filter(s => s in cardInfo)
    .forEach(prop => {
      // console.log(prop, card[prop], cardInfo[prop]);
      card[prop] = cardInfo[prop];
    });
  }

  await prj.save((err, prj) => {
    if (err) return res.status(400).json(err);
    res.status(200).json(prj.boards.find(b => nowBoard._id == "" + b._id).cards.find(c => cardID == "" + c._id));
  });
};

const getCard = async (req, res) => {
  const { prjID, boardID, cardID } = req.params;
  if (!prjID || !boardID || !cardID) return res.status(400).json({ "massage": "All fields required", });
  try {
    let prj = await Prj.findById(prjID).exec();
    if (!prj) return res.status(404).json({"massage": "card not found"});
    let board = prj.boards.find(b => "" + b._id == boardID);
    if (!board) return res.status(404).json({"massage": "card not found"});
    let card = board.cards.find(c => "" + c._id == cardID);
    if (!card) return res.status(404).json({"massage": "card not found"});
    return res.status(200).json(card);
  } catch (err) {
    return res.status(400).json({"message": "The parameter format is incorrect."});
  }
};


module.exports = {
  getPrjsByUsr,
  addPrj,
  delPrj,
  updatePrj,
  getPrj,

  getBoard,
  updateBoard,
  delBoard,
  addBoard,

  getCard,
  updateCard,
  delCard,
  addCard,
};
