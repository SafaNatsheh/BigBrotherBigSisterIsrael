
import firebase from 'firebase/app'
import "firebase/auth"
import "firebase/firestore"
import "firebase/database"
import "firebase/storage"
const firebaseConfig = {
    apiKey: "AIzaSyB3bat9yTcVRZtuAqPRZumjrjU0PDW38fI",
    authDomain: "bbbs-personal-area-6c2ed.firebaseapp.com",
    databaseURL: "https://bbbs-personal-area-6c2ed.firebaseio.com",
    projectId: "bbbs-personal-area-6c2ed",
    storageBucket: "bbbs-personal-area-6c2ed.appspot.com",
    messagingSenderId: "538406338245",
    appId: "1:538406338245:web:1399cb0838b0ed0861faac",
    measurementId: "G-2TF06PX0S2"
};

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const db = firebase.firestore();
export default firebase;

export async function CreateNewUser(email,phone) {

    var res = auth.createUserWithEmailAndPassword(email,phone)
    return res;
}