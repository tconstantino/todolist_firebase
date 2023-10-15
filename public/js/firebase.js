import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-analytics.js";

var firebaseConfig = {
  apiKey: "AIzaSyCn0WSuGepb0urm8T77V4FXltYFQJADyV0",
  authDomain: "todolist-firebase-70978.firebaseapp.com",
  projectId: "todolist-firebase-70978",
  storageBucket: "todolist-firebase-70978.appspot.com",
  messagingSenderId: "225778522935",
  appId: "1:225778522935:web:3e4e449413a5a3318558b2",
  measurementId: "G-DC8J8YHFB8",
};

// Initialize Firebase
  const firebase = initializeApp(firebaseConfig);
  const analytics = getAnalytics(firebase);

  export { firebase, analytics };
