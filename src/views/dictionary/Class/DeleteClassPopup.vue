<template>
  <BasePopup
    class="misa-dialog"
    titlePopup="Xóa lớp học"
    classPopup="misa-popup-delete"
    :popupMode="popupMode"
    @onClickClosePopup="onClickClosePopup"
  >
    <template #iconPopup>
      <el-tooltip content="Đóng" placement="top">
        <div class="misa-icon-popup" @click="onClickClosePopup">
          <div class="misa-icon misa-icon-close misa-icon-24"></div>
        </div>
      </el-tooltip>
    </template>
    <template #contentPopup>
      <div class="content-popup-delete">
        {{ Resource.Messenger.requestMsgDelete }}
        <b> {{ classData.ClassName }}</b>
        {{ Resource.Messenger.requestConfilmDelete }}
      </div>
    </template>
    <template #buttonPopup>
      <BaseButton
        @click="onClickAcceptDeleteUser"
        lableButton="Xóa"
        classButton="misa-button-normal w-80 misa-btn-danger"
      ></BaseButton>
    </template>
  </BasePopup>
</template>

<script>
import Resource from '@/commons/Resource'
import ObjectFunction from '@/commons/CommonFuction'
import ClassApi from '@/apis/classApi'
import BasePopup from '@/components/base/BasePopup.vue'
import BaseButton from '@/components/base/BaseButton.vue'
export default {
  components: {
    BasePopup,
    BaseButton,
  },
  props: {
    /**Đối tượng tòa nhà  */
    classData: {
      type: Object,
    },

    /**Mode của popup */
    popupMode: {
      type: Number,
    },
  },
  data() {
    return {
      /**Object chứa resource */
      Resource: Resource,
      ObjectFunction: ObjectFunction,
    }
  },
  methods: {
    /** Mô tả: Gửi sự kiện đóng popup
     * @param
     * @return
     * CreatedBy: bqdiep
     */
    onClickClosePopup() {
      this.$emit('onClickClosePopup')
    },
    /** Mô tả: Sự kiện nhấn vào nút xóa tòa nhà
     * CreatedBy: bqdiep
     */
    async onClickAcceptDeleteUser() {
      try {
        let currentThis = this
        currentThis.$emit('onShowLoading') // hiển thị loading
        await ClassApi.delete(currentThis.classData.ClassID).then(
          () => {
            // toast thông báo xóa thành công
            ObjectFunction.toastMessage(
              Resource.Messenger.DeleteSucces,
              Resource.Messenger.Success,
            )
            currentThis.onClickClosePopup() // đóng popup
            currentThis.$emit('onLoadData') // load lại dữ liệu
          },
          (err) => {
            console.log(err)
          },
        )
      } catch (error) {
        console.log(error)
      }
    },
  },
}
</script>
