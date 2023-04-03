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
    html: `<div>
    <div style="text-align: center;">
      <h2>${emailinfo.title}</h2>
      <img src="${emailinfo.imageUrl}" alt="${emailinfo.title}" style="width: 100%; height: auto; max-width: 300px;"/>

    </div>
    <div>
      <p>Category: ${emailinfo.category}</p>
      <p>Origin: ${emailinfo.origin}</p>
      <p>Destination: ${emailinfo.destination}</p>
      <p>Estimated Arrival Date: ${emailinfo.arrivalDate}</p>
      <p><strong>Description:</strong> ${emailinfo.description}</p>
      <div>
        <div>Price: ${emailinfo.price} SDG</div>
      </div>
    </div>
  </div>`,
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
