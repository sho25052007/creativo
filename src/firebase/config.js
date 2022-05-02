import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import 'firebase/compat/auth'
import 'firebase/compat/storage'

const firebaseConfig = {
    apiKey: "AIzaSyDrVjkrkc0Z4LznNtNsnN8J4FhIW4bzSnY",
    authDomain: "creativo-ecae0.firebaseapp.com",
    projectId: "creativo-ecae0",
    storageBucket: "creativo-ecae0.appspot.com",
    messagingSenderId: "758088132709",
    appId: "1:758088132709:web:d27f844c0ed1d22787be8c"
  };

// init firebase
firebase.initializeApp(firebaseConfig)

// init firestore service
const projectFirestore = firebase.firestore()
const projectAuth = firebase.auth()
const projectStorage = firebase.storage()

// timestamp
const timestamp = firebase.firestore.FieldValue.serverTimestamp

export { projectFirestore, projectAuth, projectStorage, timestamp }