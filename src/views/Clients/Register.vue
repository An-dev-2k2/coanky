<template>
  <div class="min-h-screen flex items-center justify-center 
           bg-[url('/images/bg-login1.png')] 
           bg-cover bg-center bg-no-repeat">
    <div class="w-[1024px] relative">
      <router-link to="/">
        <img src="/images/back.png" alt="btn-back" class="absolute z-10 top-10 right-20 w-10 cursor-pointer">
      </router-link>
      <img src="/images/bg-login2.png" class="w-full h-full" alt="">
      <div class=" absolute top-0 left-0 w-full px-32 py-20 grid grid-cols-2">
        <div class="flex justify-center items-center">
          <img src="/images/lapdanh.png" class="w-[300px]" alt="">
        </div>
        <form @submit.prevent="onSubmit">
          <FormField name="username" color="text-[var(--color-text)]" label="Danh xưng (Tên người dùng)">
            <Field name="username" as="input" type="text"
              class="px-3 py-2 bg-white text-sm rounded-md outline-none border border-slate-300/70 w-full"
              placeholder="Nhập tên người dùng..." />
          </FormField>
          <FormField name="email" color="text-[var(--color-text)]" label="Email">
            <Field name="email" as="input" type="text"
              class="px-3 py-2 bg-white text-sm rounded-md outline-none border border-slate-300/70 w-full"
              placeholder="Nhập email..." />
          </FormField>
          <FormField name="password" color="text-[var(--color-text)]" label="Mật khẩu" class="mt-4">
            <Field name="password" as="input" type="password"
              class="px-3 py-2 bg-white text-sm rounded-md outline-none border border-slate-300/70 w-full"
              placeholder="Nhập mật khẩu..." />
          </FormField>
          <FormField name="confirmPassword" color="text-[var(--color-text)]" label="Xác nhận mật khẩu" class="mt-4">
            <Field name="confirmPassword" as="input" type="password"
              class="px-3 py-2 bg-white text-sm rounded-md outline-none border border-slate-300/70 w-full"
              placeholder="Nhập lại mật khẩu..." />
          </FormField>
          <div class="flex justify-center items-center gap-2 mt-6">
            <button type="submit" :disabled="isLoading"
              class="w-[150px] relative flex justify-center items-center cursor-pointer hover:brightness-110 transition-all duration-300">
              <img src="/images/btn.png" class="w-full absolute" alt="">
              <div class="relative z-10">
                <template v-if="isLoading">
                  <Loader class="animate-spin w-5 mx-auto" />
                </template>
                <template v-else>
                  <span class="text-[var(--color-text)] font-semibold text-sm">Đăng Ký</span>
                </template>
              </div>
            </button>
            <router-link to="/login"
              class="text-sm text-[var(--color-text)] relative w-[150px] flex justify-center items-center cursor-pointer hover:brightness-110 transition-all duration-300">
              <img src="/images/btn.png" class="w-full absolute" alt="">
              <span class="text-[var(--color-text)] font-semibold text-sm z-10">Đăng Nhập</span>
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import FormField from '@/components/FormField.vue';
import { useForm, Field } from 'vee-validate'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { ref } from 'vue';
import { Loader } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import AuthAPI from '@/services/api/client/AuthAPI';

const toast = useToast()
const router = useRouter()
const isLoading = ref(false)

/* =========================
   Schema validate với Zod
========================= */
const registerSchema = toTypedSchema(
  z.object({
    username: z
      .string()
      .trim()
      .nonempty('Tên người dùng không được để trống')
      .min(3, 'Tên người dùng phải ít nhất 3 ký tự'),
    email: z
      .string()
      .min(1, 'Email không được để trống')
      .email('Email không hợp lệ'),
    password: z
      .string()
      .trim()
      .nonempty('Mật khẩu không được để trống')
      .min(6, 'Mật khẩu phải ít nhất 6 ký tự'),
    confirmPassword: z.string()
  }).refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword']
  })
)

/* =========================
   useForm
========================= */
const { handleSubmit } = useForm({
  validationSchema: registerSchema,
  initialValues: {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  },
})

/* =========================
   Submit
========================= */
const onSubmit = handleSubmit(async (values) => {
  try {
    isLoading.value = true
    const { data } = await AuthAPI.register({
      username: values.username,
      email: values.email,
      password: values.password,
    })
    toast.success('Đăng ký thành công! Vui lòng đăng nhập.')
    router.push('/login')
  } catch (error) {
    console.error('Đăng ký thất bại:', error)
    toast.error(error?.message || 'Đăng ký thất bại. Vui lòng thử lại.')
  } finally {
    isLoading.value = false
  }
})
</script>

<style></style>