<template>
  <div>
    <div class="flex justify-end">
      <Button class="flex items-center gap-1" @click="openDialog('create')">
        <Plus class="w-4 h-4" />
        Thêm audio
      </Button>
    </div>
    <Card class="py-0 mt-5">
      <Table :fields="fields" :data="data">
        <template #head-name="{ field }">
          <p class="text-center">{{ field.label }}</p>
        </template>
        <template #name="{ value }">
          <p class="text-center font-bold">{{ value }}</p>
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
      :data="selectedDialog" :mode="modeDialog" @submit="onDialogSubmit" />
  </div>
</template>

<script setup>
import Card from '@/components/Card.vue';
import Table from '@/components/Table.vue';
import Button from '@/components/Button.vue';
import { Plus, Pen, Trash2 } from 'lucide-vue-next';
import { useFormat } from '@/composables/useFormat';
import { ref, markRaw, defineAsyncComponent, onMounted } from 'vue'
import AudioAPI from '@/services/api/admin/AudioAPI';
import { useToast } from 'vue-toastification';

const toast = useToast()
const { formatDate, formatTimeOnly } = useFormat()

const fields = [
  { key: 'index', label: 'STT' },
  { key: 'name', label: 'Tên audio' },
  { key: 'image', label: 'Background audio' },
  { key: 'createdAt', label: 'Ngày tạo' },
  { key: 'updatedAt', label: 'Ngày cập nhật' },
  { key: 'actions', label: 'Thao tác' },
]
const data = ref([])

const currentDialog = ref(null)
const showModal = ref(false)
const modeDialog = ref(null)
const selectedDialog = ref(null)
const titleDialog = ref('')
const nameBtnDialog = ref('')

const openDialog = (type, props = {}) => {
  if (type === 'create') {
    selectedDialog.value = { name: '', audio: null }
    modeDialog.value = 'create'
    titleDialog.value = 'Thêm audio'
    nameBtnDialog.value = 'Thêm'
    currentDialog.value = markRaw(
      defineAsyncComponent(() =>
        import('@/views/Admin/Audios/AudioFormModal.vue')
      )
    )
  } else if (type === 'update') {
    selectedDialog.value = props
    modeDialog.value = 'update'
    titleDialog.value = 'Cập nhật audio'
    nameBtnDialog.value = 'Cập nhật'
    currentDialog.value = markRaw(
      defineAsyncComponent(() =>
        import('@/views/Admin/Audios/AudioFormModal.vue')
      )
    )
  } else if (type === 'delete') {
    selectedDialog.value = props
    modeDialog.value = 'delete'
    titleDialog.value = 'Xóa audio'
    nameBtnDialog.value = 'Xóa'
    currentDialog.value = markRaw(
      defineAsyncComponent(() =>
        import('@/components/DialogDelete.vue')
      )
    )
  }
  showModal.value = true
}

const onDialogSubmit = async (d) => {
  if (modeDialog.value === 'create') {
    data.value.push(d)
  } else if (modeDialog.value === 'update') {
    const index = data.value.findIndex(item => item.id === d.id)
    if (index !== -1) {
      data.value[index] = d
    }
  } else if (modeDialog.value === 'delete') {
    await deleteAudio(d)
  }
  closeDialog()
}

const deleteAudio = async (id) => {
  try {
    await AudioAPI.delete(id)
    data.value = data.value.filter(i => i._id !== id)
    toast.success('Xóa audio thành công!')
  } catch (e) {
    console.log(e)
  }
}

const closeDialog = () => {
  showModal.value = false
  currentDialog.value = null
  modeDialog.value = null
  selectedDialog.value = null
  titleDialog.value = ''
  nameBtnDialog.value = ''
  console.log(showModal.value)
}

const getAudios = async () => {
  try {
    const { data: d } = await AudioAPI.get()
    data.value = d
  }
  catch (e) {
    console.log(e)
  }
}

onMounted(() => {
  getAudios()
})
</script>

<style></style>