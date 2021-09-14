const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const Tarifas = require('../models/tarifas');

const getAllTarifas = async (req, res, next) => {

    let tarifas;
    try {
        tarifas = await Tarifas.find();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find the tarifas.',
            500
        );
        return next(error);
    }

    if (!tarifas) {
        const error = new HttpError(
            'Does not exist the tarifas',
            404
        );
        return next(error);
    }


    tarifas.forEach((data, idx) => {
        tarifas[idx] = data.toObject({ getters: true })
    });

    res.json({ tarifas: tarifas });
};

const getTarifaByStadiumId = async (req, res, next) => {
    const stadiumId = req.params.pid;

    let tarifas;
    try {
        tarifas = await Tarifas.find({ stadium_id: stadiumId });
    } catch (err) {
        const error = new HttpError(
            'Fetching tarifas failed, please try again later',
            500
        );
        return next(error);
    }

    if (!tarifas || tarifas.length === 0) {
        return next(
            new HttpError('Could not find tarifas for the provided user id.', 404)
        );
    }

    res.json({ tarifas: tarifas.map(tarifa => tarifa.toObject({ getters: true })) });
};

const createTarifa = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }

    const { tarifas, stadium_id } = req.body;

    const createdTarifas = new Tarifas({
        tarifas, stadium_id
    });

    try {
        await createdTarifas.save(function (err, data) {
            if (err) {
                console.log(err);
            }
        });
    } catch (err) {
        const error = new HttpError(
            'Creating tarifa failed, please try again.',
            500
        );
        return next(error);
    }

    res.status(201).json({ tarifa: createdTarifas });
};

exports.getAllTarifas = getAllTarifas;
exports.getTarifaByStadiumId = getTarifaByStadiumId;
exports.createTarifa = createTarifa;
