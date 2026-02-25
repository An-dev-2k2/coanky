<template>
  <Modal :model-value="modelValue" @update:modelValue="emit('update:modelValue', $event)" :title="title">
    <form @submit.prevent="onSubmit" class="space-y-4">

      <!-- Name -->
      <FormField name="name" label="Tên audio">
        <Field name="name" as="input" type="text"
          class="px-3 py-2 bg-white text-sm rounded-md outline-none border border-slate-300/70 w-full"
          placeholder="Nhập tên audio..." />
      </FormField>

      <FormField name="image" label="Background audio">
        <!-- <div v-if="imagePreview" class="mb-2 w-20 h-20 border rounded-md overflow-hidden">
          <img :src="imagePreview" class="w-full h-full object-cover" />
        </div>

        <label class="upload-box" @dragover.prevent="isDraggingImage = true" @dragleave="isDraggingImage = false"
          @drop.prevent="onDropImage">
          <Upload class="w-6 h-6 mb-1" />
          <span class="text-xs text-slate-400">
            Kéo thả hoặc <span class="text-blue-500">chọn file</span>
          </span>
          <input type="file" accept="image/*" hidden @change="onImageChange" />
        </label> -->
        <Field name="image">
          <div v-if="imagePreview"
            class="mb-2 w-20 h-20 border border-slate-200 rounded-md overflow-hidden flex items-center justify-center bg-slate-50">
            <img :src="imagePreview" class="w-full h-full object-contain" />
          </div>

          <label
            class="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-md cursor-pointer transition-all"
            :class="isDraggingImage
              ? 'border-blue-500 bg-blue-50'
              : 'border-slate-300 hover:border-blue-400 hover:bg-blue-50'" @dragover.prevent="isDraggingImage = true"
            @dragleave="isDraggingImage = false" @drop.prevent="onDropImage">
            <Upload class="w-6 h-6 mb-1" :class="isDraggingImage ? 'text-blue-500' : 'text-slate-400'" />
            <span class="text-xs text-slate-400">
              Kéo thả hoặc <span class="text-blue-500">chọn file</span>
            </span>
            <input type="file" accept="image/*" class="hidden" @change="onImageChange" />
          </label>
        </Field>
      </FormField>

      <!-- Audio Upload -->
      <FormField name="audio" label="Audio">
        <Field name="audio">
          <div v-if="audioPreview" class="mb-3">
            <audio controls :src="audioPreview" class="w-full" />
          </div>

          <label
            class="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-md cursor-pointer transition-all"
            :class="isDraggingAudio
              ? 'border-blue-500 bg-blue-50'
              : 'border-slate-300 hover:border-blue-400 hover:bg-blue-50'" @dragover.prevent="isDraggingAudio = true"
            @dragleave="isDraggingAudio = false" @drop.prevent="onDropAudio">
            <Upload class="w-6 h-6 mb-1" :class="isDraggingAudio ? 'text-blue-500' : 'text-slate-400'" />
            <span class="text-xs text-slate-400">
              Kéo thả hoặc <span class="text-blue-500">chọn file</span>
            </span>
            <input type="file" accept="audio/*" class="hidden" @change="onAudioChange" />
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
import AudioAPI from '@/services/api/admin/AudioAPI'
import { useToast } from 'vue-toastification'

const toast = useToast()

const props = defineProps({
  modelValue: Boolean,
  mode: String,
  data: Object,
  title: String,
  nameBtn: String,
})

const emit = defineEmits(['update:modelValue', 'submit'])

const isDraggingAudio = ref(false)
const audioFile = ref(null)
const audioPreview = ref('')

const isDraggingImage = ref(false)
const imageFile = ref(null)
const imagePreview = ref('')

const schema = toTypedSchema(
  z.object({
    name: z.string().trim().nonempty('Tên audio không được để trống'),
    audio: z
      .any()
      .refine(file => typeof file === 'string' || file instanceof File, {
        message: 'Vui lòng chọn file audio',
      }),
    image: z
      .any()
      .refine(file => typeof file === 'string' || file instanceof File, { message: 'Vui lòng chọn ảnh' }),
  })
)

const { handleSubmit, resetForm, setFieldValue } = useForm({
  validationSchema: schema,
  initialValues: {
    name: props.data?.name || '',
    audio: props.data?.audio || null,
    image: props.data?.image || null,
  },
})

function close() {
  emit('update:modelValue', false)
}

function handleImage(file) {
  if (!file) return
  imageFile.value = file
  imagePreview.value = URL.createObjectURL(file)
  setFieldValue('image', file)
}

function handleAudio(file) {
  if (!file) return
  audioFile.value = file
  audioPreview.value = URL.createObjectURL(file)
  setFieldValue('audio', file)
}

function onImageChange(e) {
  handleImage(e.target.files[0])
}

function onAudioChange(e) {
  handleAudio(e.target.files[0])
}

function onDropImage(e) {
  isDraggingImage.value = false
  handleImage(e.dataTransfer.files[0])
}

function onDropAudio(e) {
  isDraggingAudio.value = false
  handleAudio(e.dataTransfer.files[0])
}

const onSubmit = handleSubmit(async (values) => {
  const formData = new FormData()
  formData.append('name', values.name)

  if (imageFile.value) formData.append('image', imageFile.value)
  if (audioFile.value instanceof File) {
    formData.append('audio', audioFile.value)
  }

  if (props.mode === 'create') {
    createAudio(formData)
  } else if (props.mode === 'update') {
    updateAudio(formData)
  }
})

async function createAudio(formData) {
  try {
    const { data } = await AudioAPI.create(formData)
    toast.success('Thêm audio thành công!')
    emit('submit', data)
    resetState()
  } catch (e) {
    console.log(e)
  }
}

async function updateAudio(formData) {
  try {
    const { data } = await AudioAPI.update(props.data._id, formData)
    toast.success('Cập nhật audio thành công!')
    emit('submit', data)
    resetState()
  } catch (e) {
    console.log(e)
  }
}

function resetState() {
  audioFile.value = null
  imageFile.value = null
  audioPreview.value = ''
  imagePreview.value = ''
  resetForm()
}

watch(
  () => props.data,
  (newVal) => {
    if (!newVal) return

    resetForm({
      values: {
        name: newVal.name || '',
        audio: newVal.audio || null,
        image: newVal.image || null,
      },
    })

    if (typeof newVal.audio === 'string') {
      audioPreview.value = newVal.audio
    }

    if (typeof newVal.image === 'string') {
      imagePreview.value = newVal.image
    }
  },
  { immediate: true }
)
</script>