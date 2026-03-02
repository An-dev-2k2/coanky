<template>
  <div>
    <h4 class="text-base font-semibold uppercase">{{ isEditMode ? 'Cập nhật tour' : 'Thêm tour' }}</h4>
    <div class="mt-5">
      <form @submit.prevent="onSubmit" class="space-y-5">
        <div class="grid grid-cols-12 gap-6">
          <FormField name="title" class="col-span-3" label="Tên tour">
            <Field name="title" as="input" type="text" id="title"
              class="px-3 py-2 bg-white text-sm rounded-md outline-none border border-slate-300/70 placeholder:text-sm w-full"
              placeholder="Nhập tên tour..." />
          </FormField>
          <FormField name="price" class="col-span-3" label="Giá">
            <Field name="price" as="input" type="number" id="price"
              class="px-3 py-2 bg-white text-sm rounded-md outline-none border border-slate-300/70 placeholder:text-sm w-full"
              placeholder="Nhập giá..." />
          </FormField>
          <FormField name="percent" class="col-span-3" label="% giảm giá">
            <Field name="percent" as="input" type="number" id="percent"
              class="px-3 py-2 bg-white text-sm rounded-md outline-none border border-slate-300/70 placeholder:text-sm w-full"
              placeholder="Nhập % giảm giá..." />
          </FormField>
          <FormField name="audio" class="col-span-3" label="Audio">
            <Field name="audio" v-slot="{ value, handleChange }">
              <Select :modelValue="value" @update:modelValue="handleChange" :options="audioOptions"
                placeholder="Chọn audio" />
            </Field>
          </FormField>
          <FormField name="days" class="col-span-3" label="Số ngày">
            <Field name="days" as="input" type="number"
              class="px-3 py-2 bg-white text-sm rounded-md outline-none border border-slate-300/70 w-full"
              placeholder="Nhập số ngày..." />
          </FormField>

          <FormField name="nights" class="col-span-3" label="Số đêm">
            <Field name="nights" as="input" type="number"
              class="px-3 py-2 bg-white text-sm rounded-md outline-none border border-slate-300/70 w-full"
              placeholder="Nhập số đêm..." />
          </FormField>
          <FormField name="role" class="col-span-3" label="Vai trò">
            <Field name="role" as="input" type="text" id="role"
              class="px-3 py-2 bg-white text-sm rounded-md outline-none border border-slate-300/70 placeholder:text-sm w-full"
              placeholder="Nhập vai trò..." />
          </FormField>
          <FormField name="master" class="col-span-3" label="Master Seal">
            <Field name="master" as="input" type="text" id="master"
              class="px-3 py-2 bg-white text-sm rounded-md outline-none border border-slate-300/70 placeholder:text-sm w-full"
              placeholder="Nhập master seal..." />
          </FormField>
          <FormField name="description" class="col-span-12" label="Mô tả">
            <Field name="description" as="textarea" id="description" rows="4"
              class="px-3 py-2 bg-white text-sm rounded-md outline-none border border-slate-300/70 placeholder:text-sm w-full"
              placeholder="Nhập mô tả..." />
          </FormField>
        </div>
        <FormField name="image" label="Ảnh đại diện">
          <Field name="image" v-slot="{ field }">
            <input type="file" @change="(e) => onSingleFileChange(e, field)" accept="image/*" id="image"
              class="hidden" />

            <div class="flex items-start gap-4">
              <!-- Preview box -->
              <div class="border border-slate-200 rounded-lg p-1.5 bg-slate-50 shrink-0">
                <label for="image" class="cursor-pointer block">
                  <div
                    class="relative w-48 aspect-video rounded-md overflow-hidden bg-slate-100 flex items-center justify-center group">
                    <img v-if="singleImage" :src="singleImage" alt="Preview"
                      class="w-full h-full object-cover rounded-md" />
                    <div v-else class="flex flex-col items-center text-slate-400">
                      <ImageIcon class="w-8 h-8 mb-1" />
                      <span class="text-xs">Chưa có ảnh</span>
                    </div>

                    <!-- Overlay khi hover -->
                    <div
                      class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
                      <span class="text-white text-xs font-medium">Thay ảnh</span>
                    </div>
                  </div>
                </label>
              </div>

              <!-- Thông tin + actions -->
              <div class="flex flex-col justify-between h-full gap-2 pt-1">
                <div class="space-y-1">
                  <p class="text-xs text-slate-500">
                    <span class="font-medium">Định dạng hỗ trợ:</span> JPG, PNG, WEBP
                  </p>
                  <p class="text-xs text-slate-500">
                    <span class="font-medium">Tên file:</span>
                    {{ singleImageFile ? singleImageFile.name : 'Chưa chọn file' }}
                  </p>
                  <p v-if="singleImageFile" class="text-xs text-slate-500">
                    <span class="font-medium">Kích thước:</span>
                    {{ (singleImageFile.size / 1024).toFixed(1) }} KB
                  </p>
                </div>

                <div class="flex items-center gap-2">
                  <label for="image"
                    class="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                    <Upload class="w-3.5 h-3.5" />
                    {{ singleImageFile ? 'Thay ảnh' : 'Chọn ảnh' }}
                  </label>

                  <button v-if="singleImageFile" type="button" @click="removeSingleImage"
                    class="inline-flex items-center cursor-pointer gap-1.5 px-3 py-1.5 text-xs border border-red-200 text-red-500 rounded-md hover:bg-red-50 transition-colors">
                    <Trash2 class="w-3.5 h-3.5" />
                    Xoá
                  </button>
                </div>

                <p v-if="singleImageError" class="text-xs text-red-500">{{ singleImageError }}</p>
              </div>
            </div>
          </Field>
        </FormField>
        <FormField name="content" label="Nội dung bài viết" class="col-span-12">
          <Ckeditor :editor="editor" :config="editorConfig" v-model="content" />
        </FormField>

        <!-- Danh sách điểm đến -->
        <div>
          <div class="flex items-center justify-between mb-1">
            <label class="text-sm font-semibold">Danh sách điểm đến</label>
            <button type="button" @click="addDiaDiem"
              class="text-xs px-3 py-1.5 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600">
              + Thêm điểm đến
            </button>
          </div>

          <div class="space-y-3">
            <div v-for="(item, index) in diadiem" :key="index"
              class="border border-slate-200 rounded-md p-4 bg-slate-50 relative">
              <button type="button" @click="removeDiaDiem(index)"
                class="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs">
                ✕ Xoá
              </button>

              <div class="grid grid-cols-3 gap-3">
                <!-- Tên địa điểm -->
                <div>
                  <label class="block text-xs font-medium text-slate-600 mb-1">Tên địa điểm</label>
                  <input v-model="item.name" type="text"
                    class="px-3 py-2 bg-white text-sm rounded-md outline-none border border-slate-300/70 w-full"
                    placeholder="Nhập tên địa điểm..." />
                </div>

                <!-- Chọn vị trí trên map -->
                <div>
                  <label class="block text-xs font-medium text-slate-600 mb-1">Vị trí trên bản đồ</label>
                  <button type="button" @click="openMapModal(index)"
                    class="w-full px-3 py-2 text-sm rounded-md border border-slate-300/70 bg-white text-left hover:border-blue-400 transition-colors">
                    <span v-if="item.lon && item.lat" class="text-green-600 text-xs">
                      📍 {{ item.lon.toFixed(5) }}, {{ item.lat.toFixed(5) }}
                    </span>
                    <span v-else class="text-slate-400">Chọn vị trí...</span>
                  </button>
                </div>

                <!-- Icon -->
                <div>
                  <label class="block text-xs font-medium text-slate-600 mb-1">Icon</label>
                  <div class="flex items-center gap-2">
                    <!-- <select v-model="item.icon"
                      class="px-3 py-2 bg-white text-sm rounded-md outline-none border border-slate-300/70 w-full">
                      <option value="">-- Chọn icon --</option>
                      <option v-for="icon in iconList" :key="icon._id" :value="icon._id">
                        {{ icon.name }}
                      </option>
                    </select> -->
                    <Select v-model="item.icon" :options="iconOptions" placeholder="Chọn icon" class="w-full" />
                    <img v-if="getIconById(item.icon)" :src="getIconById(item.icon).image"
                      class="w-9 h-9 object-contain border border-slate-300 rounded" alt="icon preview" />
                  </div>
                </div>
              </div>
            </div>

            <div v-if="diadiem.length === 0"
              class="text-center text-sm text-slate-400 py-6 border border-dashed border-slate-300 rounded-md">
              Chưa có điểm đến nào. Nhấn "+ Thêm điểm đến" để bắt đầu.
            </div>
          </div>
        </div>

        <div class="flex justify-end">
          <Button type="submit">{{ isEditMode ? 'Cập nhật' : 'Thêm' }}</Button>
        </div>
      </form>
    </div>

    <!-- Modal Map -->
    <Teleport to="body">
      <div v-if="mapModal.visible" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div class="bg-white rounded-xl shadow-2xl w-[700px] max-w-[95vw]">
          <div class="flex items-center justify-between px-5 py-4 border-b border-slate-200">
            <h5 class="font-semibold text-base">Chọn vị trí trên bản đồ</h5>
            <button type="button" @click="closeMapModal"
              class="text-slate-400 hover:text-slate-600 text-xl leading-none">✕</button>
          </div>

          <div class="p-4">
            <!-- Search input -->
            <div class="flex gap-2 mb-3">
              <input v-model="mapModal.searchQuery" type="text"
                class="flex-1 px-3 py-2 text-sm rounded-md border border-slate-300/70 outline-none"
                placeholder="Tìm kiếm địa điểm..." @keydown.enter.prevent="searchLocation" />
              <button type="button" @click="searchLocation" :disabled="isSearching"
                class="px-4 py-2 bg-blue-500 cursor-pointer text-white text-sm rounded-md hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-1.5 min-w-[60px] justify-center">
                <svg v-if="isSearching" class="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                <span>{{ isSearching ? 'Đang tìm...' : 'Tìm' }}</span>
              </button>
            </div>

            <!-- Map container -->
            <div ref="mapContainer" class="w-full h-[380px] rounded-md overflow-hidden border border-slate-200"></div>

            <p class="text-xs text-slate-400 mt-2">Nhấp vào bản đồ để chọn vị trí</p>
          </div>

          <div class="flex items-center justify-between px-5 py-4 border-t border-slate-200">
            <div class="text-sm text-slate-600">
              <span v-if="mapModal.selected">
                📍 Đã chọn: <span class="font-medium">{{ mapModal.selected.displayName }}</span>
                <span class="text-slate-400 ml-1 text-xs">({{ mapModal.selected.lon.toFixed(5) }}, {{
                  mapModal.selected.lat.toFixed(5) }})</span>
              </span>
              <span v-else class="text-slate-400">Chưa chọn vị trí</span>
            </div>
            <div class="flex gap-2">
              <button type="button" @click="closeMapModal"
                class="px-4 py-2 text-sm border border-slate-300 rounded-md hover:bg-slate-50">Huỷ</button>
              <button type="button" @click="confirmLocation" :disabled="!mapModal.selected"
                class="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed">
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick, onBeforeUnmount, onMounted, computed } from 'vue'
import FormField from '@/components/FormField.vue'
import Button from '@/components/Button.vue'
import Select from '@/components/Select.vue'
import { useForm, Field } from 'vee-validate'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { Ckeditor } from '@ckeditor/ckeditor5-vue'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Upload, Trash2, Image as ImageIcon } from 'lucide-vue-next'
import AudioAPI from '@/services/api/admin/AudioAPI'
import IconAPI from '@/services/api/admin/IconAPI'
import TourAPI from '@/services/api/admin/TourAPI'
import { useToast } from 'vue-toastification'
import { useRouter, useRoute } from 'vue-router'

const toast = useToast()
const router = useRouter()
const route = useRoute()
const isEditMode = computed(() => !!route.params.id)
// ==================== CKEditor ====================
const editor = ClassicEditor
const editorConfig = {
  licenseKey: 'GPL',
  extraPlugins: [MyCustomUploadAdapterPlugin],
  heading: {
    options: [
      { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
      { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
      { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
    ],
  },
}
const content = ref('')
const audioList = ref([])
const selectedAudio = ref('')

const audioOptions = computed(() => {
  return audioList.value.map(item => ({
    name: item.name,
    value: item._id
  }))
})
// ==================== Ảnh đại diện ====================
const singleImage = ref('') // ảnh mặc định
const singleImageFile = ref(null)
const singleImageError = ref('')

function onSingleFileChange(e, field) {
  const file = e.target.files[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    singleImageError.value = 'Vui lòng chọn file hình ảnh'
    return
  }

  if (singleImage.value) {
    URL.revokeObjectURL(singleImage.value)
  }


  singleImageError.value = ''
  singleImageFile.value = file
  singleImage.value = URL.createObjectURL(file)
  field.onChange(file)
}

function removeSingleImage() {
  singleImage.value = ''
  singleImageFile.value = null
  singleImageError.value = ''
  // Reset input file
  const input = document.getElementById('image')
  if (input) input.value = ''
}
// ==================== Vee-validate ====================
const schema = toTypedSchema(
  z.object({
    title: z.string().trim().nonempty('Tên tour không được để trống').max(100, 'Tên tour tối đa 100 ký tự'),
    price: z.preprocess(
      (val) => {
        if (val === '' || val === null || val === undefined) {
          return undefined // để trigger required_error
        }

        // Nếu không phải số hợp lệ
        if (isNaN(Number(val))) {
          return NaN
        }

        return Number(val)
      },
      z
        .number({
          required_error: 'Giá không được để trống',
          invalid_type_error: 'Giá không đúng định dạng',
        })
        .min(1, 'Giá tour phải lớn hơn 0')
    ),

    percent: z.preprocess(
      (val) => {
        if (val === '' || val === null || val === undefined) {
          return undefined
        }

        if (isNaN(Number(val))) {
          return NaN
        }

        return Number(val)
      },
      z
        .number({
          invalid_type_error: '% giảm giá không đúng định dạng',
        })
        .min(0, '% giảm giá phải >= 0')
        .max(100, '% giảm giá không được vượt quá 100')
        .optional()
    ),
    audio: z.string().trim().nonempty('Vui lòng chọn audio'),
    role: z.string().trim().nonempty('Vai trò không được để trống'),
    master: z.string().trim().nonempty('Master Seal không được để trống'),
    description: z.string().trim().nonempty('Mô tả không được để trống').max(500, 'Mô tả tối đa 500 ký tự'),
    image: z
      .any()
      .refine(file => typeof file === 'string' || file instanceof File, { message: 'Vui lòng chọn ảnh' }),
    days: z.preprocess(
      val => Number(val),
      z.number({
        required_error: 'Số ngày không được để trống',
        invalid_type_error: 'Số ngày không hợp lệ'
      }).min(1, 'Số ngày phải >= 1')
    ),

    nights: z.preprocess(
      val => Number(val),
      z.number({
        required_error: 'Số đêm không được để trống',
        invalid_type_error: 'Số đêm không hợp lệ'
      }).min(0, 'Số đêm phải >= 0')
    ),
  })
)
const { handleSubmit, resetForm, setValues } = useForm({
  validationSchema: schema,
  initialValues: { title: '', price: '', percent: '', audio: '', image: null, description: '', days: '', nights: '', role: '', master: '' },
})

const isSearching = ref(false)
// ==================== Điểm đến ====================
const diadiem = ref([])

function addDiaDiem() {
  diadiem.value.push({ name: '', lon: null, lat: null, icon: '' })
}

function removeDiaDiem(index) {
  diadiem.value.splice(index, 1)
}

// ==================== Icon list (lấy từ API) ====================
// Thay bằng API call thực tế của bạn
const iconList = ref([])
const iconOptions = computed(() => {
  return iconList.value.map(item => ({
    name: item.name,
    value: item._id
  }))
})
function getIconById(id) {
  return iconList.value.find(i => i._id === id) || null
}

// ==================== Map Modal ====================
const mapContainer = ref(null)
const mapModal = reactive({
  visible: false,
  targetIndex: null,
  searchQuery: '',
  selected: null,
})

let mapInstance = null
let markerInstance = null

function openMapModal(index) {
  mapModal.targetIndex = index
  mapModal.searchQuery = ''
  mapModal.selected = null
  mapModal.visible = true

  nextTick(() => {
    initMap()
  })
}

function closeMapModal() {
  destroyMap()
  mapModal.visible = false
  mapModal.selected = null
  mapModal.targetIndex = null
}

function initMap() {
  if (mapInstance) destroyMap()

  mapInstance = L.map(mapContainer.value).setView([16.047, 108.206], 6)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
  }).addTo(mapInstance)

  // Nếu điểm đến đã có vị trí thì zoom đến đó
  const current = diadiem.value[mapModal.targetIndex]
  if (current?.lon && current?.lat) {
    const latlng = [current.lat, current.lon]
    mapInstance.setView(latlng, 13)
    placeMarker(latlng, `${current.lon.toFixed(5)}, ${current.lat.toFixed(5)}`)
    mapModal.selected = { lat: current.lat, lon: current.lon, displayName: current.name || `${current.lat.toFixed(5)}, ${current.lon.toFixed(5)}` }
  }

  // Click trên map để chọn toạ độ
  mapInstance.on('click', async (e) => {
    const { lat, lng } = e.latlng
    placeMarker([lat, lng])

    // Reverse geocode để lấy tên địa điểm
    let displayName = `${lat.toFixed(5)}, ${lng.toFixed(5)}`
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
      const data = await res.json()
      if (data.display_name) displayName = data.display_name.split(',').slice(0, 3).join(', ')
    } catch { }

    mapModal.selected = { lat, lon: lng, displayName }
  })
}

function placeMarker(latlng, label) {
  if (markerInstance) {
    markerInstance.setLatLng(latlng)
  } else {
    markerInstance = L.marker(latlng).addTo(mapInstance)
  }
  if (label) markerInstance.bindPopup(label).openPopup()
}

async function searchLocation() {
  if (!mapModal.searchQuery.trim()) return
  isSearching.value = true
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(mapModal.searchQuery)}&format=json&limit=1`
    )
    const data = await res.json()
    if (data.length > 0) {
      const { lat, lon, display_name } = data[0]
      const latlng = [parseFloat(lat), parseFloat(lon)]
      mapInstance.setView(latlng, 14)
      placeMarker(latlng)
      mapModal.selected = {
        lat: parseFloat(lat),
        lon: parseFloat(lon),
        displayName: display_name.split(',').slice(0, 3).join(', '),
      }
    }
  } catch (e) {
    console.error('Search error:', e)
  } finally {
    isSearching.value = false
  }
}

function confirmLocation() {
  if (!mapModal.selected) return
  const item = diadiem.value[mapModal.targetIndex]
  item.lat = mapModal.selected.lat
  item.lon = mapModal.selected.lon
  // Nếu chưa có tên thì tự điền tên từ geocode
  item.name = mapModal.selected.displayName
  closeMapModal()
}

function destroyMap() {
  if (markerInstance) { markerInstance.remove(); markerInstance = null }
  if (mapInstance) { mapInstance.remove(); mapInstance = null }
}

onBeforeUnmount(() => destroyMap())

// ==================== Submit ====================
const onSubmit = handleSubmit(async (values) => {
  const formData = new FormData()
  formData.append('title', values.title)
  formData.append('price', values.price)
  formData.append('percent', values.percent)
  formData.append('audio', values.audio)
  formData.append('days', values.days)
  formData.append('nights', values.nights)
  formData.append('role', values.role)
  formData.append('master', values.master)
  formData.append('description', values.description)
  formData.append('content', content.value)
  if (singleImageFile.value) {
    formData.append('image', singleImageFile.value)
  }
  formData.append('diadiem', JSON.stringify(diadiem.value.map(item => ({
    name: item.name,
    lon: item.lon,
    lat: item.lat,
    icon: item.icon || null,
  }))))
  try {
    if (isEditMode.value) {
      await TourAPI.update(route.params.id, formData)
      toast.success('Cập nhật tour thành công!')
    } else {
      await TourAPI.create(formData)
      toast.success('Thêm tour thành công!')
    }
    router.push({ name: 'tours-admin' })
  }
  catch (e) {
    console.log(e)
  }
})

// ==================== CKEditor upload ====================
function MyUploadAdapter(loader) { this.loader = loader }
MyUploadAdapter.prototype.upload = function () {
  return this.loader.file.then(file =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve({ default: reader.result })
      reader.onerror = e => reject(e)
      reader.readAsDataURL(file)
    })
  )
}
function MyCustomUploadAdapterPlugin(editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = loader => new MyUploadAdapter(loader)
}

const getAudios = async () => {
  try {
    const { data } = await AudioAPI.get()
    audioList.value = data
  }
  catch (e) {
    console.log(e)
  }
}

const getIcons = async () => {
  try {
    const { data } = await IconAPI.get()
    iconList.value = data
  }
  catch (e) {
    console.log(e)
  }
}

const setFormValues = (tour) => {
  setValues({
    title: tour.title,
    price: tour.price,
    percent: tour.percent,
    audio: tour.audio?._id || tour.audio,
    description: tour.description,
    days: tour.days,
    nights: tour.nights,
    role: tour.role,
    master: tour.master,
    image: tour.image,
  })

  content.value = tour.content

  singleImage.value = tour.image
  singleImageFile.value = null

  diadiem.value = tour.diadiem.map(item => ({
    name: item.name,
    lat: item.lat,
    lon: item.lon,
    icon: item.icon?._id || item.icon
  }))
}

const getTourDetail = async () => {
  try {
    const { data } = await TourAPI.getById(route.params.id)
    setFormValues(data)
  }
  catch (e) {
    console.log(e)
  }
}

onMounted(() => {
  getAudios()
  getIcons()
  if (isEditMode.value) {
    getTourDetail()
  }
})
</script>

<style>
.ck-content h1 {
  font-size: 32px;
}

.ck-content h2 {
  font-size: 24px;
}
</style>