<template>
  <div id="body-browsing">
    <div id="bd-room-browsing" class="Body">
      <div class="filter-options flex">
        <div class="t-row">
          <BaseDate
            class="mt-16"
            :labelMode="'hidden'"
            :stylingMode="'outlined'"
            :value="dataComponent.CurrentDate"
            @onValueChanged="onDateBoxChanged"
            placeholder="DD/MM/YYYY"
          >
          </BaseDate>
        </div>

        <div class="t-row">
          <BaseDropdownbox
            placeholder="Chọn ca học"
            classDropdownbox="drop-down-utc mgl-16"
            :dataSource="dataTimeWithAll"
            optionName="TimeSlotName"
            optionValue="TimeSlotID"
            :height="38"
            :width="150"
            @onValueChange="onValueChangeTime"
          ></BaseDropdownbox>
        </div>
        <el-tooltip content="Lấy lại dữ liệu" placement="top">
          <div
            class="absolute-right mgl-16"
            @click="showLoading(true), getData()"
          >
            <div class="icon-sibar icon-refesh misa-icon-24 mgt-8"></div>
          </div>
        </el-tooltip>
      </div>
      <!-- Begin table -->
      <div class="misa-tabble">
        <BaseTable
          :optionItems="headerTableBookingRoom"
          :dataSource="dataComponent.dataSource"
          id="table-equipment"
          :tableMode="0"
        >
          <template #baseCell="{ data }">
            <BaseCellTemplace
              :data="data"
              id="BookingRoomID"
              @onClickShowPopupReject="confirmRefuseClick"
              @onClickShowPopupApprove="confirmApproveClick"
              :isAdmin="dataComponent.isAdmin"
              @onClickShowPopupEdit="onClickShowViewDetailPopup"
            ></BaseCellTemplace>
          </template>
        </BaseTable>
      </div>
      <!-- End table -->
      <!-- Begin paging -->
      <div class="misa-pagingtion">
        <BasePaging
          :totalRecord="dataComponent.totalRecord"
          @pageSizeSelected="pageSizeSelected"
          @currentPage="currentPage"
          :currentPage="dataComponent.pageIndex"
          :startRecord="dataComponent.startRecord"
          :endRecord="dataComponent.endRecord"
        ></BasePaging>
      </div>
      <!-- End Paging -->
    </div>
  </div>
  <!--Begin Popup detail -->
  <RoomBookingPopup
    v-if="dataComponent.isShowForm"
    @onCloseForm="dataComponent.isShowForm = false"
    @onShowLoading="showLoading(true)"
    :bookingID="dataComponent.bookingID"
    :popupMode="dataComponent.popupMode"
    :isAdmin="dataComponent.isAdmin"
    @onLoadData="getData"
  />
  <!-- Loading -->
  <!-- Loading -->
  <BaseLoading :isShowLoading="dataComponent.isShowLoading"></BaseLoading>
</template>
<script>
import BookingRoomApi from '@/apis/BookingRoomApi'
import BasePaging from '@/components/base/BasePaging.vue'
import BaseCellTemplace from '@/components/base/BaseCellTemplace.vue'
import BaseTable from '@/components/base/BaseTable.vue'
import Enum from '@/commons/Enum'
import { reactive } from 'vue'
import BaseLoading from '@/components/base/BaseLoading.vue'
import RoomBookingPopup from '../booking/RoomBookingPopup.vue'
import BaseDate from '@/components/base/BaseDate.vue'
import BaseDropdownbox from '@/components/base/BaseDropdownbox.vue'
import { mapActions, mapState } from 'vuex'
export default {
  components: {
    BaseTable,
    BaseCellTemplace,
    BasePaging,
    BaseLoading,
    RoomBookingPopup,
    BaseDate,
    BaseDropdownbox,
  },
  props: {
    weekID: {
      type: Number,
    },
  },

  setup() {
    var dataComponent = reactive({
      dataSource: [],
      isAdmin: false,
      pageIndex: 1,
      pageSize: 15,
      popupVisible: false,
      refuseVisible: false,
      dataSelect: {},
      startRecord: 1,
      endRecord: 1,
      totalRecord: 1,
      /**Timout của tìm kiếm */
      timeout: 1000,
      keyword: '',
      /** Biến show loading: true- show, false - hide*/
      isShowLoading: false,
      userID: null,
      bookingID: null,
      popupMode: 0,
      isShowForm: false,
      TimeSlotID: null,
      CurrentDate: new Date(),
    })
    var headerTableBookingRoom = [
      {
        dataField: 'BookingRoomID',
        visible: false,
        width: 0,
      },

      {
        dataField: 'RoomName',
        caption: 'Địa điểm',
        visible: true,
        width: 180,
      },
      {
        dataField: 'TimeSlotName',
        caption: 'Ca đặt',
        visible: true,
        width: 150,
      },
      {
        dataField: 'DateRequest',
        caption: 'Ngày yêu cầu',
        visible: true,
        width: 130,
        dataType: 'date',
        format: 'dd/MM/yyyy',
        calculateCellValue: function (data) {
          const date = new Date(data.DateRequest)
          const day = date.getDate().toString().padStart(2, '0')
          const month = (date.getMonth() + 1).toString().padStart(2, '0')
          const year = date.getFullYear()
          return `${day}/${month}/${year}`
        },
      },
      {
        dataField: 'StartDate',
        caption: 'Ngày sử dụng',
        visible: true,
        width: 120,
        dataType: 'date',
        format: 'dd/MM/yyyy',
        calculateCellValue: function (data) {
          const date = new Date(data.StartDate)
          const day = date.getDate().toString().padStart(2, '0')
          const month = (date.getMonth() + 1).toString().padStart(2, '0')
          const year = date.getFullYear()
          return `${day}/${month}/${year}`
        },
      },

      {
        dataField: 'StatusBooking',
        caption: 'Trạng thái',
        visible: true,
        width: 150,
      },
      {
        dataField: 'RefusalReason',
        caption: 'Lý do',
        width: 400,
        visible: true,
      },
      {
        dataField: 'detail',
        caption: '',
      },
    ]
    /**
     * Mô tả : Hàm show/hide loading
     * @param {Boolean} isShow true: hiển thị loading, false: ẩn loading
     * @Createdby: bqdiep
     */
    function showLoading(isShow) {
      dataComponent.isShowLoading = isShow
    }
    /**
     * đóng popup phê duyệt
     * @param {
     * } val
     */
    const closePopup = () => {
      dataComponent.popupVisible = false
    }
    /** Mô tả: ẩn popup
     * CreatedBy: bqdiep
     * Created Date: 11-09-2022 08:22:11
     */
    function onClickClosePopup() {
      dataComponent.popupMode = -1
    }
    /** Mô tả: Sự kiện keyup để tìm kiếm lịch
     * CreatedBy: bqdiep
     */
    function filterBooking() {
      clearTimeout(dataComponent.timeout)
      dataComponent.timeout = setTimeout(() => {
        getData()
      }, 500)
    }
    /**
     * lấy dữ liệu
     *
     */
    const getData = () => {
      try {
        BookingRoomApi.getPagingHistory({
          pageIndex: dataComponent.pageIndex,
          pageSize: dataComponent.pageSize,
          keyword: dataComponent.keyword,
          userID: dataComponent.userID,
          timeSlotID: dataComponent.TimeSlotID,
          currentDate: dataComponent.CurrentDate,
        }).then((res) => {
          dataComponent.dataSource = res.data.Data || []
          dataComponent.pageIndex = res.data.CurrentPage
          dataComponent.startRecord = res.data.StartRecord
          dataComponent.endRecord = res.data.EndRecord
          dataComponent.totalRecord = res.data.TotalRecord
          showLoading(false)
        })
      } catch (error) {
        showLoading(false)
        console.log(error)
      }
    }
    /**
     * load lại dữ liệu khi thay đổi số bản ghi/ trang
     * @param {*} size - số bản ghi/ trang
     */
    const pageSizeSelected = (size) => {
      dataComponent.pageSize = size
      showLoading(true)
      getData()
    }

    /**
     * load lại dữ liệu khi thay đổi trang
     * @param {*} val - trang hiện tại
     */
    const currentPage = (val) => {
      dataComponent.pageIndex = val
      showLoading(true)
      getData()
    }
    /** Mô tả: Hàm hiển thị popup sửa vai trò của người dùng
     * @param {Object} user đối tượng người dùng
     * CreatedBy: bqdiep
     * Created Date: 03-09-2022 07:02:41
     */
    function onClickShowViewDetailPopup(id) {
      dataComponent.bookingID = id
      dataComponent.popupMode = Enum.PopupMode.HistoryMode // Gán lại trạng thái của popup
      dataComponent.isShowForm = true
    }
    /**
     * Sự kiện thay đổi phòng
     * @param {*} value
     */
    function onValueChangeTime(value) {
      dataComponent.TimeSlotID = value ? value : null
      showLoading(true)
      getData()
    }
    // cập nhật lại ngày khi chọn lại
    function onDateBoxChanged(item) {
      dataComponent.CurrentDate = item.value
      getData()
    }
    return {
      dataComponent,
      getData,
      pageSizeSelected,
      currentPage,
      closePopup,
      headerTableBookingRoom,
      filterBooking,
      showLoading,
      onClickClosePopup,
      onClickShowViewDetailPopup,
      onValueChangeTime,
      onDateBoxChanged,
    }
  },
  methods: {
    // Gọi hàm load data từ store
    // bqdiep
    ...mapActions({
      loadDataTimes: 'dictionary/loadDataTimes',
    }),
  },

  computed: {
    ...mapState({
      roleOption: (state) => state.auth.roleOption,
      dataTime: (state) => state.dictionary.dataTime,
    }),
    dataTimeWithAll() {
      const dataTime = this.dataTime
      return (
        dataTime?.unshift({
          TimeSlotName: 'Tất cả',
          TimeSlotID: null,
        }) && dataTime
      )
    },
    // Đăng ký đối tượng Enum trong phạm vi của component
    Enum() {
      return Enum
    },
  },
  async mounted() {
    try {
      await this.loadDataTimes()
    } catch (error) {
      console.error(error)
    }
    this.dataComponent.isAdmin =
      localStorage.getItem('roleOption') - 0 == Enum.RoleOption.Admin
        ? true
        : false
    this.dataComponent.userID = JSON.parse(localStorage.getItem('user')).UserID
    this.showLoading(true)
    this.getData()
  },
}
</script>

<style lang="scss" scoped>
#body-browsing {
  flex: 1;
  background-color: #efefef;
  height: calc(100% - 75px);
}

#bd-room-browsing {
  height: calc(100vh - 72px);
  background: white;
  padding: 20px;
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
.flex {
  display: flex;
}
.btn {
  text-decoration: none !important;
}
.approve {
  color: #4cae4c !important;
  padding-right: 5px !important;
}

.refuse {
  color: red !important;
}

.dx-datagrid-search-panel {
  width: 220px !important;
}
#gridContainer {
  height: 600px;
}
.absolute-right {
  right: 0;
  position: absolute;
}
</style>
