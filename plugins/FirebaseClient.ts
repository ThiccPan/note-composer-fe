// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

export default defineNuxtPlugin(nuxtApp => {
  const config = useRuntimeConfig()
  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: String(config.public.firebaseApiKey),
    authDomain: String(config.public.firebaseAuthDomain),
    projectId: String(config.public.firebaseProjectId),
    storageBucket: String(config.public.firebaseStorageBucket),
    messagingSenderId: String(config.public.firebaseMessagingSenderId),
    appId: String(config.firebaseAppId),
    measurementId: String(config.firebaseMeasurementId),
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  // Initialize Firebase Authentication and get a reference to the service
  const auth = getAuth(app);

  nuxtApp.vueApp.provide('auth', auth)
  nuxtApp.provide('auth', auth)
})
