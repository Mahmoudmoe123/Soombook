import React from 'react';
import { getMessaging } from 'firebase/messaging';

const FCMButton = ({userToken}) => {
  const registrationToken = userToken;

  const sendNotification = () => {
    const message = {
      data: {
        score: '850',
        time: '2:45',
      },
      token: registrationToken,
    };

    getMessaging()
      .send(message)
      .then((response) => {
        console.log('Successfully sent message:', response);
      })
      .catch((error) => {
        console.log('Error sending message:', error);
      });
  };

  return (
    <button onClick={sendNotification}>
      Send Notification
    </button>
  );
};

export default FCMButton;
