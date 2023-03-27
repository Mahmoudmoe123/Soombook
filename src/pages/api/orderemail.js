import prisma from "../../lib/prisma";

export default async function handler(req, res) {
  const emailinfo = JSON.parse(req.body);
  console.log(emailinfo);

  const user = await prisma.user.findUnique({
    where: {
      id: emailinfo.userId,
    },
  });
  console.log("The users emails" + user.email);

  const sgMail = require("@sendgrid/mail");
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: user.email, // Change to your recipient
    from: "Wasilaybusiness@gmail.com", // Change to your verified sender
    subject: "Your order has been accepted",
    text: "Your order has been accepted by a traveler, please check your account for more details as we'll keep you updateed",
    html: `<p>${emailinfo.url}</p>`,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });

  res.status(200).json(msg);
}

// }
  