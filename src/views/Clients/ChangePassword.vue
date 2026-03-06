<template>
  <div class="font-rowdies min-h-screen flex items-start justify-center relative overflow-hidden"
    style="background-color:#1a120a">

    <img class="h-screen w-full fixed object-cover top-0 left-0" src="/images/bg-tour.png" alt="" />

    <!-- Card -->
    <div class="relative z-10 w-full max-w-md xl:mt-28 mt-24 mb-10 mx-4" style="
        background-image: repeating-linear-gradient(0deg, transparent, transparent 29px, rgba(180,130,60,0.07) 30px),
                          linear-gradient(160deg,#f5e6c8 0%,#ede0c4 40%,#e8d5a8 100%);
        border-radius: 4px;
        padding: 40px 36px;
        box-shadow: 0 0 0 1px rgba(150,100,30,0.4), 0 0 0 3px rgba(100,60,10,0.15),
                    0 20px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.3);
      ">

      <!-- Inner border -->
      <div class="absolute inset-[6px] border border-amber-700/25 rounded-sm pointer-events-none"></div>

      <!-- Title -->
      <div class="flex items-center gap-3 mb-5">
        <img src="/images/hoavan.png" class="w-6" />
        <h2 class="text-lg font-bold tracking-widest text-[#3b1f0a] whitespace-nowrap">Đổi Mật Khẩu</h2>
        <img src="/images/hoavan.png" class="w-6 scale-x-[-1]" />
      </div>

      <div class="flex justify-center mb-6">
        <img src="/images/line.png" class="xl:w-[200px] w-[100px]" alt="line" />
      </div>

      <!-- Form -->
      <form @submit="onSubmit" class="flex flex-col gap-5">

        <!-- Old password -->
        <Field name="oldPassword" v-slot="{ field, errorMessage }">
          <div class="flex flex-col gap-1">
            <label class="text-[11px] font-bold tracking-[0.08em] uppercase text-[#6b3f10]">
              🔒 Mật khẩu hiện tại
            </label>
            <div class="relative">
              <input v-bind="field" :type="show.old ? 'text' : 'password'" placeholder="Nhập mật khẩu hiện tại" class="w-full pr-10 pl-3.5 py-2.5 text-sm text-[#3b1f0a]
                       bg-amber-50/50 border rounded-sm outline-none
                       placeholder:text-amber-800/40 placeholder:italic
                       transition-all duration-200 font-rowdies" :class="errorMessage
                        ? 'border-red-500/60 focus:shadow-[0_0_0_3px_rgba(192,57,43,0.1)]'
                        : 'border-amber-700/35 focus:border-amber-600/70 focus:shadow-[0_0_0_3px_rgba(180,120,40,0.1)]'" />
              <button type="button" @click="show.old = !show.old"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-amber-800/50 hover:text-amber-700 transition-colors">
                <Eye v-if="!show.old" class="w-4 h-4" />
                <EyeOff v-else class="w-4 h-4" />
              </button>
            </div>
            <p v-if="errorMessage" class="text-[11px] text-red-600">{{ errorMessage }}</p>
          </div>
        </Field>

        <!-- New password -->
        <Field name="newPassword" v-slot="{ field, errorMessage }">
          <div class="flex flex-col gap-1">
            <label class="text-[11px] font-bold tracking-[0.08em] uppercase text-[#6b3f10]">
              🔑 Mật khẩu mới
            </label>
            <div class="relative">
              <input v-bind="field" :type="show.new ? 'text' : 'password'" placeholder="Tối thiểu 6 ký tự" class="w-full pr-10 pl-3.5 py-2.5 text-sm text-[#3b1f0a]
                       bg-amber-50/50 border rounded-sm outline-none
                       placeholder:text-amber-800/40 placeholder:italic
                       transition-all duration-200 font-rowdies" :class="errorMessage
                        ? 'border-red-500/60 focus:shadow-[0_0_0_3px_rgba(192,57,43,0.1)]'
                        : 'border-amber-700/35 focus:border-amber-600/70 focus:shadow-[0_0_0_3px_rgba(180,120,40,0.1)]'" />
              <button type="button" @click="show.new = !show.new"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-amber-800/50 hover:text-amber-700 transition-colors">
                <Eye v-if="!show.new" class="w-4 h-4" />
                <EyeOff v-else class="w-4 h-4" />
              </button>
            </div>
            <p v-if="errorMessage" class="text-[11px] text-red-600">{{ errorMessage }}</p>

            <!-- Strength bar -->
            <div v-if="newPasswordValue" class="mt-1.5">
              <div class="flex gap-1 mb-1">
                <div v-for="i in 4" :key="i" class="h-1 flex-1 rounded-full transition-all duration-300" :class="i <= strength.score
                  ? strength.score <= 1 ? 'bg-red-500'
                    : strength.score === 2 ? 'bg-amber-500'
                      : strength.score === 3 ? 'bg-yellow-400'
                        : 'bg-green-500'
                  : 'bg-amber-900/20'" />
              </div>
              <p class="text-[11px]" :class="strength.score <= 1 ? 'text-red-600'
                : strength.score === 2 ? 'text-amber-600'
                  : strength.score === 3 ? 'text-yellow-600'
                    : 'text-green-600'">
                {{ strength.label }}
              </p>
            </div>
          </div>
        </Field>

        <!-- Confirm password -->
        <Field name="confirmPassword" v-slot="{ field, errorMessage, meta }">
          <div class="flex flex-col gap-1">
            <label class="text-[11px] font-bold tracking-[0.08em] uppercase text-[#6b3f10]">
              ✅ Xác nhận mật khẩu mới
            </label>
            <div class="relative">
              <input v-bind="field" :type="show.confirm ? 'text' : 'password'" placeholder="Nhập lại mật khẩu mới"
                class="w-full pr-10 pl-3.5 py-2.5 text-sm text-[#3b1f0a]
                       bg-amber-50/50 border rounded-sm outline-none
                       placeholder:text-amber-800/40 placeholder:italic
                       transition-all duration-200 font-rowdies" :class="errorMessage
                        ? 'border-red-500/60 focus:shadow-[0_0_0_3px_rgba(192,57,43,0.1)]'
                        : 'border-amber-700/35 focus:border-amber-600/70 focus:shadow-[0_0_0_3px_rgba(180,120,40,0.1)]'" />
              <button type="button" @click="show.confirm = !show.confirm"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-amber-800/50 hover:text-amber-700 transition-colors">
                <Eye v-if="!show.confirm" class="w-4 h-4" />
                <EyeOff v-else class="w-4 h-4" />
              </button>
            </div>

            <!-- Match indicator -->
            <p v-if="meta.touched && !errorMessage && confirmPasswordValue" class="text-[11px] mt-0.5 text-green-600">
              ✅ Mật khẩu khớp
            </p>
            <p v-if="errorMessage" class="text-[11px] text-red-600">{{ errorMessage }}</p>
          </div>
        </Field>

        <!-- Divider -->
        <div class="flex justify-center">
          <img src="/images/line.png" class="xl:w-[200px] w-[100px]" alt="line" />
        </div>

        <!-- Buttons -->
        <div class="flex justify-center gap-4 flex-wrap">
          <button type="submit" :disabled="isLoading" class="relative w-[150px] flex justify-center items-center py-2
                   cursor-pointer hover:brightness-110 active:scale-95
                   transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
            <img src="/images/btn.png" class="w-full absolute" alt="" />
            <span v-if="!isLoading" class="text-[var(--color-text)] font-semibold text-sm z-10">
              Xác nhận
            </span>
            <span v-else class="z-10 flex items-center gap-1.5 text-sm font-semibold text-[var(--color-text)]">
              <svg class="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Đang lưu...
            </span>
          </button>

          <button type="button" @click="$router.back()" class="relative w-[150px] flex justify-center items-center py-2
                   cursor-pointer hover:brightness-110 active:scale-95 transition-all duration-300">
            <img src="/images/btn.png" class="w-full absolute" alt="" />
            <span class="text-[var(--color-text)] font-semibold text-sm z-10">Hủy bỏ</span>
          </button>
        </div>

      </form>

      <!-- Success stamp -->
      <transition enter-active-class="transition duration-300" enter-from-class="opacity-0 scale-150"
        enter-to-class="opacity-100 scale-100" leave-active-class="transition duration-500"
        leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-75">
        <div v-if="showSuccess" class="absolute inset-0 z-50 flex items-center justify-center
                 bg-white/60 backdrop-blur-sm rounded-sm">
          <div class="border-8 border-green-600 text-green-600 text-2xl font-extrabold
                      px-8 py-4 rounded-xl bg-white shadow-2xl tracking-widest stamp-anim">
            ĐÃ CẬP NHẬT
          </div>
        </div>
      </transition>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useForm, Field } from 'vee-validate'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { Eye, EyeOff } from 'lucide-vue-next'
import AuthAPI from '@/services/api/client/AuthAPI'

const router = useRouter()
const toast = useToast()
const isLoading = ref(false)
const showSuccess = ref(false)
const show = ref({ old: false, new: false, confirm: false })

// ── Zod schema ──
const schema = toTypedSchema(
  z.object({
    oldPassword: z
      .string()
      .min(1, 'Vui lòng nhập mật khẩu hiện tại'),

    newPassword: z
      .string()
      .min(6, 'Mật khẩu mới tối thiểu 6 ký tự'),

    confirmPassword: z
      .string()
      .min(1, 'Vui lòng xác nhận mật khẩu'),
  })
    .refine(data => data.newPassword !== data.oldPassword, {
      message: 'Mật khẩu mới phải khác mật khẩu cũ',
      path: ['newPassword'],
    })
    .refine(data => data.confirmPassword === data.newPassword, {
      message: 'Mật khẩu xác nhận chưa khớp',
      path: ['confirmPassword'],
    })
)

const { handleSubmit, values } = useForm({ validationSchema: schema, initialValues: { oldPassword: '', newPassword: '', confirmPassword: '' } })

// Reactive values để dùng trong template
const newPasswordValue = computed(() => values.newPassword)
const confirmPasswordValue = computed(() => values.confirmPassword)

// ── Password strength ──
const strength = computed(() => {
  const pw = newPasswordValue.value || ''
  if (!pw) return { score: 0, label: '' }
  let score = 0
  if (pw.length >= 6) score++
  if (pw.length >= 10) score++
  if (/[A-Z]/.test(pw) || /[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  return { score, label: ['', 'Yếu', 'Trung bình', 'Khá mạnh', 'Mạnh'][score] }
})

// ── Submit ──
const onSubmit = handleSubmit(async (formValues) => {
  isLoading.value = true
  try {
    await AuthAPI.changePassword({
      currentPassword: formValues.oldPassword,
      newPassword: formValues.newPassword,
    })
    showSuccess.value = true
    sessionStorage.removeItem('token')
    toast.success('Đổi mật khẩu thành công!')
    setTimeout(() => { showSuccess.value = false; window.location.href = '/' }, 1800)
  } catch (err) {
    const msg = err?.message || 'Đổi mật khẩu thất bại'
    toast.error(msg)
  } finally {
    isLoading.value = false
  }
})
</script>

<style>
@keyframes stampEffect {
  0% {
    transform: scale(3) rotate(-20deg);
    opacity: 0;
  }

  60% {
    transform: scale(0.9) rotate(5deg);
    opacity: 1;
  }

  80% {
    transform: scale(1.05) rotate(-2deg);
  }

  100% {
    transform: scale(1) rotate(-2deg);
  }
}

.stamp-anim {
  animation: stampEffect 0.6s ease-out forwards;
}
</style>