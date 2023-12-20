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
          <DxButton
            class=""
            :width="130"
            text="FaceID"
            type="default"
            styling-mode="contained"
            @click="ShowCheck"
          />
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

      isCheckFace: false,
      /** Check admin */
      isAdmin: true,
      ObjectFunction: ObjectFunction,
      filterOption: {
        SubjectID: null,
        ClassID: null,
        BookingRoomID: '',
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

      /**Ẩn hiện popup thêm mới | popup sửa*/
      popupVisible: false,

      message: '',

      dataSelect: {},

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
          width: 200,
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
          width: 200,
        },
      ],
    }
  },
  methods: {
    onValueChangeSubject(value) {
      this.filterOption.SubjectID = value ? value : null
      this.showLoading(true)
      this.getData()
    },
    onValueChangeBooking(value) {
      this.filterOption.BookingRoomID = value ? value : null
      this.showLoading(true)
      this.getData()
    },
    onValueChangeClass(value) {
      this.filterOption.ClassID = value ? value : null
      this.showLoading(true)
      this.getData()
    },
    getData() {
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
        Student.getListCheck(param).then((res) => {
          this.dataSource = res.data.Data || []
          // lấy danh sách môn học
          this.showLoading(false)
        })
      } catch (error) {
        console.log(error)
      }
    },

    getDataCombo() {
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
        Student.getListCheck(param).then((res) => {
          this.dataSource = []
          // lấy danh sách class
          this.dataSubject = res.data.Subjects
          this.dataClass = res.data.Classe
          this.dataBooking = res.data.Booking
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
    onDateBoxChanged(item) {
      this.filterOption.DateRequest = item.value
      this.getData()
    },
    ShowCheck() {
      this.isCheckFace = true
    },
    // Điểm danh bằng tay
    addCheckFace() {
      this.showLoading(true)
      let param = {
        param: JSON.stringify(this.dataSource),
      }
      Student.checkAttendanceApp(param).then((res) => {
        if (res) {
          ObjectFunction.toastMessage(
            'Cập nhật thành công.',
            Resource.Messenger.Success,
          )
        }

        this.showLoading(false)
      })
    },
    InsertFace(student) {
      debugger
      this.showLoading(true)
      let param = {
        param: JSON.stringify(student),
      }
      Student.checkAttendanceApp(param)
        .then((res) => {
          if (res) {
            ObjectFunction.toastMessage(
              'Cập nhật thành công.',
              Resource.Messenger.Success,
            )
          }

          this.showLoading(false)
        })
        .catch((err) => {
          console.log(err)
          this.showLoading(false)
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
  mounted() {
    this.showLoading(true)
    this.getDataCombo()
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
</style>
