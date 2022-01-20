require('dotenv').config();
const AWS = require('aws-sdk');
const hbs = require('nodemailer-express-handlebars');
const nodemailer = require('nodemailer');
const path = require('path');
const handlebars = require('handlebars');
const fs = require('fs');

const SESConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_SES_REGION,
};

const sendEmail = async (req, res, next) => {
  const params = {
    Source: 'PalcosPlus <contacto@palcosplus.com>',
    Destination: {
      ToAddresses: [req.body.destination],
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: "<p style='color: red'>Renta exitosa</p>",
        },
      },
    },
  };
  new AWS.SES(SESConfig)
    .sendEmail(params)
    .promise()
    .then((response) => {
      console.log(response);
      res.status(200).json({ message: 'Email sent.' });
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ message: 'Error' });
    });
};

const nodemailerEmail = async (req, res, next) => {
  AWS.config.update({
    accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY,
    region: process.env.AWS_SES_REGION,
  });

  let transporter = nodemailer.createTransport({
    SES: new AWS.SES({
      apiVersion: '2010-12-01',
    }),
  });

  transporter.sendMail(
    {
      from: '"PalcosPlus" <contacto@palcosplus.com>',
      to: 'alej.mernu@gmail.com',
      subject: 'Felicidades por tu renta!',
      text: 'I hope this message gets sent!',
    },
    (err, info) => {
      console.log(info.envelope);
      console.log(info.messageId);
      console.log(err);
      res.status(500).json({ message: 'Error.' });
    }
  );

  // ----------------

  //   let transporter = nodemailer.createTransport({
  //     host: "email-smtp.us-east-2.amazonaws.com",
  //     port: 587,
  //     secure: false, // true for 465, false for other ports
  //     auth: {
  //       user: "AKIA425AHBQL4TAJ7X34", // generated ethereal user
  //       pass: "BPUvTLMwqOzjSHrkFFpT0Tx6vFdNdiy41AJpsl10kBTl", // generated ethereal password
  //     },
  //   });

  // point to the template folder
  //   const handlebarOptions = {
  //     viewEngine: {
  //       partialsDir: path.resolve("./views/"),
  //       defaultLayout: false,
  //     },
  //     viewPath: path.resolve("./views/"),
  //   };

  //   // use a template file with nodemailer
  //   transporter.use("compile", hbs(handlebarOptions));

  //   var mailOptions = {
  //     from: '"PalcosPlus" <contacto@palcosplus.com>', // sender address
  //     to: "alej.mernu@gmail.com", // list of receivers
  //     subject: "Felicidades por tu renta!",
  //     template: "email", // the name of the template file i.e email.handlebars
  //     context: {
  //       name: "Alejandro Mercado", // replace {{name}} with Adebola
  //     },
  //   };

  //   transporter.sendMail(mailOptions, function (error, info) {
  //     if (error) {
  //       console.log(error);
  //       res.status(500).json({ message: "Error." });
  //     }
  //     console.log("Message sent: " + info.response);
  //   });

  //   res.status(200).json({ message: "Email sent." });
};

const sendConfirmation = async (req, res, next) => {
  const filePath = path.join(__dirname, '../mail/email.html');
  const source = fs.readFileSync(filePath, 'utf-8').toString();
  const template = handlebars.compile(source);

  const {
    name,
    email,
    order_id,
    event_name,
    event_tour_name,
    competition,
    prop_name,
    zone,
    access,
    num_cards,
    stadium_name,
    date,
    time,
    delivery_type,
    delivery_address,
    instructions,
    stadium_delivery_zone,
    price,
    subtotal,
    iva,
    shipping,
    total,
  } = req.body;

  var delivery_name;
  switch (delivery_type) {
    case 'office':
      delivery_name = 'Recoger en oficinas';
      break;
    case 'stadium':
      delivery_name = 'Recoger en el estadio';
      break;
    default:
      delivery_name = 'Entrega a domicilio';
  }

  const rent_id = order_id.substring(0, 5);

  const replacements = {
    name: name,
    order_id: rent_id,
    event_name: event_name,
    event_tour_name: event_tour_name,
    competition: competition,
    prop_name: prop_name,
    zone: zone,
    access: access,
    num_cards: num_cards,
    stadium_name: stadium_name,
    date: date,
    time: time,
    delivery_type: delivery_name,
    delivery_address: delivery_address,
    instructions: instructions,
    stadium_delivery_zone: stadium_delivery_zone,
    price: price,
    subtotal: subtotal,
    // iva: iva,
    shipping: shipping ? shipping : 0,
    coupon: 'ninguno',
    discount: 0,
    total: total,
  };
  const htmlToSend = template(replacements);

  AWS.config.update({
    accessKeyId: SESConfig.accessKeyId,
    secretAccessKey: SESConfig.secretAccessKey,
    region: SESConfig.region,
  });

  let transporter = nodemailer.createTransport({
    SES: new AWS.SES({
      apiVersion: '2010-12-01',
    }),
  });

  const mailOptions = {
    from: '"PalcosPlus" <contacto@palcosplus.com>',
    to: email,
    subject: 'Felicidades por tu renta!',
    text: '',
    html: htmlToSend,
  };

  const info = await transporter.sendMail(mailOptions).then(
    (response) => {
      console.log('Message sent to user ' + email + ': %s', response.messageId);
      res.status(200).json({ message: 'Email sent.' });
    },
    (err) => {
      console.log('error sending mail: ' + err);
      res.status(404).json({ message: 'Error' });
    }
  );
};

const sendQuestions = async (req, res, next) => {
  const { name, phone, email, message } = req.body;

  AWS.config.update({
    accessKeyId: SESConfig.accessKeyId,
    secretAccessKey: SESConfig.secretAccessKey,
    region: SESConfig.region,
  });

  let transporter = nodemailer.createTransport({
    SES: new AWS.SES({
      apiVersion: '2010-12-01',
    }),
  });

  const mailOptions = {
    from: '"Preguntas" <contacto@palcosplus.com>',
    to: 'contacto@palcosplus.com',
    subject: 'Pregunta Usuario',
    text: '',
    html: `<h2>Datos del usuario</h2>
          <p><span style="font-weight:bold">Nombre:</span> ${name}</p>
          <p><span style="font-weight:bold">Teléfono:</span> ${phone}</p>
          <p><span style="font-weight:bold">Correo electrónico:</span> ${email}</p>
          <p><span style="font-weight:bold">Mensaje:</span> ${message}</p>`,
  };

  const info = await transporter.sendMail(mailOptions).then(
    (response) => {
      console.log('Message sent: %s', response.messageId);
      res.status(200).json({ message: 'Email sent.' });
    },
    (err) => {
      console.log('error sending mail: ' + err);
      res.status(404).json({ message: 'Error' });
    }
  );
};

const sendApplication = async (req, res, next) => {
  const { application, name, phone, email, stadium, prop_type, num_cards } =
    req.body;

  AWS.config.update({
    accessKeyId: SESConfig.accessKeyId,
    secretAccessKey: SESConfig.secretAccessKey,
    region: SESConfig.region,
  });

  let transporter = nodemailer.createTransport({
    SES: new AWS.SES({
      apiVersion: '2010-12-01',
    }),
  });

  const mailOptions = {
    from: '"Solicitud" <contacto@palcosplus.com>',
    to: 'contacto@palcosplus.com',
    subject: 'Solicitud de Usuario',
    text: '',
    html: `<h2>Datos del usuario</h2>
          <p><span style="font-weight:bold">Tipo de solicitud:</span> ${application}</p>
          <p><span style="font-weight:bold">Nombre:</span> ${name}</p>
          <p><span style="font-weight:bold">Teléfono:</span> ${phone}</p>
          <p><span style="font-weight:bold">Correo electrónico:</span> ${email}</p>
          <p><span style="font-weight:bold">Estadio:</span> ${stadium}</p>
          <p><span style="font-weight:bold">Tipo de propiedad:</span> ${prop_type}</p>
          <p><span style="font-weight:bold">Número de tarjetas:</span> ${num_cards}</p>
          `,
  };

  const info = await transporter.sendMail(mailOptions).then(
    (response) => {
      console.log('Message sent: %s', response.messageId);
      res.status(200).json({ message: 'Email sent.' });
    },
    (err) => {
      console.log('error sending mail: ' + err);
      res.status(404).json({ message: 'Error' });
    }
  );
};

exports.sendEmail = sendEmail;
exports.nodemailerEmail = nodemailerEmail;
exports.sendConfirmation = sendConfirmation;
exports.sendQuestions = sendQuestions;
exports.sendApplication = sendApplication;
