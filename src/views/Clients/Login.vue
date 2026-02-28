<template>
  <div class="min-h-screen flex items-center justify-center 
           bg-[url('/images/bg-login1.png')] 
           bg-cover bg-center bg-no-repeat">
    <div class="w-[1024px] relative">
      <router-link to="/">
        <img src="/images/back.png" alt="btn-back" class="absolute z-10 top-10 right-20 w-10 cursor-pointer">
      </router-link>
      <img src="/images/bg-login2.png" class="w-full h-full" alt="">
      <div class=" absolute top-0 left-0 w-full h-full px-10 py-10">
        <div class="flex flex-col justify-center items-center my-auto relative">
          <img src="/images/hoian.png" class="w-[400px]" alt="title login">
          <form @submit.prevent="onSubmit" class="w-[486px] mt-10">
            <FormField name="username" color="text-[var(--color-text)]" label="Tên đăng nhập">
              <Field name="username" as="input" type="text"
                class="px-3 py-2 bg-white text-sm rounded-md outline-none border border-slate-300/70 w-full"
                placeholder="Nhập tên đăng nhập..." />
            </FormField>
            <FormField name="password" color="text-[var(--color-text)]" label="Mật khẩu" class="mt-4">
              <Field name="password" as="input" type="password"
                class="px-3 py-2 bg-white text-sm rounded-md outline-none border border-slate-300/70 w-full"
                placeholder="Nhập mật khẩu..." />
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
                    <span class="text-[var(--color-text)] font-semibold text-sm">Đăng Nhập</span>
                  </template>
                </div>
              </button>
              <router-link to="/register"
                class="text-sm text-[var(--color-text)] relative w-[150px] flex justify-center items-center cursor-pointer hover:brightness-110 transition-all duration-300">
                <img src="/images/btn.png" class="w-full absolute" alt="">
                <span class="text-[var(--color-text)] font-semibold text-sm z-10">Đăng Ký</span>
              </router-link>
            </div>
          </form>
        </div>
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

const isLoading = ref(false)
const schema = toTypedSchema(
  z.object({
    username: z
      .string()
      .trim()
      .nonempty('Tên đăng nhập không được để trống')
      .min(3, 'Tên đăng nhập tối thiểu 3 ký tự'),
    password: z
      .string()
      .trim()
      .nonempty('Mật khẩu không được để trống')
      .min(6, 'Mật khẩu tối thiểu 6 ký tự'),
  })
)

const { handleSubmit } = useForm({
  validationSchema: schema,
  initialValues: {
    username: '',
    password: '',
  },
})

const onSubmit = handleSubmit((values) => {
  isLoading.value = true
  try {
    console.log('Login values:', values)
  }
  catch (error) {
    console.error('Login error:', error)
  }
  finally {
    isLoading.value = false
  }
})

</script>

<style></style>