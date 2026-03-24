<template>
  <div>
    <Card class="py-0">
      <Table :fields="fields" :data="dataTable" :currentPage="pagination.page" :perPage="pagination.limit">
        <template #head-title="{ field }">
          <p class="text-center">{{ field.label }}</p>
        </template>
        <template #code="{ value }">
          <p class="font-bold">{{ value }}</p>
        </template>
        <template #title="{ value }">
          <p class="text-center font-bold">{{ value }}</p>
        </template>
        <template #author="{ value }">
          <div class="flex gap-1.5 items-center">
            <div class="w-9 h-9 rounded-md bg-slate-100 overflow-hidden">
              <img :src="value.avatar || `https://ui-avatars.com/api/?background=random&name=${value?.username}`"
                :alt="value.username" class="w-full h-full object-cover" />
            </div>
            <div class="flex flex-col">
              <p class="font-semibold">{{ value.username }}</p>
              <span class="text-xs text-slate-500">{{ value.email }}</span>
            </div>
          </div>
        </template>
        <template #image="{ item }">
          <div class="h-[71px]">
            <div class="relative aspect-video w-32 overflow-hidden h-full rounded-[10px]">
              <img class="size-full object-cover" :src="item.image" alt="Image Preview" />
            </div>
          </div>
        </template>
        <template #head-price="{ field }">
          <p class="text-center">{{ field.label }}</p>
        </template>
        <template #head-percent="{ field }">
          <p class="text-center">{{ field.label }}</p>
        </template>
        <template #head-status="{ field }">
          <p class="text-center">{{ field.label }}</p>
        </template>
        <template #head-tourProcess="{ field }">
          <p class="text-center">{{ field.label }}</p>
        </template>
        <template #price="{ value }">
          <p class="text-center font-bold text-red-600">{{ formatPrice(value) }} VNĐ</p>
        </template>
        <template #percent="{ value }">
          <p class="text-center font-bold">{{ value }}%</p>
        </template>
        <template #status="{ value }">
          <span class="text-xs py-0.5 px-1 rounded-sm
          " :class="statusColorMap[value]">{{ statusMap[value] }}</span>
        </template>
        <template #tourProcess="{ value }">
          <p class="text-center text-xs flex items-center justify-center gap-1" :class="statusColorMap[value.status]">
            <component :is="iconMap[value.status]" class="w-3.5 inline-block" />
            {{ statusProcessMap[value.status] }}
          </p>
        </template>
        <template #createdAt="{ value }">
          <p class="text-blue-500 font-medium">{{ formatDate(value) }}</p>
          <span class="text-xs text-gray-400">{{ formatTimeOnly(value) }}</span>
        </template>
      </Table>
    </Card>
    <BasePagination :total="pagination.total" :limit="pagination.limit" :currentPage="pagination.page"
      @change="handlePageChange" />
  </div>
</template>

<script setup>
import Card from '@/components/Card.vue';
import Table from '@/components/Table.vue';
import BasePagination from '@/components/BasePagination.vue';
import { useFormat } from '@/composables/useFormat';
import OrderAPI from '@/services/api/admin/OrderAPI';
import { onMounted, reactive, ref } from 'vue';
import { Loader, Check } from 'lucide-vue-next';

const statusMap = {
  'success': 'Thành công',
  'pending': 'Chưa xử lý',
  'cancel': 'Đã hủy'
}

const iconMap = {
  'in_progress': Loader,
  'completed': Check
}

const statusColorMap = {
  'success': 'bg-green-100 text-green-900',
  'in_progress': 'text-blue-600',
  'completed': 'text-green-600',
  'pending': 'bg-blue-100 text-blue-900',
  'cancel': 'bg-red-100 text-red-900'
}

const statusProcessMap = {
  'in_progress': 'Đang hoàn thành',
  'completed': 'Đã hoàn thành'
}

const { formatPrice, formatDate, formatTimeOnly } = useFormat()
const fields = [
  { key: 'index', label: "STT" },
  { key: 'author', label: "Khách hàng" },
  { key: 'code', label: "Mã đơn hàng" },
  { key: 'title', label: "Tên tour" },
  { key: 'image', label: "Ảnh đại diện" },
  { key: 'price', label: "Giá" },
  { key: 'percent', label: "% giảm giá" },
  { key: 'status', label: "Trạng thái" },
  { key: 'tourProcess', label: "Tiến trình" },
  { key: 'createdAt', label: "Ngày tạo" },
]

const dataTable = ref([])
const pagination = reactive({
  total: 0,
  page: 1,
  limit: 10
})

const getOrders = async () => {
  try {
    const res = await OrderAPI.get({
      page: pagination.page,
      limit: pagination.limit
    })
    dataTable.value = res.data
    pagination.total = res.pagination.total
  }
  catch (err) {
    console.log(err)
  }
}

const handlePageChange = (page) => {
  pagination.page = page
  getOrders()
}

onMounted(() => {
  getOrders()
})
</script>

<style></style>