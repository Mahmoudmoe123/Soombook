// requestPermission.js
import { getToken } from "firebase/messaging";
import { messaging } from "./firebase";

export async function requestPermission() {
  console.log('Requesting permission...');
  const permission = await Notification.requestPermission();
  
  if (permission === 'granted') {
    console.log('Notification permission granted.');
    const currentToken = await  getToken(messaging, {
                vapidKey:
                  "BCRcwBElQOj5ptR6h61H55skh2THtKolRbWvv8Ede_AA5ojmS6bC4brGqBQFYMMIjP9-rMZRj82RsX9BY4wVLS4",
              })
    
    if (currentToken) {
      // Send the token to your server and update the UI if necessary
      console.log('Token:', currentToken);
    } else {
      // Show permission request UI
      console.log('No registration token available. Request permission to generate one.');
    }
  } else {
    console.log('Notification permission denied.');
  }
}

// Replace '<YOUR_PUBLIC_V_VAPID_KEY_HERE>' with the actual key
