<template>
  <div @keydown="eventFormDictionary" ref="popupDictionary">
    <BasePopup
      class="misa-dialog"
      :titlePopup="titlePopup"
      classPopup="popup-dictionary-user-detail"
      @onClickClosePopup="onCloseForm"
      :tabindex="9"
    >
      <template #iconPopup>
        <el-tooltip content="Đóng" placement="bottom">
          <div
            class="misa-icon misa-icon-close misa-icon-24"
            @click="onCloseForm"
          ></div>
        </el-tooltip>
      </template>
      <template #contentPopup>
        <div class="t-row-group flex mgt-16">
          <div class="t-row-left">
            <div class="t-lable mgb-8 flex">
              <div class="t-lable-title">Mã sinh viên</div>
              <div class="required">
                <span class="t-required"> &nbsp;*</span>
              </div>
            </div>
            <base-input
              classInput="misa-input"
              :focus="focus"
              class="misa-input-secondary mgb-8 input-user-code"
              :required="true"
              :maxlength="20"
              :tabindex="1"
              v-model="student.StudentCode"
              @handleBlurInput="validate('StudentCode')"
              @handleKeyupInput="removeError('StudentCode')"
              :error="Error['StudentCode']"
            ></base-input>
          </div>
          <div class="t-row-right mgl-16">
            <div class="t-lable mgb-8 flex">
              <div class="t-lable-title">Tên sinh viên</div>
              <div class="required">
                <span class="t-required"> &nbsp;*</span>
              </div>
            </div>
            <base-input
              classInput="misa-input"
              class="misa-input-secondary mgb-8"
              :required="true"
              :maxlength="100"
              :tabindex="2"
              v-model="student.FullName"
              @handleBlurInput="validate('FullName')"
              @handleKeyupInput="removeError('FullName')"
              :error="Error['FullName']"
            ></base-input>
          </div>
        </div>
        <div class="t-row-block">
          <div class="t-lable mgb-8">Địa chỉ</div>
          <base-input
            classInput="misa-input"
            class="misa-input-secondary mgb-8"
            :maxlength="255"
            :tabindex="3"
            v-model="student.Address"
          ></base-input>
        </div>
        <div class="t-row-group flex mgt-16">
          <div class="t-row-left">
            <div class="t-lable mgb-8 flex">
              <div class="t-lable-title">Số điện thoại liên hệ</div>
              <div class="required">
                <span class="t-required"> &nbsp;*</span>
              </div>
            </div>
            <base-input
              classInput="misa-input"
              class="misa-input-secondary mgb-8 input-user-code"
              :required="true"
              :maxlength="25"
              :tabindex="4"
              v-model="student.PhoneNumber"
              @handleBlurInput="validate('PhoneNumber')"
              @handleKeyupInput="removeError('PhoneNumber')"
              :error="Error['PhoneNumber']"
            ></base-input>
          </div>
          <div class="t-row-right mgl-16">
            <div class="t-lable mgb-8 flex">
              <div class="t-lable-title">Email</div>
              <div class="required">
                <span class="t-required"> &nbsp;*</span>
              </div>
            </div>
            <base-input
              classInput="misa-input"
              class="misa-input-secondary mgb-8"
              :required="true"
              :maxlength="50"
              :tabindex="5"
              v-model="student.Email"
              @handleBlurInput="validate('Email')"
              @handleKeyupInput="removeError('Email')"
              :error="Error['Email']"
            ></base-input>
          </div>
        </div>
        <div class="t-row-block mgb-16">
          <div class="t-lable mgb-8 flex">
            <div class="t-lable-title">Khoa</div>
            <div class="required">
              <span class="t-required"> &nbsp;*</span>
            </div>
          </div>
          <BaseDropdownbox
            :required="true"
            classDropdownbox="drop-down-utc "
            :dataSource="dataDepartment"
            optionName="DepartmentName"
            optionValue="DepartmentID"
            :isSearch="true"
            :height="34"
            :tabindex="6"
            placeholder="Chọn khoa"
            v-model:value="student.DepartmentID"
            @onValueChange="onValueChangeDepartment"
            @handleBlurInput="validate('DepartmentID')"
            @handleKeyupInput="removeError('DepartmentID')"
            :error="Error['DepartmentID']"
          ></BaseDropdownbox>
        </div>
        <div class="t-row-block mgb-16">
          <div class="t-lable mgb-8 flex">
            <div class="t-lable-title">Lớp</div>
            <div class="required">
              <span class="t-required"> &nbsp;*</span>
            </div>
          </div>
          <BaseDropdownbox
            :required="true"
            classDropdownbox="drop-down-utc "
            :dataSource="dataClass"
            optionName="ClassName"
            optionValue="ClassID"
            :isSearch="true"
            :height="34"
            :tabindex="6"
            placeholder="Chọn lớp"
            v-model:value="student.ClassID"
            @onValueChange="onValueChangeClass"
            @handleBlurInput="validate('ClassID')"
            @handleKeyupInput="removeError('ClassID')"
            :error="Error['ClassID']"
          ></BaseDropdownbox>
        </div>
      </template>
      <template #buttonPopup>
        <BaseButton
          :tabindex="8"
          lableButton="Lưu"
          classButton="misa-button-normal w-86 misa-button-primary "
          @click="beforeSaveData()"
        ></BaseButton>
        <BaseButton
          @keyup="handleKeyup"
          classButton="w-0"
          :tabindex="9"
        ></BaseButton>
      </template>
    </BasePopup>
    <!--Begin Popup Notice Error -->
    <PopupNotice
      :contentPopup="contentPopup"
      :classIcon="classIconPopup"
      @onClickClosePopup="onClickClosePopup"
      v-if="this.popupNoticeMode == Enum.PopupMode.NotifyMode"
    >
      <BaseButton
        :tabindex="1"
        :initFocus="true"
        @keydown.enter="onClickClosePopup"
        @click="onClickClosePopup"
        lableButton="Đóng"
        classButton="misa-button-normal w-80 misa-btn-warning"
      ></BaseButton>
    </PopupNotice>
    <!--End Popup Notice Error -->
  </div>
</template>

<script>
import StudentApi from '@/apis/StudentApi'
import BaseDropdownbox from '@/components/base/BaseDropdownbox.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BasePopup from '@/components/base/BasePopup.vue'
import Enum from '@/commons/Enum'
import Resource from '@/commons/Resource'
import PopupNotice from '@/components/popup/PopupNotice.vue'
import { v4 as uuidv4 } from 'uuid'
import { mapActions, mapState } from 'vuex'
import ObjectFunction from '@/commons/CommonFuction'
export default {
  name: ' ',
  components: {
    BaseDropdownbox,
    BaseInput,
    BaseButton,
    BasePopup,
    PopupNotice,
  },
  emits: ['onCloseForm', 'onLoadData', 'onShowLoading'],
  props: {
    studentID: {
      type: Object,
    },
    popupMode: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      StudentCode: '',
      StudentName: '',
      Capacity: 0,
      Enum: Enum,
      focus: true,
      student: {
        StudentID: this.studentID || uuidv4(),
        StudentCode: '',
        FullName: '',
        DepartmentID: '',
        PhoneNumber: '',
        Email: '',
      },
      /**Mảng chứa lỗi */
      validateErrorList: [],
      /**Trạng thái của popup */
      popupNoticeMode: -1,
      Error: {},
      titlePopup: 'Thêm sinh viên',
      isAdmin: false,
    }
  },

  methods: {
    // Gọi hàm load data từ store
    ...mapActions({
      loadDataDepartments: 'dictionary/loadDataDepartments',
      loadDataClass: 'dictionary/loadDataClassv1',
    }),
    /** Mô tả: Gửi sự kiện đóng form
     * CreatedBy: bqdiep
     */
    onCloseForm() {
      this.$emit('onCloseForm')
    },
    /**
     * Sự kiện thay đổi khoa
     * @param {*} value
     * bqdiep
     */
    onValueChangeDepartment(value) {
      this.student.DepartmentID = value
    },

    /**
     * Sự kiện thay đổi lớp
     * @param {*} value
     * bqdiep
     */
    onValueChangeClass(value) {
      this.student.ClassID = value
    },
    /**
     * Mô tả : Sự kiện khi focus vào input đầu tiên khi tab index đến item cuối cùng của form
     * @Createdby: bqdiep
     */
    handleKeyup(e) {
      if (e.key == 'Tab') {
        this.focus = true
        this.$refs.popupDictionary.querySelector('input[tabindex]').focus()
      }
    },
    /** Mô tả: Hiển thị popup
     * @param
     * CreatedBy: bqdiep
     */
    showPopup(iconPopup, contentPopup) {
      this.classIconPopup = iconPopup
      this.contentPopup = contentPopup
    },
    /** Mô tả: xử lý sự kiện form
     * @param {event}
     * CreatedBy: bqdiep
     */
    eventFormDictionary(e) {
      if (e.key === 'Escape') {
        this.onCloseForm()
      }

      if (e.ctrlKey && e.key.toLowerCase() == 's' && !e.shiftKey) {
        e.preventDefault()
        this.beforeSaveData()
      }
    },
    /**
     * Close popup lỗi và focus và input lỗi đầu tiên
     * bqdiep
     */
    onClickClosePopup() {
      this.popupNoticeMode = -1
      if (this.validateErrorList.length > 0) {
        this.$refs.popupDictionary
          .querySelector('.misa-input-required input[tabindex]')
          .focus()
      }
    },
    /**
     * Mô tả : sự kiện nhấn vào nút lưu
     * @Createdby: bqdiep
     */
    beforeSaveData() {
      this.validateErrorList = [] // Gán lại array = []
      // Lấy danh sách các trường (fields) của object bookingRoomData
      const fields = Object.keys(this.student)
      // Lặp qua danh sách các trường để lấy tên của các trường
      fields.forEach((field) => {
        this.validate(field)
      })
      // Nếu mảng chứa lỗi không chứa lỗi
      if (this.validateErrorList.length <= 0) {
        // Thêm mới student
        this.saveData()
      } else {
        // Ngược lại
        this.showPopup('misa-icon-notice', Resource.ErrForm.ErrorInput) // Hiển thị popup
        this.popupNoticeMode = Enum.PopupMode.NotifyMode
      }
    },
    /**
     * Validate
     * bqdiep
     */
    validate(fieldName) {
      try {
        if (!this.student[fieldName] && fieldName != 'Address') {
          let field = ''
          if (fieldName == 'FullName') {
            field = 'Tên sinh viên'
          } else if (fieldName == 'PhoneNumber') {
            field = 'Số điện thoại'
          } else if (fieldName == 'Email') {
            field = 'Email'
          } else if (fieldName == 'DepartmentID') {
            field = 'Khoa'
          } else if (fieldName == 'ClassID') {
            field = 'Lớp'
          }
          this.Error[fieldName] = field + ' ' + Resource.ErrForm.IsNotEmpty
          this.validateErrorList.push(fieldName)
        }
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * Xóa bỏ lỗi
     * @param {String} fieldName
     */
    removeError(fieldName) {
      if (this.student[fieldName]) {
        this.Error[fieldName] = ''
      }
    },

    /**
     * Lấy đối tượng user theo khóa chính
     * bqdiep 1/05/2023
     */
    getStudentByID() {
      debugger
      StudentApi.getByID(this.studentID).then((res) => {
        if (res) {
          let data = res.data
          this.student = {
            StudentID: data.StudentID,
            StudentCode: data.StudentCode,
            FullName: data.FullName,
            Email: data.Email,
            PhoneNumber: data.PhoneNumber,
            Address: data.Address,
            ClassID: data.ClassID,
            DepartmentID: data.DepartmentID,
          }
        }
      })
    },
    /**
     * Lưu dữ liệu
     */
    saveData() {
      if (this.popupMode == Enum.PopupMode.EditMode) {
        try {
          StudentApi.updated(this.studentID, this.student).then((res) => {
            if (res && res.data) {
              ObjectFunction.toastMessage(
                Resource.Messenger.UpdateSucces,
                Resource.Messenger.Success,
              )
              this.$emit('onShowLoading')
              this.$emit('onCloseForm')
              this.$emit('onLoadData')
            } else {
              ObjectFunction.toastMessage(
                'Cập nhật thất bại',
                Resource.Messenger.Error,
              )
              this.$emit('onCloseForm')
            }
          })
        } catch (error) {
          console.log(error)
        }
      } else {
        try {
          this.student.AvartarColor = ObjectFunction.generateRandomColor()
          this.student.Password = Resource.PassWordDefault
          StudentApi.insert(this.student).then((res) => {
            if (res && res.data) {
              ObjectFunction.toastMessage(
                Resource.Messenger.InsertSucces,
                Resource.Messenger.Success,
              )
              this.$emit('onShowLoading')
              this.$emit('onCloseForm')
              this.$emit('onLoadData')
            } else {
              ObjectFunction.toastMessage(
                'Thêm thất bại',
                Resource.Messenger.Error,
              )
              this.$emit('onCloseForm')
            }
          })
        } catch (error) {
          console.log(error)
        }
      }
    },
  },
  computed: {
    // Gán data
    ...mapState({
      dataDepartment: (state) => state.dictionary.dataDepartment,
      dataClass: (state) => state.dictionary.dataClass,
    }),
  },
  /**
   * Thực hiện gọi api để lấy dữ liệu phòng ban, vai trò
   * bqdiep 02.04.2023
   */
  async created() {},
  async mounted() {
    try {
      await this.loadDataDepartments()
      await this.loadDataClass()
    } catch (error) {
      console.error(error)
    }
    this.isAdmin =
      localStorage.getItem('roleOption') - 0 == Enum.RoleOption.Admin
        ? true
        : false
    if (this.popupMode == Enum.PopupMode.AddMode) {
      this.titlePopup = 'Thêm sinh viên'
    } else if (this.popupMode == Enum.PopupMode.EditMode) {
      this.getStudentByID()
      this.titlePopup = 'Cập nhật sinh viên'
    }
  },
}
</script>

<style scoped>
.t-row {
  margin: 10px;
  height: 38px;
}
.t-row-left {
  width: 40%;
}
.t-row-right {
  width: 60%;
}
.t-row-block {
  width: 100%;
  height: 56px;
}
</style>
