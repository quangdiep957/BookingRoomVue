<template>
  <div id="body-equipment-dictionary">
    <!-- Begin body -->
    <div id="bd-equipment" class="Body">
      <div class="filter-options">
        <BaseDate
          class="mt-16"
          :labelMode="'hidden'"
          :stylingMode="'outlined'"
          :value="filterOption.DateRequest"
          @onValueChanged="onDateBoxChanged"
        >
        </BaseDate>
        <BaseDropdownbox
          classDropdownbox="drop-down-bulding"
          :dataSource="dataBooking"
          optionName="Subject"
          optionValue="BookingRoomID"
          :height="34"
          :classParent="true"
          :width="300"
          placeholder="Chọn lịch dạy"
          @onValueChange="onValueChangeBooking"
        >
        </BaseDropdownbox>
        <BaseDropdownbox
          classDropdownbox="drop-down-bulding"
          :dataSource="dataSubject"
          optionName="SubjectName"
          optionValue="SubjectID"
          :height="34"
          :classParent="true"
          :width="300"
          placeholder="Chọn môn học"
          @onValueChange="onValueChangeSubject"
        >
        </BaseDropdownbox>

        <BaseDropdownbox
          classDropdownbox="drop-down-bulding"
          :dataSource="dataClass"
          optionName="ClassName"
          optionValue="ClassID"
          :height="34"
          :classParent="true"
          :width="300"
          placeholder="Chọn lớp học"
          @onValueChange="onValueChangeClass"
        >
        </BaseDropdownbox>
        <div class="btn-add flex">
          <div class="dropdown">
            <DxButton
              class="mgr-15"
              :width="130"
              text="FaceID"
              type="default"
              styling-mode="contained"
              @click="toggleDropdown"
            />
            <div v-if="isDropdownOpen" class="dropdown-menu">
              <div @click="ShowCheck()">Điểm danh</div>
              <div @click="registerFace()">Đăng ký</div>
            </div>
          </div>

          <DxButton
            class=""
            :width="130"
            text="Cập nhật"
            type="default"
            styling-mode="contained"
            @click="addCheckFace"
          />
        </div>
      </div>
      <!-- Begin table -->
      <div class="misa-tabble">
        <BaseTable
          :isShowMode="false"
          :showCheckbox="true"
          :optionItems="headerTableEquipment"
          :dataSource="dataSource"
          id="table-room"
          :tableMode="0"
        >
          <template #baseCell="{ data }">
            <BaseCellTemplace
              :data="data"
              id="BookingRoomID"
            ></BaseCellTemplace>
          </template>
        </BaseTable>
      </div>
      <!-- End table -->
      <!-- Begin paging -->
      <div class="misa-pagingtion">
        <BasePaging
          :totalRecord="totalRecord"
          @pageSizeSelected="pageSizeSelected"
          @currentPage="currentPage"
          :currentPage="pageIndex"
          :startRecord="startRecord"
          :endRecord="endRecord"
        ></BasePaging>
      </div>
      <!-- End Paging -->
    </div>
    <!-- End body -->
  </div>
  <!-- Loading -->
  <BaseLoading :isShowLoading="isShowLoading"></BaseLoading>
  <CheckFace
    v-if="isCheckFace"
    :dataStudent="dataSource"
    @InsertFace="InsertFace"
    @onCloseForm="isCheckFace = false"
    :showMessage="showMessage"
    :dataCheckSuccess="dataCheckSuccess"
    :modeCheck="modeCheck"
  ></CheckFace>
</template>
<script>
import BasePaging from '@/components/base/BasePaging.vue'
import BaseCellTemplace from '@/components/base/BaseCellTemplace.vue'
import BaseDate from '@/components/base/BaseDate.vue'
import BaseTable from '@/components/base/BaseTable.vue'
import { DxButton } from 'devextreme-vue/button'
import BaseDropdownbox from '@/components/base/BaseDropdownbox.vue'
import CheckFace from './CheckFace.vue'
import Enum from '@/commons/Enum'
import { mapState } from 'vuex'
import Student from '@/apis/StudentApi'
import BaseLoading from '@/components/base/BaseLoading.vue'
import ObjectFunction from '@/commons/CommonFuction'
import Resource from '@/commons/Resource'
import moment from 'moment-timezone'
export default {
  components: {
    BaseCellTemplace,
    BasePaging,
    BaseTable,
    CheckFace,
    BaseLoading,
    BaseDropdownbox,
    BaseDate,
    DxButton,
  },
  data() {
    return {
      /** Data */
      dataSource: [],
      modeCheck: 'Login',
      isCheckFace: false,
      /** Check admin */
      isAdmin: true,
      ObjectFunction: ObjectFunction,
      filterOption: {
        SubjectID: null,
        ClassID: null,
        BookingRoomID: null,
        UserID: JSON.parse(localStorage.getItem('user')).UserID,
        DateRequest: new Date(),
      },
      /**Trang hiện tại */
      pageIndex: 1,

      /**Số bản ghi/ trang */
      pageSize: 15,

      /**Tổng số bản ghi */
      totalRecord: 0,

      /**Bản ghi bắt đầu */
      startRecord: 1,

      /**Bản ghi kết thúc */
      endRecord: 15,

      dataCheckSuccess: [],

      /**Ẩn hiện popup thêm mới | popup sửa*/
      popupVisible: false,

      message: '',
      dataSourceFirst: [],

      isDropdownOpen: false,
      dataSelect: {},
      dataBooking: [],
      /**Title popup  */
      title: '',

      /**Ẩn hiện popup thêm mới | popup sửa*/
      deleteVisible: false,

      /**Dữ liệu tòa nhà */
      equipmentData: {},

      /**Popup edit= true, popup Add = False */
      isEdit: false,
      /** Biến show loading: true- show, false - hide*/
      isShowLoading: false,
      /**Biến show popup */
      isShowForm: false,
      /**Biến trạng thái popup */
      popupMode: 0,
      /** Từ khóa tìm kiếm thông tin người dùng*/
      userFilter: '',
      RoleID: '',
      /**Timout của tìm kiếm */
      timeout: 1000,

      headerTableEquipment: [
        {
          dataField: 'BookingRoomID',
          visible: false,
          width: 0,
        },
        {
          dataField: 'StudentCode',
          caption: 'Mã sinh viên',
          visible: true,
          width: 200,
        },
        {
          dataField: 'FullName',
          caption: 'Tên sinh viên',
          visible: true,
          width: 250,
        },
        {
          dataField: 'ClassCode',
          caption: 'Mã lớp học',
          visible: true,
          width: 200,
        },
        {
          dataField: 'SubjectName',
          caption: 'Môn học',
          visible: true,
          width: 200,
        },
        {
          dataField: 'DateRequest',
          caption: 'Ngày học',
          visible: true,
          alignment: 'center',
          width: 200,
        },
      ],
    }
  },
  methods: {
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen
    },
    reverseFormatData(student) {
      let fomat = student.map((item) => {
        const serverTime = moment
          .tz(item.DateRequest, 'DD-MM-YYYY', 'Asia/Ho_Chi_Minh')
          .format() // 'YYYY-MM-DDTHH:mm:ssZ' format, adjust as needed

        return { ...item, DateRequest: serverTime }
      })
      return fomat
    },
    formatData() {
      this.dataSource = this.dataSource.map((item) => {
        const vnTime = moment
          .tz(item.DateRequest, 'Asia/Ho_Chi_Minh')
          .format('DD-MM-YYYY')

        return { ...item, DateRequest: vnTime }
      })
    },
    async onValueChangeSubject(value) {
      this.filterOption.SubjectID = value ? value : null
      this.showLoading(true)
      await this.getData()
    },
    async onValueChangeBooking(value) {
      this.filterOption.BookingRoomID = value ? value : null
      this.showLoading(true)
      await this.getData()
    },
    async onValueChangeClass(value) {
      this.filterOption.ClassID = value ? value : null
      this.showLoading(true)
      await this.getData()
    },
    async getData() {
      try {
        let param = {},
          me = this
        if (me.filterOption) {
          param = {
            subjectID: me.filterOption.SubjectID,
            classID: me.filterOption.ClassID,
            userID: me.filterOption.UserID,
            BookingRoomID: me.filterOption.BookingRoomID,
            dateRequest: me.filterOption.DateRequest,
          }
        }
        await Student.getListCheck(param).then((res) => {
          if (me.filterOption.BookingRoomID) {
            this.dataSource = res.data.Data || []
            this.dataSourceFirst = res.data.Data || []
            this.totalRecord = this.dataSource.length
            this.formatData()
          }
          // lấy danh sách môn học
          this.showLoading(false)
        })
      } catch (error) {
        console.log(error)
      }
    },

    async getDataCombo() {
      try {
        let param = {},
          me = this
        if (me.filterOption) {
          param = {
            subjectID: null,
            classID: null,
            userID: me.filterOption.UserID,
            BookingRoomID: null,
            dateRequest: me.filterOption.DateRequest,
          }
        }
        await Student.getListCheck(param).then((res) => {
          this.dataSource = []
          this.dataBooking = []
          // lấy danh sách class
          this.dataSubject = res.data.Subjects
          this.dataClass = res.data.Classe
          if (res.data.Booking && res.data.Booking.length > 0) {
            this.dataBooking = res.data.Booking
          } else {
            this.dataBooking = []
          }
          // lấy danh sách môn học
          this.showLoading(false)
        })
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * Hiển thị popup
     * bqdiep
     * @param {Boolean} isShow
     */
    showFormDetail(isShow) {
      this.isShowForm = isShow
    },

    /** Mô tả: Hàm hiển thị popup xóa người dùng
     * @param {string} userId Mã người dùng
     * @param {string} userName Tên người dùng
     * CreatedBy: bqdiep
     * Created Date: 02-09-2022 14:12:42
     */
    onClickShowPopupDelete(id) {
      this.equipmentData = this.dataSource.find((x) => x.EquipmentID == id)
      this.popupMode = Enum.PopupMode.DeleteMode // Gán lại trạng thái của popup
    },
    /** Mô tả: ẩn popup
     * CreatedBy: bqdiep
     * Created Date: 11-09-2022 08:22:11
     */
    onClickClosePopup() {
      this.popupMode = -1
    },

    /**
     * Mô tả : Hàm show/hide loading
     * @param {Boolean} isShow true: hiển thị loading, false: ẩn loading
     * @Createdby: bqdiep
     */
    showLoading(isShow) {
      this.isShowLoading = isShow
    },

    // deleteEquipment = (event) => {
    //   let id = event.element.accessKey
    //   equipmentData = dataSource.find(
    //     (x) => x.EquipmentID == id,
    //   )
    //   deleteVisible = true
    // }

    // cập nhật lại ngày khi chọn lại
    async onDateBoxChanged(item) {
      this.filterOption.DateRequest = item.value
      await this.getDataCombo()
      await this.getData()
    },
    registerFace() {
      this.isDropdownOpen = false
      this.isCheckFace = true
      this.modeCheck = 'Register'
    },
    ShowCheck() {
      this.isDropdownOpen = false
      this.isCheckFace = true
      this.modeCheck = 'Login'
    },
    // Điểm danh bằng tay
    addCheckFace() {
      this.showLoading(true)

      let param = {
        param: JSON.stringify(this.reverseFormatData(this.dataSource)),
      }
      Student.checkAttendanceApp(param).then((res) => {
        if (res) {
          if (res.data.Status === 5) {
            ObjectFunction.toastMessage(
              'Vượt quá thời gian điểm danh!',
              Resource.Messenger.Error,
            )
          } else {
            ObjectFunction.toastMessage(
              'Cập nhật thành công.',
              Resource.Messenger.Success,
            )
          }
        }

        this.showLoading(false)
      })
    },
    async InsertFace(student) {
      return new Promise((resolve) => {
        // Thực hiện công việc của hàm InsertFace ở đây
        // Kiểm tra xem thằng này đã điểm danh chưa nếu rồi thì thôi
        let check = this.dataSourceFirst.filter(
          (x) =>
            x.StudentCode == student[0].StudentCode &&
            x.BookingRoomID == student[0].BookingRoomID &&
            x.Status == false,
        )
        if (check && check.length > 0) {
          let fomatStudent = this.reverseFormatData(student)
          let param = {
            param: JSON.stringify(fomatStudent),
          }
          Student.checkAttendanceApp(param)
            .then((res) => {
              if (res) {
                // Kiểm tra mess
                if (res.data.Status === 5) {
                  ObjectFunction.toastMessage(
                    'Vượt quá thời gian điểm danh!',
                    Resource.Messenger.Error,
                  )
                } else {
                  if (res.data) {
                    // Nếu thành công thì reload
                    this.getData()
                    this.dataCheckSuccess = student
                  }
                }
              }

              this.showLoading(false)
            })
            .catch((err) => {
              console.log(err)
              this.showLoading(false)
            })
        }
        // Sau khi hoàn tất, gọi resolve để báo hiệu rằng hàm đã hoàn tất
        resolve()
      })
    },
  },
  computed: {
    ...mapState({
      roleOption: (state) => state.auth.roleOption,
    }),
    // Đăng ký đối tượng Enum trong phạm vi của component
    Enum() {
      return Enum
    },
  },
  async mounted() {
    this.showLoading(true)
    await this.getDataCombo()
    this.isAdmin =
      localStorage.getItem('roleOption') - 0 == Enum.RoleOption.Admin
        ? true
        : false
  },
}
</script>

<style lang="scss" scoped>
#body-equipment-dictionary {
  background-color: #efefef;
  height: calc(100% - 75px);
  flex: 1;
}
.filter-options {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 20px;
  position: relative;
  .btn-add {
    right: 0;
    position: absolute;
  }
  .input-field {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding-left: 30px;

    .input-field-icon {
      position: absolute;
      width: 20px;
      height: 20px;
      z-index: 1;
      margin-left: -20px;
      background: url('@/assets/images/Icon.de5bb0db.svg') no-repeat;

      &.icon-search {
        background-position: -194px -2px;
      }
    }
  }
}
#bd-equipment {
  height: calc(100vh - 72px);
  background: #4caf500f;
  padding: 20px;
}

.approve {
  color: #4cae4c !important;
  padding-right: 5px !important;
}

.btn-action {
  border: inherit !important;
  background-color: inherit !important;
}

.dx-icon-edit {
  color: #337ab7 !important;
}

.dx-icon-trash {
  color: #959595 !important;
}

.btn-action > .dx-button-content {
  padding: 0 !important;
}

.edit {
  padding-right: 20px !important;
}

.loading {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.347);
}
.mgr-15 {
  margin-right: 15px !important;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-toggle {
  cursor: pointer;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  display: block;
  background-color: #fff;
  border: 1px solid #ccc;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.dropdown-menu div {
  padding: 8px;
  cursor: pointer;
}

.dropdown-menu div:hover {
  background-color: #f0f0f0;
}
</style>
