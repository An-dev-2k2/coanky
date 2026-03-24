<template>
  <div>
    <div class="flex justify-end">
      <router-link to="/admin/tours/create">
        <Button class="flex items-center gap-1">
          <Plus class="w-4 h-4" />
          Thêm tour
        </Button>
      </router-link>
    </div>
    <Card class="py-0 mt-5">
      <Table :fields="fields" :data="data" :currentPage="pagination.page" :perPage="pagination.limit">
        <template #head-name="{ field }">
          <p class="text-center">{{ field.label }}</p>
        </template>
        <template #head-price="{ field }">
          <p class="text-center">{{ field.label }}</p>
        </template>
        <template #head-percent="{ field }">
          <p class="text-center">{{ field.label }}</p>
        </template>
        <template #name="{ value }">
          <p class="text-center font-bold">{{ value }}</p>
        </template>
        <template #price="{ value }">
          <p class="text-center font-bold text-red-600">{{ formatPrice(value) }} VNĐ</p>
        </template>
        <template #percent="{ value }">
          <p class="text-center font-bold">{{ value }}%</p>
        </template>
        <template #image="{ item }">
          <div class="h-[71px]">
            <div class="relative aspect-video w-32 overflow-hidden h-full rounded-[10px]">
              <img class="size-full object-cover" :src="item.image" alt="Image Preview" />
            </div>
          </div>
        </template>
        <template #createdAt="{ value }">
          <p class="text-blue-500 font-medium">{{ formatDate(value) }}</p>
          <span class="text-xs text-gray-400">{{ formatTimeOnly(value) }}</span>
        </template>
        <template #updatedAt="{ value }">
          <p class="text-blue-500 font-medium">{{ formatDate(value) }}</p>
          <span class="text-xs text-gray-400">{{ formatTimeOnly(value) }}</span>
        </template>
        <template #actions="{ item }">
          <div class="flex items-center gap-2">
            <Button variant="primary" class="!p-2"
              @click="$router.push({ name: 'tours-edit', params: { id: item._id } })">
              <Pen class="w-4 h-4" />
            </Button>
            <Button variant="danger" @click="openDialog('delete', item)" class="!p-2">
              <Trash2 class="w-4 h-4" />
            </Button>
          </div>
        </template>
      </Table>
    </Card>
    <BasePagination :total="pagination.total" :limit="pagination.limit" :currentPage="pagination.page"
      @change="handlePageChange" />
    <component v-model="showModal" :is="currentDialog" :data="selectedDialog" :mode="modeDialog" @close="closeDialog"
      @submit="onDialogSubmit" />
  </div>
</template>

<script setup>
import { Plus, Trash2, Pen } from 'lucide-vue-next';
import Button from '@/components/Button.vue';
import Card from '@/components/Card.vue';
import Table from '@/components/Table.vue';
import BasePagination from '@/components/BasePagination.vue';
import { useFormat } from '@/composables/useFormat';
import { useToast } from 'vue-toastification';
import { onMounted, ref, markRaw, defineAsyncComponent, reactive } from 'vue';
import TourAPI from '@/services/api/admin/TourAPI';

const toast = useToast()
const { formatPrice, formatDate, formatTimeOnly } = useFormat()
const fields = [
  { key: 'index', label: "STT" },
  { key: 'image', label: "Ảnh đại diện" },
  { key: 'title', label: "Tên tour" },
  { key: 'price', label: "Giá" },
  { key: 'percent', label: "% giảm giá" },
  { key: 'createdAt', label: "Ngày tạo" },
  { key: 'updatedAt', label: "Ngày cập nhật" },
  { key: 'actions', label: "Thao tác" },
]

const data = ref([])
const currentDialog = ref(null)
const modeDialog = ref(null)
const selectedDialog = ref(null)
const showModal = ref(false)
const pagination = reactive({
  total: 0,
  page: 1,
  limit: 10
})

const getTours = async () => {
  try {
    const res = await TourAPI.get({
      page: pagination.page,
      limit: pagination.limit
    })
    data.value = res.data
    pagination.total = res.pagination.total
  }
  catch (e) {
    console.log(e)
    toast.error("Lấy danh sách tour thất bại")
  }
}

const handlePageChange = (page) => {
  pagination.page = page
  getTours()
}

const openDialog = (type, props = {}) => {
  if (type === 'delete') {
    modeDialog.value = 'delete'
    selectedDialog.value = {
      _id: props._id,
      name: props.title
    }
    currentDialog.value = markRaw(defineAsyncComponent(() => import('@/components/DialogDelete.vue')))
  }
  showModal.value = true
}
const closeDialog = () => {
  showModal.value = false
  currentDialog.value = null
  modeDialog.value = null
  selectedDialog.value = null
}

const onDialogSubmit = async (d) => {
  if (modeDialog.value === 'delete') {
    await deleteTour(d)
  }
  closeDialog()
}

const deleteTour = async (id) => {
  try {
    await TourAPI.delete(id)
    toast.success("Xóa tour thành công")
    getTours()
  }
  catch (e) {
    console.log(e)
    toast.error("Xóa tour thất bại")
  }
}
onMounted(() => {
  getTours()
})
</script>

<style></style>