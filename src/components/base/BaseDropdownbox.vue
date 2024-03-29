<template>
  <div
    class="dx-field-value misa-selectbox flex"
    :class="{
      'misa-input-required': error != '',
      tooltip: error != '',
      'misa-input-Parent': classParent != false,
    }"
  >
    <div class="lable-input t-title-lable flex" v-if="lable">
      {{ lable }}
      <div v-if="required" :class="{ requiredField: required }">
        <span class="t-required"> &nbsp;*</span>
      </div>
    </div>
    <el-tooltip :disabled="error == ''" :content="error" placement="top">
      <DxSelectBox
        :class="[{ 'misa-input-required': error != '' }, classDropdownbox]"
        :data-source="dataSource"
        drop-down-button-template="iconDropdown"
        item-template="customItem"
        :display-expr="optionName"
        :value-expr="optionValue"
        :placeholder="placeholder"
        v-model:selected-item="selectedItem"
        :tabIndex="tabindex"
        :value="value"
        @value-changed="onValueChange"
        :height="height"
        :width="width"
        :searchEnabled="isSearch"
        @focusIn="handleFocusIn"
        @focusOut="validateError"
        :opened="opened"
        @enterKey="handleEnterkey"
        :onInput="handleInput"
        ref="dropdown"
        :disabled="isDisable"
      >
        <template #iconDropdown="{}">
          <div class="misa-icon misa-icon-dropdown misa-icon-24"></div>
        </template>
        <template #customItem="{ data }">
          <el-tooltip
            :content="data[optionName]"
            placement="top"
            :hide-after="50"
          >
            <div class="flex">
              {{ data[optionName] }}

              <div class="div">
                <slot></slot>
              </div>
            </div>
          </el-tooltip>
        </template>
      </DxSelectBox>
    </el-tooltip>
  </div>
</template>

<script>
import { DxSelectBox } from 'devextreme-vue/select-box'
export default {
  emits: ['handleBlurInput', 'handleKeyupInput', 'onValueChange'],
  components: {
    DxSelectBox,
  },
  props: {
    /**Chiều rộng */
    width: {
      type: Number,
    },

    /**Chiều cao */
    height: {
      type: Number,
    },

    /**true: Có thể search, false: ko search được */
    isSearch: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
    /**Tên class */
    classDropdownbox: {
      type: String,
      default: '',
    },

    /**Giá trị của dropdown khi là số */
    value: {
      type: [Number, String],
    },

    /**Placholder */
    placeholder: {
      type: String,
      default: '',
    },

    /**Mảng data */
    dataSource: Object,

    /**Tên */
    optionName: {
      type: String,
      default: '',
    },

    /**Giá trị */
    optionValue: {
      type: String,
      default: '',
    },

    /**Tabindex của dropdown */
    tabindex: {
      type: Number,
      default: -1,
    },
    /** lỗi của input trong trường required*/
    error: {
      type: String,
      default: '',
    },
    lable: {
      type: String,
      default: '',
    },
    /**Disable  */
    isDisable: {
      type: Boolean,
      default: false,
    },
    classParent: {
      type: Boolean,
      default: false,
    },
    showTooltip: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      /**Object chứa item của dropdown */
      selectedItem: {},

      /**Biến đóng mở dropdownbox */
      opened: false,
    }
  },
  methods: {
    /** Mô tả: Focus vào input của dropdown
     * CreatedBy: bqdiep
     */
    autoFocus() {
      let input = this.$refs['dropdown'].$el.querySelector(
        '.dx-texteditor-input',
      )
      input.focus()
    },
    handleInput(e) {
      console.log(e)
    },
    /** Mô tả: Gửi sự kiện thay đổi giá trị
     * CreatedBy: bqdiep
     */
    onValueChange(e) {
      if (e.value) this.$emit('onValueChange', e.value)
      else {
        this.selectedItem = {}
        this.$emit('onValueChange', '')
      }
    },

    /** Mô tả: Sự kiện enter
     * CreatedBy: bqdiep
     */
    handleEnterkey() {
      this.opened = true
    },

    /** Mô tả: Gửi sự kiện focus
     * CreatedBy: bqdiep
     */
    handleFocusIn() {
      this.opened = true
      this.$emit('handleKeyupInput')
    },
    /** Mô tả: Thêm lỗi hoặc bỏ lỗi dropdown
     * @param {string} isErr : valid - không có lỗi, invalid - có lỗi
     * CreatedBy: bqdiep
     */
    isErrorInput(isErr) {
      this.isError = isErr
    },

    /** Mô tả: Hàm validate khi blur vào dropdown
     * CreatedBy: bqdiep
     */
    validateError() {
      this.opened = false

      this.$emit('handleBlurInput')
    },
  },
}
</script>

<style scoped>
@import url(../../styles/components/dropdown-box.css);
@import url(../../styles/components/icon.css);

.t-input-required {
  border: 1px solid #ff4747 !important ;
}
.t-required {
  color: #ff4747;
}

.lable-input {
  font-size: 14px;
  width: 30%;
  padding-top: 5px;
}
.misa-input-Parent {
  margin-left: 15px;
  width: 220px !important;
}

.tooltip:hover:after {
  display: block;
}
</style>
