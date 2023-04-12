import messaging from "../../firebaseAdmin";
export default async function handler(req, res) {
  const registrationToken = JSON.parse(req.body);

  const message = {
    data: {
      score: '850',
      time: '2:45',
    },
    token: registrationToken,
  };

  try {
    // Send a message to the device corresponding to the provided registration token.
    const response = await messaging.send(message);
    // Response is a message ID string.
    console.log('Successfully sent message:', response);
    res.status(200).json({ success: true, message: 'Successfully sent message', messageId: response });
    
  } catch (error) {
    console.log('Error sending message:', error);
    res.status(500).json({ success: false, message: 'Error sending message', error: error.message });
  }
}
