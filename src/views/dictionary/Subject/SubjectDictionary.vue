<template>
  <div id="body-Subject-dictionary">
    <!-- Begin body -->
    <div id="bd-Subject" class="Body">
      <div class="filter-options">
        <base-input
          class="misa-input-wrap flex w-240 mg-12"
          placeholder="Tìm kiếm môn học"
          v-model="dataComponent.userFilter"
          @keyup="filterUser"
          classInput="misa-input"
        >
          <div class="misa-icon misa-icon-search misa-icon-24"></div>
        </base-input>
        <div class="btn-add flex">
          <DxButton
            class=""
            icon="add"
            :width="130"
            text="Thêm mới"
            type="default"
            styling-mode="contained"
            @click="addSubject"
          />
          <el-tooltip content="Lấy lại dữ liệu" placement="top">
            <div class="mgl-16" @click="showLoading(true), getData()">
              <div class="icon-sibar icon-refesh misa-icon-24 mgt-8"></div>
            </div>
          </el-tooltip>
        </div>
      </div>
      <!-- Begin table -->
      <div class="misa-tabble">
        <BaseTable
          :optionItems="headerTableSubject"
          :dataSource="dataComponent.dataSource"
          id="table-room"
          :tableMode="0"
        >
          <template #baseCell="{ data }">
            <BaseCellTemplace
              :data="data"
              id="SubjectID"
              @onClickShowPopupDelete="onClickShowPopupDelete"
              @onClickShowPopupEdit="onClickShowPopupEdit"
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
    <!-- End body -->
    <!--Begin Popup detail -->
    <BuidingDictionaryDetail
      v-if="dataComponent.isShowForm"
      :SubjectData="JSON.parse(JSON.stringify(dataComponent.SubjectData))"
      @onCloseForm="showFormDetail(false)"
      :popupMode="dataComponent.popupMode"
      @onLoadData="getData()"
      @onShowLoading="showLoading(true)"
    />
    <!-- End popup detail -->
    <!-- Begin popup delete -->
    <DeleteSubjectPopup
      @onClickClosePopup="onClickClosePopup"
      @onLoadData="getData()"
      @onShowLoading="showLoading(true)"
      @onHideLoading="showLoading(false)"
      :popupMode="dataComponent.popupMode"
      v-if="dataComponent.popupMode == Enum.PopupMode.DeleteMode"
      :SubjectData="JSON.parse(JSON.stringify(dataComponent.SubjectData))"
    />
    <!-- End popup delete -->
  </div>
  <!-- Loading -->
  <BaseLoading :isShowLoading="dataComponent.isShowLoading"></BaseLoading>
</template>
<script>
import BasePaging from '@/components/base/BasePaging.vue'
import BaseCellTemplace from '@/components/base/BaseCellTemplace.vue'
import BaseTable from '@/components/base/BaseTable.vue'
import Enum from '@/commons/Enum'
import { DxButton } from 'devextreme-vue/button'
import { reactive } from 'vue'
import { mapState } from 'vuex'
import BuidingDictionaryDetail from '../Subject/SubjectDictionaryDetailPopup.vue'
import SubjectApi from '@/apis/SubjectApi'
import DeleteSubjectPopup from '../Subject/DeleteSubjectPopup.vue'
import BaseLoading from '@/components/base/BaseLoading.vue'
import BaseInput from '@/components/base/BaseInput.vue'
export default {
  components: {
    DxButton,
    BaseCellTemplace,
    BasePaging,
    BaseTable,
    BuidingDictionaryDetail,
    DeleteSubjectPopup,
    BaseInput,
    BaseLoading,
  },

  setup() {
    var dataComponent = reactive({
      /** Data */
      dataSource: [],

      /** Check admin */
      isAdmin: true,

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
      SubjectData: {},

      /**Popup edit= true, popup Add = False */
      isEdit: false,
      /** Biến show loading: true- show, false - hide*/
      isShowLoading: false,
      /**Biến show popup */
      isShowForm: false,
      /**Biến trạng thái popup */
      popupMode: 0,
      userFilter: '',
      RoleID: '',
      /**Timout của tìm kiếm */
      timeout: 1000,
    })
    /**
     * Hiển thị popup
     * bqdiep
     * @param {Boolean} isShow
     */
    function showFormDetail(isShow) {
      dataComponent.isShowForm = isShow
    }

    /**
     * Header của table
     * bqdiep
     */
    var headerTableSubject = [
      {
        dataField: 'SubjectID',
        visible: false,
        width: 0,
      },
      {
        dataField: 'SubjectCode',
        caption: 'Mã môn học',
        visible: true,
        width: 200,
      },
      {
        dataField: 'SubjectName',
        caption: 'Tên môn học',
        visible: true,
        width: 200,
      },
      {
        dataField: 'Credits',
        caption: 'Số tín chỉ',
        visible: true,
        width: 200,
      },
      {
        dataField: 'LessonSummary',
        caption: 'Số tiết',
        visible: true,
        width: 200,
      },

      {
        dataField: '',
        caption: '',
        width: 50,
      },
    ]

    /** Mô tả: Hàm hiển thị popup xóa người dùng
     * @param {string} userId Mã người dùng
     * @param {string} userName Tên người dùng
     * CreatedBy: bqdiep
     * Created Date: 02-09-2022 14:12:42
     */
    function onClickShowPopupDelete(id) {
      dataComponent.SubjectData = dataComponent.dataSource.find(
        (x) => x.SubjectID == id,
      )
      dataComponent.popupMode = Enum.PopupMode.DeleteMode // Gán lại trạng thái của popup
    }
    /** Mô tả: ẩn popup
     * CreatedBy: bqdiep
     * Created Date: 11-09-2022 08:22:11
     */
    function onClickClosePopup() {
      dataComponent.popupMode = -1
    }

    /**
     * Mô tả : Hàm show/hide loading
     * @param {Boolean} isShow true: hiển thị loading, false: ẩn loading
     * @Createdby: bqdiep
     */
    function showLoading(isShow) {
      dataComponent.isShowLoading = isShow
    }

    /** Mô tả: Hàm hiển thị popup sửa vai trò của người dùng
     * @param {Object} user đối tượng người dùng
     * CreatedBy: bqdiep
     * Created Date: 03-09-2022 07:02:41
     */
    function onClickShowPopupEdit(id) {
      dataComponent.SubjectData = dataComponent.dataSource.find(
        (x) => x.SubjectID == id,
      )
      dataComponent.popupMode = Enum.PopupMode.EditMode // Gán lại trạng thái của popup
      showFormDetail(true)
    }

    /**
     * lấy dữ liệu
     *
     */
    const getData = () => {
      try {
        SubjectApi.getPaging({
          pageIndex: dataComponent.pageIndex,
          pageSize: dataComponent.pageSize,
          keyword: dataComponent.userFilter,
        }).then((res) => {
          dataComponent.dataSource = res.data.Data || []
          dataComponent.pageIndex = res.data.CurrentPage
          dataComponent.startRecord = res.data.StartRecord
          dataComponent.endRecord = res.data.EndRecord
          dataComponent.totalRecord = res.data.TotalRecord
          showLoading(false)
        })
      } catch (error) {
        console.log(error)
      }
    }

    const deleteSubject = (event) => {
      let id = event.element.accessKey
      dataComponent.SubjectData = dataComponent.dataSource.find(
        (x) => x.SubjectID == id,
      )
      dataComponent.deleteVisible = true
    }

    /**
     * Sự kiện thay đổi số bản ghi/trang
     */
    const pageSizeSelected = (size) => {
      dataComponent.pageSize = size
      showLoading(true)
      getData()
    }

    /**
     * Sự kiện thay đổi số trang
     */
    const currentPage = (val) => {
      dataComponent.pageIndex = val
      showLoading(true)
      getData()
    }

    const addSubject = () => {
      dataComponent.SubjectData = {}
      showFormDetail(true)
      dataComponent.popupMode = Enum.PopupMode.AddMode
      dataComponent.popupVisible = true
    }
    function filterUser() {
      clearTimeout(dataComponent.timeout)
      dataComponent.timeout = setTimeout(() => {
        getData()
      }, 1000)
    }
    return {
      dataComponent,
      getData,
      pageSizeSelected,
      currentPage,
      addSubject,
      deleteSubject,
      headerTableSubject,
      onClickShowPopupDelete,
      onClickShowPopupEdit,
      showLoading,
      showFormDetail,
      onClickClosePopup,
      filterUser,
    }
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
    this.getData()
    this.isAdmin =
      localStorage.getItem('roleOption') - 0 == Enum.RoleOption.Admin
        ? true
        : false
  },
}
</script>

<style lang="scss" scoped>
#body-Subject-dictionary {
  background-color: #efefef;
  height: calc(100%);
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
#bd-Subject {
  height: calc(100vh - 72px);
  background: white;
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
</style>
