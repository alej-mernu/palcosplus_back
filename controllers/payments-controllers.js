require('dotenv').config();
const rentsControllers = require('./rents-controllers');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const ErrorCatcher = ({ decline_code, code }) => {
  switch (code) {
    case 'card_declined':
      switch (decline_code) {
        case 'insufficient_funds':
          return {
            id: 801,
            msg: 'Tarjeta Sin Fondos',
          };
        case 'lost_card':
          return {
            id: 802,
            msg: 'Tarjeta Reportada como Perdida',
          };
        case 'stolen_card':
          return {
            id: 803,
            msg: 'Tarjeta con Reporte de Robo',
          };
        default:
          return {
            id: 800,
            msg: 'Tarjeta Declinada',
          };
      }

    case 'expired_card':
      return {
        id: 804,
        msg: 'Tarjeta Expirada',
      };
    case 'incorrect_cvc':
      return {
        id: 805,
        msg: 'Codigo de Seguridad incorrecto',
      };
    case 'processing_error':
      return {
        id: 806,
        msg: 'Error al Procesar el pago',
      };
    default:
      return {
        id: 500,
        msg: 'error en la tarjeta',
      };
  }
};

const paymentMethod = async (number, exp_month, exp_year, cvc) => {
  const card = await stripe.paymentMethods.create({
    type: 'card',
    card: {
      number: number,
      exp_month: exp_month,
      exp_year: exp_year,
      cvc: cvc,
    },
  });

  return card.id;
};

const paymentCheckout = async (req, res) => {
  try {
    const {
      stadium_id,
      palco_id,
      event_id,
      number,
      exp_month,
      exp_year,
      cvc,
      amount,
      description,
    } = req.body;
    const isValid = await rentsControllers.validateRent(
      stadium_id,
      event_id,
      palco_id
    );
    if (isValid) {
      const card = await paymentMethod(number, exp_month, exp_year, cvc);

      const totalAmount = amount * 100;

      const payment = await stripe.paymentIntents.create({
        amount: totalAmount,
        currency: 'mxn',
        description: description,
        payment_method: card,
        confirm: true,
      });
      res.status(200).send(payment.id);
    } else {
      res.status(500).send();
    }
  } catch (error) {
    const e = ErrorCatcher(error.raw);
    console.log(error);
    e.id !== 500
      ? res.status(e.id).send(e.msg)
      : res.status(500).send(error.raw.message);
  }
};

exports.paymentCheckout = paymentCheckout;
