<template>
  <div :class="classTable">
    <div id="data-grid">
      <DxDataGrid
        id="gridContainer"
        :data-source="dataSource"
        :show-borders="true"
        :allowColumnReordering="true"
        :allowColumnResizing="true"
        :cell-hint-enabled="true"
        :column-min-width="100"
        no-data-text="Không có dữ liệu"
      >
        <template v-for="(item, index) in optionItems" :key="index">
          <DxColumn
            :width="item.width"
            :data-field="item.dataField"
            :caption="item.caption"
            cell-template="cellTemplateCustom"
            :visible="item.visible"
            :format="item.format"
            :data-type="item.dataType"
            :calculate-cell-value="item.calculateCellValue"
            :alignment="item.alignment"
          />
        </template>
        <!-- Thêm cột checkbox mới -->
        <DxColumn
          v-if="showCheckbox"
          dataField="Status"
          caption="Điểm danh"
          :width="100"
          cell-template="checkboxCellTemplate"
        />
        <template #checkboxCellTemplate="{ data }">
          <el-checkbox v-model="data.value" @change="demo(data)" />
        </template>
        <template #cellTemplateCustom="{ data }">
          <slot name="baseCell" :data="data"></slot>
        </template>
        <DxPaging :enabled="false" />
        <DxEditing
          v-if="isShowMode"
          :allow-updating="allowUpdating"
          :allow-adding="allowAdding"
          :allow-deleting="allowDelete"
          mode="cell"
        />
      </DxDataGrid>
    </div>
  </div>
</template>
<script>
import {
  DxDataGrid,
  DxEditing,
  DxPaging,
  DxColumn,
} from 'devextreme-vue/data-grid'
import Enum from '@/commons/Enum'
export default {
  components: {
    DxDataGrid,
    DxEditing,
    DxColumn,
    DxPaging,
  },
  props: {
    /**Cho phép sửa trên table */
    allowUpdating: {
      type: Boolean,
      default: false,
    },

    /**Cho phép thêm bản ghi trên table */
    allowAdding: {
      type: Boolean,
      default: false,
    },
    /**Cho phép xóa trên table */
    allowDelete: {
      type: Boolean,
      default: false,
    },
    showCheckbox: {
      type: Boolean,
      default: false,
    },

    /**Mảng chứa option Header của table */
    optionItems: {
      typeo: Array,
    },

    /**mảng chứa data table */
    dataSource: {
      typeo: Array,
    },
    isShowMode: {
      type: Boolean,
      default: true,
    },

    /**Tên class của table */
    classTable: String,
  },
  data() {
    return {
      /**Object chứa enum */
      Enum: Enum,
    }
  },
  methods: {
    demo(data) {
      var newVal = data.key.StudentCode
      this.dataSource.forEach((element) => {
        if (element.StudentCode === newVal) {
          element.Status = data.value
        }
      })
      this.$emit('CellValueChanged', this.dataSource)
    },
  },
}
</script>
<style scoped>
@import url(../../styles/components/table.css);
</style>
