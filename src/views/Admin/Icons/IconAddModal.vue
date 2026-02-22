<template>
  <Modal :model-value="modelValue" @update:modelValue="emit('update:modelValue', $event)" title="Thêm icon">
    <form @submit.prevent="onSubmit" class="space-y-4">
      <FormField name="name" label="Tên icon">
        <Field name="name" as="input" type="text"
          class="px-3 py-2 bg-white text-sm rounded-md outline-none border border-slate-300/70 w-full"
          placeholder="Nhập tên icon..." />
      </FormField>

      <FormField name="image" label="Hình ảnh icon">
        <div v-if="previewUrl"
          class="mb-2 w-20 h-20 border border-slate-200 rounded-md overflow-hidden flex items-center justify-center bg-slate-50">
          <img :src="previewUrl" class="w-full h-full object-contain" />
        </div>

        <label
          class="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-md cursor-pointer transition-all"
          :class="isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-slate-300 hover:border-blue-400 hover:bg-blue-50'" @dragover.prevent="isDragging = true"
          @dragleave="isDragging = false" @drop.prevent="onDrop">
          <Upload class="w-6 h-6 mb-1" :class="isDragging ? 'text-blue-500' : 'text-slate-400'" />
          <span class="text-xs text-slate-400">
            Kéo thả hoặc <span class="text-blue-500">chọn file</span>
          </span>
          <input type="file" accept="image/*" class="hidden" @change="onFileChange" />
        </label>

        <p v-if="fileError" class="text-xs text-red-500 mt-1">
          {{ fileError }}
        </p>
      </FormField>
    </form>

    <template #footer>
      <div class="flex justify-end gap-2">
        <Button variant="outline" @click="close">Huỷ</Button>
        <Button @click="onSubmit">Thêm</Button>
      </div>
    </template>
  </Modal>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Upload } from 'lucide-vue-next'
import Modal from '@/components/Modal.vue'
import Button from '@/components/Button.vue'
import FormField from '@/components/FormField.vue'
import { useForm, Field } from 'vee-validate'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'

const props = defineProps({
  modelValue: Boolean,
  mode: String,
  data: Object
})

const emit = defineEmits(['update:modelValue', 'close', 'submit'])

const isDragging = ref(false)
const imageFile = ref(null)
const previewUrl = ref('')
const fileError = ref('')

const schema = toTypedSchema(
  z.object({
    name: z.string().trim().nonempty('Tên icon không được để trống')
  })
)

const { handleSubmit, resetForm } = useForm({
  validationSchema: schema,
  initialValues: {
    name: ''
  }
})

function close() {
  emit('update:modelValue', false)
}

function onFileChange(e) {
  handleFile(e.target.files[0])
}

function onDrop(e) {
  isDragging.value = false
  handleFile(e.dataTransfer.files[0])
}

function handleFile(file) {
  fileError.value = ''
  if (!file) return
  if (!file.type.startsWith('image/')) {
    fileError.value = 'Vui lòng chọn file hình ảnh'
    return
  }
  imageFile.value = file
  previewUrl.value = URL.createObjectURL(file)
}

const onSubmit = handleSubmit(async (values) => {
  if (!imageFile.value) {
    fileError.value = 'Vui lòng chọn hình ảnh icon'
    return
  }

  const formData = new FormData()
  formData.append('name', values.name)
  formData.append('image', imageFile.value)

  emit('submit', formData)
  close()
  resetState()
})

function resetState() {
  imageFile.value = null
  previewUrl.value = ''
  fileError.value = ''
  resetForm()
}

watch(() => props.modelValue, (val) => {
  if (!val) resetState()
})
</script>