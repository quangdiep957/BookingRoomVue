<template>
  <div class="dropdown">
    <div class="selected-items" @click="toggleDropdown">
      {{ selectedItems.length > 0 ? selectedItems.join(', ') : 'Select items' }}
    </div>
    <div v-if="isOpen" class="dropdown-list">
      <label class="checkbox-label">
        <input type="checkbox" @change="selectAll" :checked="allSelected" />
        Select All
      </label>
      <label v-for="(item, index) in items" :key="index" class="checkbox-label">
        <input
          type="checkbox"
          :value="item"
          v-model="selectedItems"
          @change="handleCheckboxChange"
        />
        {{ item }}
      </label>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isOpen: false,
      items: ['Item 1', 'Item 2', 'Item 3', 'Item 4'],
      selectedItems: [],
    }
  },
  computed: {
    allSelected() {
      return this.selectedItems.length === this.items.length
    },
  },
  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen
    },
    handleCheckboxChange() {
      // Custom logic, if needed
    },
    selectAll() {
      if (this.allSelected) {
        this.selectedItems = []
      } else {
        this.selectedItems = [...this.items]
      }
    },
  },
}
</script>

<style>
/* ... (unchanged styles) */
</style>
