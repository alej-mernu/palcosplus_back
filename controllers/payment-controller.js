const stripe = require('stripe');


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
        console.log(error);
        res.json({message: error.raw.message});
    }
}


exports.paymentCheckout = paymentCheckout;