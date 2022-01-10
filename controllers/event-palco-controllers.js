const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const EventPalco = require('../models/event-palco');

const getAllEventPalco = async (req, res, next) => {
  let relation;
  try {
    relation = await EventPalco.find();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find the relation event palco.',
      500
    );
    return next(error);
  }

  if (!relation) {
    const error = new HttpError('Does not exist the relation event palco', 404);
    return next(error);
  }

  relation.forEach((data, idx) => {
    relation[idx] = data.toObject({ getters: true });
  });

  res.json({ relation: relation });
};

const getEventPalcoByIds = async (req, res, next) => {
  const palcoId = req.params.pid;
  const eventId = req.params.eid;

  let relation;
  try {
    relation = await EventPalco.findOne({
      $and: [{ event_id: eventId }, { palco_id: palcoId }],
    });
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a relation event palco.',
      500
    );
    return next(error);
  }

  res.json({ relation: relation.toObject({ getters: true }) });
};

const createEventPalco = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { event_id, palco_id, tarifa, price, comision, owner_price, active } =
    req.body;

  const createdEventPalco = new EventPalco({
    event_id,
    palco_id,
    tarifa,
    price,
    comision,
    owner_price,
    active,
  });

  try {
    await createdEventPalco.save(function (err, data) {
      if (err) {
        console.log(err);
      }
    });
  } catch (err) {
    const error = new HttpError(
      'Creating relation event palco failed, please try again.',
      500
    );
    return next(error);
  }

  res.status(201).json({ relation: createdEventPalco });
};

const addEventPalco = async (req, res, next) => {
  let response = [];
  for (let i = 0; i < req.body.length; i++) {
    const { event_id, palco_id, tarifa, price, comision, owner_price, active } =
      req.body[i];

    let relation;
    try {
      relation = await EventPalco.findOne({
        $and: [{ event_id: event_id }, { palco_id: palco_id }],
      });
    } catch (err) {
      console.log(err);
      const error = new HttpError(
        'Something went wrong, could not get relation event palco.',
        500
      );
      return next(error);
    }

    if (relation) {
      relation.tarifa = tarifa;
      relation.price = price;
      relation.comision = comision;
      relation.owner_price = owner_price;
      relation.active = active;
      relation.modified_date = Date.now();
    } else {
      relation = new EventPalco({
        event_id,
        palco_id,
        tarifa,
        price,
        comision,
        owner_price,
        active,
      });
    }

    try {
      await relation.save();
    } catch (err) {
      console.log(err);
      const error = new HttpError(
        'Something went wrong, could not save relation event palco.',
        500
      );
      return next(error);
    }
    response.push(relation.toObject({ getters: true }));
  }
  res.status(200).json({ palco: response });
};

const getTable = async (req, res, next) => {
  let data;
  try {
    data = await Table.find();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a event.',
      500
    );
    return next(error);
  }

  if (!data) {
    const error = new HttpError('Does not exist data in table', 404);
    return next(error);
  }

  data.forEach((data, idx) => {
    data[idx] = data.toObject({ getters: true });
  });

  res.json({ data: data });
};

const addQr = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { event_id, palco_id } = req.body;
  let images = [];
  if (req.files) {
    req.files.map((file) => {
      images.push(file.path);
    });
  }

  const createdRelation = new Table({
    event_id,
    palco_id,
    images,
  });

  try {
    await createdRelation.save(function (err, data) {
      if (err) {
        console.log(err);
      }
    });
  } catch (err) {
    const error = new HttpError('Add Qr code failed, please try again.', 500);
    return next(error);
  }

  res.status(201).json({ relation: createdRelation });
};

const updateQr = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const relationId = req.params.id;

  let images = [];
  if (req.files) {
    let file = 0;
    for (let i = 0; i < imagesName.length; i++) {
      if (imagesName[i] === '') {
        images.push(req.files[file].path);
        file++;
      } else {
        images.push('public/images' + imagesName[i]);
      }
    }
  }

  let relation;
  try {
    relation = await Table.findById(relationId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update qa code.',
      500
    );
    return next(error);
  }

  if (relation) {
    relation.images = images;
    relation.modified_date = Date.now();
  }

  try {
    await relation.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update qa code.',
      500
    );
    return next(error);
  }

  res.status(200).json({ relation: relation.toObject({ getters: true }) });
};

exports.getAllEventPalco = getAllEventPalco;
exports.getEventPalcoByIds = getEventPalcoByIds;
exports.createEventPalco = createEventPalco;
exports.addEventPalco = addEventPalco;
exports.getTable = getTable;
exports.addQr = addQr;
exports.updateQr = updateQr;
