import FormData from "form-data"; // form-data v4.0.1
import Mailgun from "mailgun.js"; // mailgun.js v11.1.0

async function sendSimpleMessage() {
    const mailgun = new Mailgun(FormData);
    const mg = mailgun.client({
        username: "api",
        key: process.env.API_KEY || "API_KEY",
        // When you have an EU-domain, you must specify the endpoint:
        // url: "https://api.eu.mailgun.net"
    });
    try {
        const sandboxDomain = 'sandboxe531a3032ebe4af598ec46970e8b63ce.mailgun.org';
        const data = await mg.messages.create(sandboxDomain, {
            from: "Mailgun Sandbox <postmaster@sandboxe531a3032ebe4af598ec46970e8b63ce.mailgun.org>",
            to: ["Daniel Perez <daniels.perezc@uqvirtual.edu.co>"],
            subject: "Hello Daniel Perez",
            text: "Congratulations Daniel Perez, you just sent an email with Mailgun! You are truly awesome!",
        });

        console.log(data); // logs response data
    } catch (error) {
        console.log(error); //logs any error
    }
}

export {sendSimpleMessage};