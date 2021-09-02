const stripe = require('stripe');


const ErrorCatcher = ({decline_code,code}) => {

    switch(code){
        case 'card_declined':
            switch(decline_code){
                case 'insufficient_funds':
                    return {
                        id: 801,
                        msg: 'Tarjeta Sin Fondos'
                    }
                case 'lost_card':
                    return {
                        id: 802,
                        msg: 'Tarjeta Reportada como Perdida',
                    }
                case 'stolen_card':
                    return {
                        id: 803,
                        msg: 'Tarjeta con Reporte de Robo',
                    }
                default:
                    return {
                        id: 800,
                        msg: 'Tarjeta Declinada'
                    }
            }
            
        case 'expired_card':
            return {
                id: 804,
                msg: 'Tarjeta Expirada',
            }
        case 'incorrect_cvc':
            return {
                id: 805,
                msg: 'Codigo de Seguridad incorrecto',
            }
        case 'processing_error':
            return {
                id: 806,
                msg: 'Error al Procesar el pago',
            }
    }
}

const paymentCheckout = async(req,res) => {
    try {

        const {id, amount, currency,description} = req.body
        
        const payment = await strp.paymentIntents.create({
            amount,
            currency,
            description,
            payment_method: id,
            confirm: true,
        })

        console.log(req.body)
        res.send(payment)
    } catch(error){
        const e = ErrorCatcher(error.raw)
        console.log(e.msg);
        res.json(e.msg);
    }
}


exports.paymentCheckout = paymentCheckout;