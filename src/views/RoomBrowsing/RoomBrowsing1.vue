<template>
  <div>
    <transition name="fade">
      <div class="message">{{ dataConvert }}</div>
    </transition>
  </div>
</template>

<script>
import { initializeApp } from 'firebase/app'
import { getDatabase, ref, get, child } from 'firebase/database'
const firebaseConfig = {
  apiKey: "AIzaSyAlL9NgTsOCW3ZFzRBqufXu_0GuiVdgP-M",
  authDomain: "bookingroom-7b732.firebaseapp.com",
  databaseURL: "https://bookingroom-7b732-default-rtdb.firebaseio.com",
  projectId: "bookingroom-7b732",
  storageBucket: "bookingroom-7b732.appspot.com",
  messagingSenderId: "353974511157",
  appId: "1:353974511157:web:0b803386e2408e8c08b37c",
  measurementId: "G-R165PEW8SQ"
};
const app = initializeApp(firebaseConfig)
const db = getDatabase(app)

export default {
  name: 'MyComponent',
  data() {
    return {
      title: 'My Component',
      dataConvert: [],
    }
  },
  components: {},
  async created() {
    const notificationsRef = ref(db, 'notifications')
    const childRef = child(
      notificationsRef,
      '00000000-0000-0000-0000-000000000000',
    )

    get(childRef).then((snapshot) => {
      if (snapshot.exists()) {
        var data = snapshot.val()
        for (const key in data) {
          const notification = data[key]
          this.dataConvert.push(notification)
        }
      } else {
        console.log('Không tìm thấy đối tượng con ')
      }
    })
  },
}
</script>
<style>
.message {
  background-color: #4caf50; /* màu xanh lá */
  color: white;
  padding: 16px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
