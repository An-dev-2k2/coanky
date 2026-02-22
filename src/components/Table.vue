<template>
  <table class="w-full caption-bottom border-separate" style="border-spacing: 0 10px;">
    <thead>
      <tr class="hover:bg-muted/50 data-[state=selected]:bg-muted transition-colors">
        <th v-for="field in fields" :key="field.key"
          class="px-2 py-3 text-sm font-semibold whitespace-nowrap uppercase text-gray-600 relative border-b border-gray-200">
          <slot :name="'head-' + field.key" :field="field">
            <template v-if="field.key === 'index'">
              <p class="text-center">STT</p>
            </template>
            <template v-else>
              <p class="text-left block">
                {{ field.label }}
              </p>
            </template>
          </slot>
        </th>
      </tr>
    </thead>
    <tbody>
      <template v-if="isLoading">
        <RowLoading :colSpan="fields.length" />
      </template>
      <template v-else>
        <template v-if="data.length > 0">
          <tr v-for="(item, rowIndex) in data" :key="item.id" class="group">
            <td v-for="(field, cellIndex) in fields" :key="field.key" :class="{
              'rounded-l-lg': cellIndex === 0,
              'rounded-r-lg': cellIndex === fields.length - 1
            }" class="px-2 py-2 text-sm text-gray-600 group-hover:bg-gray-100 transition-colors">
              <template v-if="field.key === 'index'">
                <p class="text-center font-bold">{{ rowIndex + 1 }}</p>
              </template>
              <template v-else>
                <slot :name="field.key" :item="item" :value="field.key === 'index'
                  ? (rowIndex + 1)
                  : item[field.key]" :field="field" :index="rowIndex">
                  {{ item[field.key] }}
                </slot>
              </template>
            </td>
          </tr>
        </template>
        <template v-else>
          <tr>
            <td :colspan="fields.length" class="text-center py-6">
              <NoData />
            </td>
          </tr>
        </template>
      </template>
    </tbody>
  </table>
</template>

<script setup>
import NoData from './NoData.vue';
import RowLoading from './RowLoading.vue';
defineOptions({
  name: 'AppTable'
})

defineProps({
  data: {
    type: Array,
    required: true
  },
  fields: {
    type: Array,
    required: true
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})
</script>