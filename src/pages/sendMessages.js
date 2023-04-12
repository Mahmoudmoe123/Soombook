import React from "react";

// import FCMButton from '../components/sendFcmButton'

// import sendNotification from '../firebaseAdmin'

function sendMessages() {
  const handleSendMessageSubmit = async (event) => {
    event.preventDefault();

    // Update the user's phone number in the database
    
      const response = await fetch("/api/sendNotificationFcm", {
        method: "PUT",
        // headers: {
        //   "Content-Type": "application/json",
        // },
        body: JSON.stringify("fKE2uLvo5e2U2LvA2-TEG5:APA91bGLJaafyTGdjrx3rJZN4c_IEZU6fuJybwxXgJHsyw-_meguQ1GTOEPR5IlQGKfAmZROyatyNMaqweN65D_BAyOy9w5TBT3nfsKfFzj8h20OY2xikvXDp3Nhk8ZxCVc_wB6DRTr7"),
      });

      if (response.status === 200) {
        console.log("Message sent successfully" );
      } else {
        console.error("Something went wrong");
      }
    
  };

  return (
    <div>
      
      <button onClick={handleSendMessageSubmit}> sendMessages</button>
      {/* <FCMButton userToken="fKE2uLvo5e2U2LvA2-TEG5:APA91bGLJaafyTGdjrx3rJZN4c_IEZU6fuJybwxXgJHsyw-_meguQ1GTOEPR5IlQGKfAmZROyatyNMaqweN65D_BAyOy9w5TBT3nfsKfFzj8h20OY2xikvXDp3Nhk8ZxCVc_wB6DRTr7" /> */}
    </div>
  );
}

export default sendMessages;
