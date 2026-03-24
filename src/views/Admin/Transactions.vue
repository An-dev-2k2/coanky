<template>
  <div>
    <Card class="py-0">
      <Table :fields="fields" :data="data" :currentPage="pagination.page" :perPage="pagination.limit">
        <template #head-username="{ field }">
          <p class="text-center">{{ field.label }}</p>
        </template>
        <template #head-status="{ field }">
          <p class="text-center">{{ field.label }}</p>
        </template>
        <template #head-amount="{ field }">
          <p class="text-center">{{ field.label }}</p>
        </template>
        <template #createdAt="{ value }">
          <p class="text-blue-500 font-medium">{{ formatDate(value) }}</p>
          <span class="text-xs text-gray-400">{{ formatTimeOnly(value) }}</span>
        </template>
        <template #status="{ value }">
          <div class="flex justify-center">
            <span class="text-xs py-0.5 px-1 rounded-sm
            " :class="value === 1 ? 'bg-green-100 text-green-900' : 'bg-red-100 text-red-900'">
              {{ value === 1 ? 'Thành công' : 'Thất bại' }}</span>
          </div>
        </template>
        <template #amount="{ value }">
          <p class="text-center font-bold text-red-600">{{ formatPrice(value) }} VNĐ</p>
        </template>
        <template #username="{ value }">
          <p class="text-center font-bold">{{ value }}</p>
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
import AppAPI from '@/services/api/admin/AppAPI';
import { onMounted, reactive, ref } from 'vue';
import { useFormat } from '@/composables/useFormat';

const { formatPrice, formatDate, formatTimeOnly } = useFormat()
const fields = [
  { key: 'index', label: 'STT' },
  { key: 'username', label: 'Khách hàng' },
  { key: 'amount', label: 'Số tiền' },
  { key: 'description', label: 'Nội dung chuyển khoản' },
  { key: 'status', label: 'Trạng thái' },
  { key: 'createdAt', label: "Ngày tạo" },
]

const statusColorMap = {
  'success': 'bg-green-100 text-green-900',
  'in_progress': 'text-blue-600',
  'completed': 'text-green-600',
  'pending': 'bg-blue-100 text-blue-900',
  'cancel': 'bg-red-100 text-red-900'
}

const data = ref([])
const pagination = reactive({
  total: 0,
  page: 1,
  limit: 10
})

const getTransactions = async () => {
  try {
    const res = await AppAPI.getTransactions({
      page: pagination.page,
      limit: pagination.limit
    })
    data.value = res.data
    pagination.total = res.pagination.total
  }
  catch (error) {
    console.log(error)
  }
}

const handlePageChange = (page) => {
  pagination.page = page
  getTransactions()
}

onMounted(() => {
  getTransactions()
})
</script>