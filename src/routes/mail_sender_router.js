const express = require("express");
const auth = require("../middleware/auth");

const sendgrid = require('@sendgrid/mail');

const mailRouter = express.Router();

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY
const fs = require("fs");

const service = require('../services/mail_sender_service');

mailRouter.post('/send-email', [auth], async function (req, res) {
    const { to, subject, text } = req.body

    const { path } = await service.getEmailTemplate()
    attachment = fs.readFileSync(path);
    const msg = {
        to: to,
        from: `NodeJs API <no-reply.nodeapi@mail.vjdev.xyz>`,
        subject: subject,
        text: text,
        html: `${attachment}`
    }
    sendgrid.setApiKey(SENDGRID_API_KEY)


    sendgrid
        .send(msg)
        .then((resp) => {
            console.log('Email sent\n', resp)
            res.status(202).send({ message: 'email sent successfully' })
        })
        .catch((error) => {
            res.send({ error })
            console.error(error)
        })

})

module.exports = mailRouter