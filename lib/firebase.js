import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAmPaZ447AzJVRsmlccmn7YPQw8sFaKq4E",
  authDomain: "flwebdev.firebaseapp.com",
  projectId: "flwebdev",
  storageBucket: "flwebdev.firebasestorage.app",
  messagingSenderId: "558022535206",
  appId: "1:558022535206:web:efde9d16da421689d45ee7",
  measurementId: "G-K1WQX44TEG"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app); // Firestore 데이터베이스
// const auth = getAuth(app);    // 로그인·회원가입

export { db };
