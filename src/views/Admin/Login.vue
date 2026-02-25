<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-400 via-cyan-300 to-emerald-300 px-4">
    <div class="w-full max-w-md bg-white/90 backdrop-blur-lg shadow-2xl rounded-3xl p-8">

      <!-- Logo / Title -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800">Cổ Ấn Ký Admin</h1>
        <p class="text-gray-500 mt-2">Khám phá thế giới cùng chúng tôi ✈️</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="onSubmit" class="space-y-5">

        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">
            Email
          </label>
          <Field name="email" type="email" placeholder="admin@gmail.com"
            class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-sky-400 focus:outline-none transition" />
          <ErrorMessage name="email" class="text-red-500 text-sm mt-1" />
        </div>

        <!-- Password -->
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">
            Mật khẩu
          </label>
          <Field name="password" type="password" placeholder="••••••••"
            class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-400 focus:outline-none transition" />
          <ErrorMessage name="password" class="text-red-500 text-sm mt-1" />
        </div>

        <!-- Remember -->
        <div class="flex items-center justify-between text-sm">
          <label class="flex items-center gap-2 text-gray-600">
            <input type="checkbox" class="rounded text-sky-500 focus:ring-sky-400">
            Ghi nhớ đăng nhập
          </label>
          <a href="#" class="text-sky-600 hover:underline">
            Quên mật khẩu?
          </a>
        </div>

        <!-- Button -->
        <button type="submit" :disabled="isLoading"
          :class="isLoading ? ' cursor-no-drop opacity-40' : ' cursor-pointer hover:opacity-90'"
          class="w-full bg-gradient-to-r from-sky-500 to-emerald-500 text-white py-3 rounded-xl font-semibold transition duration-300 shadow-lg">
          <template v-if="isLoading">
            <Loader class="animate-spin w-5 mx-auto" />
          </template>
          <template v-else>
            Đăng nhập
          </template>
        </button>
      </Form>

      <!-- Footer -->
      <p class="text-center text-gray-500 text-xs mt-6">
        © 2026 Travel Booking System
      </p>
    </div>
  </div>
</template>

<script setup>
import { useForm, Field, ErrorMessage } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import AuthAPI from '@/services/api/admin/AuthAPI'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { Loader } from 'lucide-vue-next'

const router = useRouter()
const toast = useToast()
const isLoading = ref(false)
// Schema validation bằng Zod
const schema = toTypedSchema(
  z.object({
    email: z
      .string()
      .min(1, 'Email không được để trống')
      .email('Email không hợp lệ'),
    password: z
      .string()
      .min(6, 'Mật khẩu tối thiểu 6 ký tự'),
  })
)

const { handleSubmit } = useForm({
  validationSchema: schema,
  initialValues: {
    email: '',
    password: '',
  },
})

const onSubmit = handleSubmit(async (values) => {
  if (isLoading.value) return
  isLoading.value = true
  try {
    const { data } = await AuthAPI.login(values)
    sessionStorage.setItem('adminToken', data)
    toast.success('Đăng nhập thành công')
    router.push('/admin/dashboard')

  }
  catch (error) {
    toast.error(error?.message || 'Đăng nhập thất bại')
  }
})
</script>