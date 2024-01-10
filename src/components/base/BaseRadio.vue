<template>
  <div
    class="dx-field-value misa-selectbox flex"
    :class="{ 'misa-input-required': error != '', tooltip: error != '' }"
  >
    <div class="lable-input t-title-lable flex" v-if="lable">
      {{ lable }}
      <div v-if="required" :class="{ requiredField: required }">
        <span class="t-required"> &nbsp;*</span>
      </div>
    </div>
    <el-tooltip :disabled="error == ''" :content="error" placement="top">
    </el-tooltip>

    <div class="mb-2 flex items-center text-sm">
      <el-radio-group v-model="radio1" class="ml-4" @change="onOptionChange">
        <el-radio label="1" size="large">Ngày</el-radio>
        <el-radio label="2" size="large">Tuần</el-radio>
        <el-radio label="3" size="large">Tháng</el-radio>
      </el-radio-group>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  props: {
    /**Chiều rộng */
    width: {
      type: Number,
    },

    /**Chiều cao */
    height: {
      type: Number,
    },

    /**Tên class */
    classDropdownbox: {
      type: String,
      default: '',
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
    value: {
      type: Object,
    },

    /**Tabindex của popup */
    tabindex: {
      type: Number,
      default: -1,
    },
    /** lỗi của input trong trường required*/
    error: {
      type: String,
      default: '',
    },
    required: {
      type: Boolean,
      default: false,
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
  },
  data() {
    return {
      /**biến check lỗi của select tag box: không có lỗi - valid, có lỗi - invalid */
      isError: 'valid',
      opened: false,
      radio1: '1',
    }
  },
  created() {
    this.$emit('onOptionChangeCheckBox', this.radio1)
  },
  methods: {
    /** Mô tả: Gửi sự kiện khi có sự thay đổi giá trị
     * CreatedBy: bqdiep
     */
    onOptionChange() {
      this.$emit('onOptionChangeCheckBox', this.radio1)
    },
    /**
     * Mô tả : Focus vào input
     * @Createdby: bqdiep
     */
    autoFocus() {
      let input = this.$refs['dropdown'].$el.querySelector(
        '.dx-texteditor-input',
      )
      input.focus()
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
    /** Mô tả: sự kiện focus out của select box
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
.drop-down.dx-show-invalid-badge.dx-tagbox.dx-selectbox.dx-textbox.dx-texteditor.dx-dropdowneditor-button-visible.dx-editor-outlined.dx-texteditor-empty.dx-widget.dx-tagbox-default-template.dx-dropdowneditor.dx-dropdowneditor-field-clickable.dx-invalid {
  border: 1px solid #f7453b;
  margin-bottom: 4px;
}

.drop-down-utc {
  width: 70%;
}
.lable-input {
  font-size: 14px;
  width: 30%;
  padding-top: 5px;
}

.tooltip:hover:after {
  display: block;
}
.t-input-required {
  border: 1px solid #ff4747 !important ;
}
.t-required {
  color: #ff4747;
}
</style>
