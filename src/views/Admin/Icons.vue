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
            <Button variant="primary" class="!p-2">
              <Pen class="w-4 h-4" />
            </Button>
            <Button variant="danger" @click="openDialog('delete', item)" class="!p-2">
              <Trash2 class="w-4 h-4" />
            </Button>
          </div>
        </template>
      </Table>
    </Card>
    <!-- <Modal v-model="showModal" title="Thêm icon">
      <form @submit.prevent="onSubmit" class="space-y-4">
        <FormField name="name" label="Tên icon">
          <Field name="name" as="input" type="text"
            class="px-3 py-2 bg-white text-sm rounded-md outline-none border border-slate-300/70 w-full"
            placeholder="Nhập tên icon..." />
        </FormField>

        <FormField name="image" label="Hình ảnh icon">
          <div v-if="previewUrl"
            class="mb-2 w-20 h-20 border border-slate-200 rounded-md overflow-hidden flex items-center justify-center bg-slate-50">
            <img :src="previewUrl" alt="preview" class="w-full h-full object-contain" />
          </div>

          <label
            class="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-md cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
            :class="isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-slate-300 hover:border-blue-400 hover:bg-blue-50'" @dragover.prevent="isDragging = true"
            @dragleave="isDragging = false" @drop.prevent="onDrop">
            <Upload class="w-6 h-6 text-slate-400 mb-1" />
            <span class="text-xs text-slate-400">Kéo thả hoặc <span class="text-blue-500">chọn file</span></span>
            <input type="file" accept="image/*" class="hidden" @change="onFileChange" />
          </label>
          <p v-if="fileError" class="text-xs text-red-500 mt-1">{{ fileError }}</p>
        </FormField>
      </form>

      <template #footer>
        <div class="flex justify-end gap-2">
          <Button variant="outline" type="button" @click="showModal = false">Huỷ</Button>
          <Button type="button" @click="onSubmit">Thêm</Button>
        </div>
      </template>
    </Modal> -->

    <component v-model="showModal" :is="currentDialog" :data="selectedDialog" :mode="modeDialog" @close="closeDialog"
      @submit="onDialogSubmit" />
  </div>
</template>

<script setup>
import { ref, markRaw, defineAsyncComponent } from 'vue'
import { Plus, Upload, Trash2, Pen } from 'lucide-vue-next';
import Button from '@/components/Button.vue';
import Card from '@/components/Card.vue';
import Table from '@/components/Table.vue';
// import Modal from '@/components/Modal.vue';
// import FormField from '@/components/FormField.vue'
// import { useForm, Field } from 'vee-validate'
// import { z } from 'zod'
// import { toTypedSchema } from '@vee-validate/zod'
import { useFormat } from '@/composables/useFormat';

const { formatDate, formatTimeOnly } = useFormat()

const fields = [
  { key: 'index', label: 'STT' },
  { key: 'name', label: 'Tên icon' },
  { key: 'image', label: 'Hình ảnh' },
  { key: 'createdAt', label: "Ngày tạo" },
  { key: 'updatedAt', label: "Ngày cập nhật" },
  { key: 'actions', label: "Thao tác" },
]
// const isDragging = ref(false)
const currentDialog = ref(null)
const modeDialog = ref(null)
const selectedDialog = ref(null)
const data = ref([
  {
    id: 1,
    name: 'Hà Nội',
    image: "https://png.pngtree.com/png-vector/20250825/ourmid/pngtree-d-artistic-view-of-the-temple-literature-in-hanoi-historic-site-png-image_17095636.webp",
    createdAt: '2026-02-22T10:03:58.745+00:00',
    updatedAt: '2026-02-22T10:03:58.745+00:00',
  }
])

// ==================== Modal ====================
const showModal = ref(false)

// ==================== Form ====================
// const schema = toTypedSchema(
//   z.object({
//     name: z
//       .string()
//       .trim()
//       .nonempty('Tên icon không được để trống')
//       .max(100, 'Tên icon tối đa 100 ký tự'),
//   })
// )
// const { handleSubmit } = useForm({
//   validationSchema: schema,
//   initialValues: { name: '' },
// })

// ==================== Image ====================
// const imageFile = ref(null)
// const previewUrl = ref('')
// const fileError = ref('')

// function onFileChange(e) {
//   const file = e.target.files[0]
//   handleFile(file)
// }

// function onDrop(e) {
//   isDragging.value = false
//   const file = e.dataTransfer.files[0]
//   handleFile(file)
// }

// function handleFile(file) {
//   fileError.value = ''
//   if (!file) return
//   if (!file.type.startsWith('image/')) {
//     fileError.value = 'Vui lòng chọn file hình ảnh'
//     return
//   }
//   imageFile.value = file
//   previewUrl.value = URL.createObjectURL(file)
// }

// // ==================== Submit ====================
// const onSubmit = handleSubmit((values) => {
//   if (!imageFile.value) {
//     fileError.value = 'Vui lòng chọn hình ảnh icon'
//     return
//   }

//   const payload = {
//     name: values.name,
//     image: imageFile.value, // gửi lên API dạng FormData
//   }
//   console.log('Submit icon:', payload)

//   // Reset
//   showModal.value = false
//   imageFile.value = null
//   previewUrl.value = ''
// })


const openDialog = (type, props = {}) => {
  if (type === 'create') {
    modeDialog.value = 'create'
    currentDialog.value = markRaw(defineAsyncComponent(() => import('@/views/Admin/Icons/IconAddModal.vue')))
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
}

const onDialogSubmit = async (data) => {
  console.log(data)
}
</script>

<style></style>