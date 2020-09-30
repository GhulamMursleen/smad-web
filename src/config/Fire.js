import firebase from "firebase";
var firebaseConfig = {
    apiKey: "AIzaSyD_VRAZh_lWP3O6UXMRhpgwMlrhbt1SKQc",
    authDomain: "smad-urts.firebaseapp.com",
    databaseURL: "https://smad-urts.firebaseio.com",
    projectId: "smad-urts",
    storageBucket: "smad-urts.appspot.com",
    messagingSenderId: "403046184760",
    appId: "1:403046184760:web:a1f7c738404cb193c033cd",
    measurementId: "G-6MDWVGZ8XF"
  };
firebase.initializeApp(firebaseConfig)


export const myFirebase = firebase
export const myFirestore = firebase.firestore()
export const myStorage = firebase.storage()





  