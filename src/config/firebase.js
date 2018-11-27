import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyBkW4gaE9TFaqwk8k1L4Cbt_MT8H-5NKpo",
    authDomain: "hangman-28673.firebaseapp.com",
    databaseURL: "https://hangman-28673.firebaseio.com",
    projectId: "hangman-28673",
    storageBucket: "hangman-28673.appspot.com",
    messagingSenderId: "603428129995"
};
const fire = firebase.initializeApp(config);
export default fire;