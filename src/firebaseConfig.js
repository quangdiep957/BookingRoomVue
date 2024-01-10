// firebase.js

import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyAlL9NgTsOCW3ZFzRBqufXu_0GuiVdgP-M',
  authDomain: 'bookingroom-7b732.firebaseapp.com',
  databaseURL: 'https://bookingroom-7b732-default-rtdb.firebaseio.com',
  projectId: 'bookingroom-7b732',
  storageBucket: 'bookingroom-7b732.appspot.com',
  messagingSenderId: '353974511157',
  appId: '1:353974511157:web:0b803386e2408e8c08b37c',
  measurementId: 'G-R165PEW8SQ',
}

const firebaseApp = initializeApp(firebaseConfig)
const storage = getStorage(firebaseApp)

export { storage }
