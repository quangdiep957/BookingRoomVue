<template>
  <div class="container">
    <div class="video-container">
      <div class="label-face">NHẬN DIỆN ĐIỂM DANH KHUÔN MẶT</div>
      <div class="time-overlay">{{ currentDateTime }} | {{ vietnamDate }}</div>
      <video ref="videoRef" width="400" height="530" autoplay></video>
      <canvas v-show="isRef" ref="canvasRef" width="400" height="300"></canvas>
      <div class="message">
        <div class="image">
          <div class="circle-container">
            <!-- Thẻ hiển thị ảnh -->
            <img
              src="https://scontent.fhan2-3.fna.fbcdn.net/v/t39.30808-1/328757794_1112407446106690_19946984874272453_n.jpg?stp=cp6_dst-jpg_p320x320&_nc_cat=107&ccb=1-7&_nc_sid=5740b7&_nc_ohc=5HjhHbb8y9AAX9KvYsw&_nc_ht=scontent.fhan2-3.fna&oh=00_AfB0OHt0NMqHUwjNUywHicPFcluWaCmYBIiFrwcq08EX8A&oe=658405DB"
              alt="Mô tả ảnh"
            />
          </div>
        </div>

        <div class="time-overlay-susscess">
          {{ vietnamDate }} | {{ currentDateTime }}
          <div class="fullname-face fw300">Bùi Quang Điệp</div>
          <div class="info-face fw300">19810310355 - D14CNPM3</div>
        </div>
      </div>
    </div>

    <div class="controls">
      <!-- <input type="file" @change="handleImageUpload" accept="image/*" /> -->
      <input type="text" v-model="StudentCode" placeholder="Mã Sinh Viên" />

      <div class="button-group">
        <button @click="sendImgLogin">Điểm danh</button>
        <button @click="registerNewUserUpload">Đăng Ký khuôn mặt</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      videoRef: null,
      canvasRef: null,
      StudentCode: '',
      currentDateTime: '',
      vietnamDate: new Date(),
    }
  },
  created() {
    // Chuyển đổi sang múi giờ Việt Nam (UTC+7)
    const options = { timeZone: 'Asia/Ho_Chi_Minh' }
    this.vietnamDate = new Intl.DateTimeFormat('en-US', options).format(
      new Date(),
    )
  },
  mounted() {
    this.videoRef = this.$refs.videoRef
    this.canvasRef = this.$refs.canvasRef
    // this.captureInterval = setInterval(this.sendImgLogin, 1000) // Capture image every 5 seconds
    setInterval(this.updateCurrentDateTime, 1000)

    // Call setupWebcam when the component is mounted
    this.setupWebcam()
  },
  beforeUnmount() {
    clearInterval(this.captureInterval) // Clear the interval when the component is destroyed
  },
  props: {
    // Dữ liệu danh sách cần điểm danh
    dataStudent: {
      type: Array,
    },
  },
  methods: {
    updateCurrentDateTime() {
      const now = new Date()
      const options = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }
      this.currentDateTime = now.toLocaleString('vi-VN', options)
    },
    async setupWebcam() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        })

        // Set the videoRef's srcObject to the stream obtained
        this.videoRef.srcObject = stream
      } catch (error) {
        console.error('Error accessing camera:', error)
      }
    },
    async sendImgLogin() {
      if (this.videoRef && this.canvasRef) {
        const context = this.canvasRef.getContext('2d')
        context.drawImage(this.videoRef, 0, 0, 400, 300)

        this.canvasRef.toBlob(async (blob) => {
          // Đánh dấu hàm là async ở đây
          const apiUrl = 'http://127.0.0.1:8000/login'
          const file = new File([blob], 'webcam-frame.png', {
            type: 'image/png',
          })
          const formData = new FormData()
          formData.append('file', file)

          try {
            const response = await axios.post(apiUrl, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            })
            // Dừng gọi api
            clearInterval(this.captureInterval)
            if (response.data.match_status) {
              // alert('Welcome back ' + response.data.user + ' !')
              // lấy thông tin cập nhật vào db
              if (this.dataStudent) {
                // Lấy thông tin của sinh viên điểm danh thành công
                let student = this.dataStudent.filter(
                  (x) => x.StudentCode === response.data.user,
                )
                student[0].Status = true

                this.$emit('InsertFace', student)
              }
            } else {
              alert('Không tìm thấy khuôn mặt!')
            }
          } catch (error) {
            console.error('Có lỗi xảy ra:', error)
          }
        })
      }
    },
    loginUpload() {
      if (this.uploadedImage) {
        let apiUrl = 'http://127.0.0.1:8000/login'
        const file = this.dataURLtoFile(
          this.uploadedImage,
          'uploaded-image.png',
        )
        const formData = new FormData()
        formData.append('file', file)
        axios
          .post(apiUrl, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then((response) => {
            console.log(response.data)
            if (response.data.match_status) {
              // alert('Welcome back ' + response.data.user + ' !')
              // lấy thông tin cập nhật vào db
              if (this.dataStudent) {
                // Lấy thông tin của sinh viên điểm danh thành công
                let student = this.dataStudent.find(
                  (x) => x.StudentCode === response.data.user,
                )
                this.$emit('InsertFace', student)
              }
              // Nếu đăng nhập thành công gọi api lấy dữ liệu của sinh viên đó và cập nhật vào lớp học
            } else {
              alert('Unknown user! Please try again or register a new user!')
            }
          })
          .catch((error) => {
            console.error('Error sending image to API:', error)
          })
      }
    },
    registerNewUserUIpload() {
      if (this.uploadedImage) {
        let apiUrl = 'http://127.0.0.1:8000/register_new_user' // Replace with your actual API base URL
        const file = this.dataURLtoFile(
          this.uploadedImage,
          'uploaded-image.png',
        )
        const formData = new FormData()
        formData.append('file', file)

        const text = this.StudentCode // Lấy mã sinh viên khi đăng ký
        apiUrl += `?text=${text}`

        axios
          .post(apiUrl, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then((response) => {
            console.log(response.data)
            if (response.data.registration_status == 200) {
              alert('User was registered successfully!')
            }
          })
          .catch((error) => {
            console.error('Error sending image to API:', error)
          })
      }
    },
    dataURLtoFile(dataURL, fileName) {
      const arr = dataURL.split(',')
      const mime = arr[0].match(/:(.*?);/)[1]
      const bstr = atob(arr[1])
      let n = bstr.length
      const u8arr = new Uint8Array(n)

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }

      return new File([u8arr], fileName, { type: mime })
    },
    handleImageUpload(event) {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()

        reader.onload = (e) => {
          this.uploadedImage = e.target.result
        }

        reader.readAsDataURL(file)
      }
    },
    registerNewUser() {
      if (this.videoRef && this.canvasRef) {
        const context = this.canvasRef.getContext('2d')
        context.drawImage(this.videoRef, 0, 0, 400, 300)

        this.canvasRef.toBlob((blob) => {
          const apiUrl = 'http://127.0.0.1:8000/register_new_user' // Replace with your actual API base URL
          const file = new File([blob], 'webcam-frame.png', {
            type: 'image/png',
          })
          const formData = new FormData()
          formData.append('file', file)
          axios
            .post(apiUrl, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            })
            .then((response) => {
              console.log(response.data)
              if (response.data.registration_status == 200) {
                alert('User was registered successfully!')
              }
            })
            .catch((error) => {
              console.error('Error sending image to API:', error)
            })
        })
      }
    },
  },
}
</script>
<style>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  background-color: #110a0a;
  color: aliceblue;
  top: 50%;
  border-radius: 10px;
  box-shadow: 13px 13px 26px #dedede, -13px -13px 26px #ffffff;
  z-index: 9999;
  left: 50%;
  width: 535px;
  background-image: url(./noel2.png) !important; /* Đường dẫn đến hình ảnh */
  background-size: cover; /* Kích thước hình ảnh sẽ cover toàn bộ phần tử */
  background-position: center; /* Đặt hình ảnh vào giữa phần tử */
  background-repeat: no-repeat; /* Không lặp lại hình ảnh */
  transform: translate(-50%, -50%);
  /* padding-top: 50px; */
}

.video-container {
  position: relative;
  margin: 20px 0;
  align-items: center;
}

video,
canvas {
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 8px;
}

.time-overlay {
  text-align: center;
}
.time-overlay-susscess {
  text-align: center;
  color: #14dd14;
  margin-left: 20px;
  font-weight: 900;
  margin-top: 8px;
}

.controls {
  display: flex;
  flex-direction: column;
  align-items: center;
}

input,
button {
  margin-bottom: 8px;
}
.fw300 {
  font-weight: 300;
  color: aliceblue;
}
.button-group {
  display: flex;
  justify-content: space-between;
  width: 100%;
  color: white;
}
.label-face {
  text-align: center;
}
.message {
  width: 95%;
  position: absolute;
  bottom: 25px;
  height: 90px;
  margin-left: 15px;
  background-color: #f0f8ff3b;
  border-radius: 5px;
  display: flex;
  margin-left: 10px;
}
/* Kiểu dáng cho hình tròn */
.circle-container {
  width: 70px;
  height: 70px;
  border-radius: 50%; /* Đặt đường viền thành hình tròn */
  overflow: hidden; /* Ẩn nội dung vượt qua đường viền */
  border: 3px solid #25f125;
}
.image {
  margin-left: 15px;
  display: flex;
  align-items: center; /* Căn giữa dọc */
  justify-content: center; /* Căn giữa ngang */
}
/* Kiểu dáng cho ảnh bên trong hình tròn */
.circle-container img {
  width: 100%; /* Ảnh sẽ lấp đầy hình tròn */
  height: auto; /* Duy trì tỷ lệ khung hình */
  display: block; /* Loại bỏ dư thừa khoảng trắng dưới ảnh */
}
</style>
