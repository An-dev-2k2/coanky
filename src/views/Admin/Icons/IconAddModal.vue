<template>
  <Modal :model-value="modelValue" @update:modelValue="emit('update:modelValue', $event)" :title="title">
    <form @submit.prevent="onSubmit" class="space-y-4">
      <FormField name="name" label="Tên icon">
        <Field name="name" as="input" type="text"
          class="px-3 py-2 bg-white text-sm rounded-md outline-none border border-slate-300/70 w-full"
          placeholder="Nhập tên icon..." />
      </FormField>

      <FormField name="image" label="Hình ảnh icon">
        <Field name="image">
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
        </Field>
      </FormField>
    </form>

    <template #footer>
      <div class="flex justify-end gap-2">
        <Button variant="outline" @click="close">Huỷ</Button>
        <Button @click="onSubmit">{{ nameBtn }}</Button>
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
import IconAPI from '@/services/api/admin/IconAPI'
import { useToast } from 'vue-toastification';

const toast = useToast()
const props = defineProps({
  modelValue: Boolean,
  mode: String,
  data: Object,
  title: String,
  nameBtn: String,
})

const emit = defineEmits(['update:modelValue', 'close', 'submit'])

const isDragging = ref(false)
const imageFile = ref(null)
const previewUrl = ref('')

const schema = toTypedSchema(
  z.object({
    name: z.string().trim().nonempty('Tên icon không được để trống'),
    image: z
      .any()
      .refine(file => typeof file === 'string' || file instanceof File, { message: 'Vui lòng chọn ảnh' }),
  })
)

const { handleSubmit, resetForm, setFieldError, setFieldValue } = useForm({
  validationSchema: schema,
  initialValues: {
    name: props.data.name || '',
    image: props.data.image || null,
  },
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
  if (!file) return
  imageFile.value = file
  previewUrl.value = URL.createObjectURL(file)
  setFieldValue('image', file)
}

const onSubmit = handleSubmit(async (values) => {
  const formData = new FormData()
  formData.append('name', values.name)
  if (imageFile.value instanceof File) {
    formData.append('image', imageFile.value)
  }

  if (props.mode === 'create') {
    createIcon(formData)
  } else if (props.mode === 'update') {
    updateIcon(formData)
  }
})

const createIcon = async (formData) => {
  try {
    const { data: d } = await IconAPI.create(formData)
    toast.success('Thêm ấn ký thành công!')
    emit('submit', d)
    resetState()
  }
  catch (e) {
    const errors = e?.errors

    if (errors && Array.isArray(errors)) {
      errors.forEach(err => {
        setFieldError(err.path, err.message)
      })
    }
    console.log(e)
  }
}

const updateIcon = async (formData) => {
  try {
    const { data: d } = await IconAPI.update(props.data._id, formData)
    toast.success('Cập nhật ấn ký thành công!')
    emit('submit', d)
    resetState()
  }
  catch (e) {
    console.log(e)
  }
}

function resetState() {
  imageFile.value = null
  previewUrl.value = ''
  resetForm()
}

watch(
  () => props.data,
  (newVal) => {
    if (!newVal) return

    resetForm({
      values: {
        name: newVal.name || '',
        image: newVal.image || null,
      },
    })

    // Nếu là update và có ảnh URL
    if (typeof newVal.image === 'string') {
      previewUrl.value = newVal.image
      imageFile.value = null
    }
  },
  { immediate: true }
)
</script>