<template>
  <div>
    <div class="flex justify-end">
      <Button class="flex items-center gap-1" @click="openDialog('create')">
        <Plus class="w-4 h-4" />
        Thêm ấn ký
      </Button>
    </div>
    <Card class="py-0 mt-5">
      <Table :fields="fields" :data="data">
        <template #head-image="{ field }">
          <p class="text-center">{{ field.label }}</p>
        </template>
        <template #head-name="{ field }">
          <p class="text-center">{{ field.label }}</p>
        </template>
        <template #name="{ value }">
          <p class="text-center font-bold">{{ value }}</p>
        </template>
        <template #image="{ item }">
          <div class="flex justify-center">
            <div class="w-10 h-10 relative flex items-center justify-center">
              <img :src="item.image" alt="Image Preview" class="w-full h-full object-contain" />
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
            <Button variant="primary" class="!p-2" @click="openDialog('update', item)">
              <Pen class="w-4 h-4" />
            </Button>
            <Button variant="danger" @click="openDialog('delete', item)" class="!p-2">
              <Trash2 class="w-4 h-4" />
            </Button>
          </div>
        </template>
      </Table>
    </Card>
    <component v-model="showModal" :is="currentDialog" :title="titleDialog" :nameBtn="nameBtnDialog"
      :data="selectedDialog" :mode="modeDialog" @close="closeDialog" @submit="onDialogSubmit" />
  </div>
</template>

<script setup>
import { ref, markRaw, defineAsyncComponent, onMounted } from 'vue'
import { Plus, Upload, Trash2, Pen } from 'lucide-vue-next';
import Button from '@/components/Button.vue';
import Card from '@/components/Card.vue';
import Table from '@/components/Table.vue';
import { useFormat } from '@/composables/useFormat';
import IconAPI from '@/services/api/admin/IconAPI';
import { useToast } from 'vue-toastification';

const toast = useToast()
const { formatDate, formatTimeOnly } = useFormat()

const fields = [
  { key: 'index', label: 'STT' },
  { key: 'name', label: 'Tên icon' },
  { key: 'image', label: 'Hình ảnh' },
  { key: 'createdAt', label: "Ngày tạo" },
  { key: 'updatedAt', label: "Ngày cập nhật" },
  { key: 'actions', label: "Thao tác" },
]
const currentDialog = ref(null)
const modeDialog = ref(null)
const selectedDialog = ref(null)
const data = ref([])
const titleDialog = ref('')
const nameBtnDialog = ref('')

const showModal = ref(false)

const openDialog = (type, props = {}) => {
  if (type === 'create') {
    selectedDialog.value = {
      name: '',
      image: null,
    }
    modeDialog.value = 'create'
    titleDialog.value = 'Thêm ấn ký'
    nameBtnDialog.value = 'Thêm'
    currentDialog.value = markRaw(defineAsyncComponent(() => import('@/views/Admin/Icons/IconAddModal.vue')))
  }
  if (type === 'update') {
    selectedDialog.value = props
    modeDialog.value = 'update'
    titleDialog.value = 'Cập nhật ấn ký'
    nameBtnDialog.value = 'Cập nhật'
    currentDialog.value = markRaw(
      defineAsyncComponent(() => import('@/views/Admin/Icons/IconAddModal.vue'))
    )
  }
  if (type === 'delete') {
    selectedDialog.value = props
    modeDialog.value = 'delete'
    currentDialog.value = markRaw(defineAsyncComponent(() => import('@/components/DialogDelete.vue')))
  }
  showModal.value = true
}

const closeDialog = () => {
  showModal.value = false
  currentDialog.value = null
  modeDialog.value = null
  selectedDialog.value = null
  titleDialog.value = ''
  nameBtnDialog.value = ''
}

const onDialogSubmit = async (d) => {
  if (modeDialog.value === 'create') {
    data.value.push(d)
  } else if (modeDialog.value === 'update') {
    const index = data.value.findIndex(i => i._id === d._id)
    if (index !== -1) {
      data.value[index] = d
    }
  } else if (modeDialog.value === 'delete') {
    await deleteIcon(d)
  }
  closeDialog()
}

const deleteIcon = async (id) => {
  try {
    await IconAPI.delete(id)
    toast.success('Xóa ấn ký thành công!')
    data.value = data.value.filter(i => i._id !== id)
  }
  catch (e) {
    console.log(e)
    toast.error("Xóa ấn ký thất bại")
  }
}

const getIcons = async () => {
  try {
    const { data: d } = await IconAPI.get()
    data.value = d
  }
  catch (e) {
    console.log(e)
  }
}

onMounted(() => {
  getIcons()
})
</script>

<style></style>