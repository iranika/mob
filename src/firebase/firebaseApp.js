import firebaseConfig from "./firebaseConfig"
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";


if (!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
}

export default firebase;