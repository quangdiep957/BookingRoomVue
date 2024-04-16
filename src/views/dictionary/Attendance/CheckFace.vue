<template>
  <div class="container">
    <div class="video-container">
      <el-tooltip content="Đóng" placement="bottom">
        <div
          class="misa-icon misa-icon-close misa-icon-24 mgl-8p icon-face"
          @click="onCloseForm"
        ></div>
      </el-tooltip>
      <div class="label-face">NHẬN DIỆN ĐIỂM DANH KHUÔN MẶT</div>
      <div class="time-overlay">{{ currentDateTime }} | {{ vietnamDate }}</div>
      <video ref="videoRef" width="400" height="530" autoplay></video>
      <canvas v-show="isRef" ref="canvasRef" width="400" height="300"></canvas>
      <div class="message_a" v-if="showMessage">
        <div class="image">
          <div class="circle-container">
            <!-- Thẻ hiển thị ảnh -->
            <img :src="imageUrl" alt="Mô tả ảnh" />
          </div>
        </div>

        <div class="time-overlay-susscess">
          {{ vietnamDate }} | {{ currentDateTime }}
          <div class="fullname-face fw300">{{ mesageSusscess.FullName }}</div>
          <div class="info-face fw300">
            {{ mesageSusscess.StudentCode }} - {{ mesageSusscess.ClassCode }}
          </div>
        </div>
      </div>
      <div class="message" v-if="showMessageError && mesageSusscess.Error">
        <div class="time-overlay-susscess">
          <div class="fullname-face fw300">{{ mesageSusscess.Error }}</div>
        </div>
      </div>
    </div>

    <div class="controls">
      <!-- <input type="file" @change="handleImageUpload" accept="image/*" /> -->
      <input
        type="text"
        v-model="StudentCode"
        placeholder="Mã Sinh Viên"
        v-if="modeCheck == 'Register'"
      />

      <div class="button-group">
        <DxButton
          v-if="modeCheck == 'Register'"
          class="mgr-15"
          :width="130"
          text="Đăng Ký"
          type="default"
          @click="registerNewUser"
        />
      </div>
    </div>
  </div>
  <BaseLoading :isShowLoading="isShowLoading"></BaseLoading>
</template>
<script>
import axios from 'axios'
import { getDownloadURL, ref as storageRef } from 'firebase/storage'
import { DxButton } from 'devextreme-vue/button'
import { storage } from '@/firebaseConfig' // Thay đổi đường dẫn tới firebase.js
import BaseLoading from '@/components/base/BaseLoading.vue'
export default {
  data() {
    return {
      videoRef: null,
      canvasRef: null,
      StudentCode: '',
      currentDateTime: new Date(),
      vietnamDate: new Date(),
      dataCache: [],
      mesageSusscess: {},
      showMessageError: false,
      imageUrl: '',
      showMessage: false,
      callLogin: true,
      isShowLoading: false,
    }
  },
  components: {
    DxButton,
    BaseLoading,
  },
  created() {
    this.updateCurrentDateTime()
    // Chuyển đổi sang múi giờ Việt Nam (UTC+7)
    const options = { timeZone: 'Asia/Ho_Chi_Minh' }
    this.vietnamDate = new Intl.DateTimeFormat('en-US', options).format(
      new Date(),
    )
  },
  watch: {
    dataCheckSuccess(newVal) {
      // Đường dẫn trên Firebase Storage đến ảnh bạn muốn tải
      const storagePath = `face/person/${newVal[0].StudentCode}`
      const imageRef = storageRef(storage, storagePath)

      // Lấy URL tải về ảnh khi component được mounted
      getDownloadURL(imageRef)
        .then((url) => {
          this.imageUrl = url
        })
        .catch((error) => {
          console.error('Error getting download URL:', error)
        })
      // Xử lý khi prop dataCheckSuccess thay đổi
      this.mesageSusscess.FullName = newVal[0].FullName
      this.mesageSusscess.ClassCode = newVal[0].ClassCode
      this.mesageSusscess.StudentCode = newVal[0].StudentCode

      // Thiết lập showMessage thành true sau 3 giây
      setTimeout(() => {
        this.showMessage = true

        // Đặt lại showMessage thành false sau thêm 3 giây
        setTimeout(() => {
          this.showMessage = false
        }, 5000)
      }, 5000)
    },
  },
  mounted() {
    // Nếu có thay đổi thì show thông tin lên
    this.videoRef = this.$refs.videoRef
    this.canvasRef = this.$refs.canvasRef
    // tự động lấy ảnh theo mode điểm danh hoặc đăng ký khuôn mặt
    if (this.modeCheck == 'Login') {
      this.captureInterval = setInterval(this.sendImgLogin, 5000)
    }
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
    dataCheckSuccess: {
      type: Array,
    },
    modeCheck: {
      type: String,
    },
  },
  methods: {
    /** Mô tả: Gửi sự kiện đóng form
     * CreatedBy: bqdiep
     */
    onCloseForm() {
      this.$emit('onCloseForm')
    },
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
      this.showLoading(true)
      this.mesageSusscess.Error = ''
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
            if (response.data.match_status) {
              // alert('Welcome back ' + response.data.user + ' !')
              // lấy thông tin cập nhật vào db
              if (this.dataStudent) {
                // Lấy thông tin của sinh viên điểm danh thành công
                let student = this.dataStudent.filter(
                  (x) => x.StudentCode === response.data.user,
                )
                if (student[0]) {
                  // lưu vào danh sách nếu nó điểm danh rồi thì thôi
                  student[0].Status = true
                  // Gửi thông tin cập nhật điểm danh
                  this.$emit('InsertFace', student.slice(0, 1))
                  this.showLoading(false)
                } else {
                  // Thiết lập showMessage thành true sau 3 giây
                  setTimeout(() => {
                    this.showMessageError = true

                    // Đặt lại showMessage thành false sau thêm 3 giây
                    setTimeout(() => {
                      this.showMessageError = false
                    }, 5000)
                  }, 5000)
                  this.mesageSusscess.Error = 'Sinh viên không thuộc lớp này!'
                  this.showLoading(false)
                }
              }
            } else {
              this.showLoading(false)
              // Thiết lập showMessage thành true sau 3 giây
              setTimeout(() => {
                this.showMessageError = true

                // Đặt lại showMessage thành false sau thêm 3 giây
                setTimeout(() => {
                  this.showMessageError = false
                }, 5000)
              }, 5000)
              this.mesageSusscess.Error = 'Không tìm thấy khuôn mặt!'
            }
          } catch (error) {
            this.showLoading(false)
            console.error('Có lỗi xảy ra:', error)
          }
        })
      }
    },
    /**
     * Mô tả : Hàm show/hide loading
     * @param {Boolean} isShow true: hiển thị loading, false: ẩn loading
     * @Createdby: bqdiep
     */
    showLoading(isShow) {
      this.isShowLoading = isShow
    },
    async loginUpload() {
      if (this.uploadedImage) {
        let apiUrl = 'http://127.0.0.1:8000/login'
        const file = this.dataURLtoFile(
          this.uploadedImage,
          'uploaded-image.png',
        )
        const formData = new FormData()
        formData.append('file', file)
        try {
          const response = await axios.post(apiUrl, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          if (response.data.match_status) {
            // alert('Welcome back ' + response.data.user + ' !')
            // lấy thông tin cập nhật vào db
            if (this.dataStudent) {
              // Lấy thông tin của sinh viên điểm danh thành công
              let student = this.dataStudent.filter(
                (x) => x.StudentCode === response.data.user,
              )
              if (student[0]) {
                // lưu vào danh sách nếu nó điểm danh rồi thì thôi
                student[0].Status = true
                // Gửi thông tin cập nhật điểm danh
                this.$emit('InsertFace', student.slice(0, 1))
              } else {
                // Thiết lập showMessage thành true sau 3 giây
                setTimeout(() => {
                  this.mesageSusscess.Error = 'Sinh viên không thuộc lớp này!'
                  this.showMessageError = true

                  // Đặt lại showMessage thành false sau thêm 3 giây
                  setTimeout(() => {
                    this.showMessageError = false
                  }, 5000)
                }, 5000)
              }
            }
          } else {
            // Thiết lập showMessage thành true sau 3 giây
            setTimeout(() => {
              this.showMessageError = true

              // Đặt lại showMessage thành false sau thêm 3 giây
              setTimeout(() => {
                this.showMessageError = false
              }, 5000)
            }, 5000)
            this.mesageSusscess.Error = 'Không tìm thấy khuôn mặt!'
          }
        } catch (error) {
          console.error('Có lỗi xảy ra:', error)
        }
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
          let apiUrl = 'http://127.0.0.1:8000/register_new_user' // Replace with your actual API base URL
          const file = new File([blob], 'webcam-frame.png', {
            type: 'image/png',
          })
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
  z-index: 2000;
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
.message_a {
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
.icon-face {
  position: absolute;
  right: -50px;
}
</style>
