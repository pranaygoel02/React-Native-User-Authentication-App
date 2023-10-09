import { initializeApp } from "firebase/app";
import { getAuth} from 'firebase/auth'
import { getFirestore } from 'firebase/firestore';
import {getStorage, ref, uploadBytes, } from 'firebase/storage'
// import {API_KEY,  AUTH_DOMAIN,  PROJECT_ID,  STORAGE_BUCKET,  MESSAGING_SENDER_ID,  APP_ID,  MEASUREMENT_ID} from '@env'

const firebaseConfig = {
    apiKey: 'AIzaSyCl42l9tWYCucLIWswdUzkmVFt4s647FEI',
    authDomain: 'forumapp-6e9e5.firebaseapp.com',
    projectId: 'forumapp-6e9e5',
    storageBucket: 'forumapp-6e9e5.appspot.com',
    messagingSenderId: '500258270493',
    appId: '1:500258270493:web:f8092322da42bb4c15c5f4',
    measurementId: 'G-6ZK1WCHQMX'
  };
  
  const app = initializeApp(firebaseConfig);
  const auth = getAuth()
  const db = getFirestore(app);
  const storage = getStorage(app, 'gs://forumapp-6e9e5.appspot.com')

  export { auth, db, storage, ref, uploadBytes }