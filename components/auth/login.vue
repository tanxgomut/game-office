<script setup lang="ts">
import { object, string } from 'yup'
import type { InferType } from 'yup'
import type { FormSubmitEvent } from '@nuxt/ui'

const toast = useToast()

const isLogin = useCookie('isLogin')
const router = useRouter()



const schemaLogin = object({
  phone: string()
    .required('กรุณากรอกเบอร์โทร')
    .matches(/^0[689]\d{8}$/, 'เบอร์โทรไม่ถูกต้อง'),
  pin: string()
    .required('กรุณากรอก PIN')
    .matches(/^\d{6}$/, 'PIN ต้องเป็นตัวเลข 6 หลัก')
})


type SchemaLogin = InferType<typeof schemaLogin>


const pinLogin = ref<string[]>(Array(6).fill(''))


const stateLogin = reactive({
  phone: '',
  get pin() {
    return pinLogin.value.join('')
  },
  set pin(val: string) {
    pinLogin.value = val.split('')
  }
})

const resetFrom = () => {
  stateLogin.phone = ''
  stateLogin.pin = ''
  pinLogin.value = Array(6).fill('')
}



async function onSubmitLogin(event: FormSubmitEvent<SchemaLogin>) {
  toast.add({
    title: 'เข้าสู่ระบบสำเร็จ',
    description: `สวัสดีคุณ ${stateLogin.phone}`,
    color: 'success'
  })
  console.log('📦 ข้อมูลที่ส่ง:', event.data)
  isLogin.value = 'isLogin'
  router.push('/member')
}
</script>

<template>
  <div class="mt-20 mb-15 text-center">
    <UIcon name="i-lucide-shield-user" class="size-40" />
  </div>
  <UForm :schema="schemaLogin" :state="stateLogin" class="space-y-6" @submit="onSubmitLogin">
    <UFormField label="เบอร์โทรศัพท์" name="phone">
      <UInput v-model="stateLogin.phone" placeholder="089xxxxxxx" size="lg" class="w-full" />
    </UFormField>
    <UFormField label="PIN (6 หลัก)" name="pin">
      <UPinInput v-model="pinLogin" length="6" :disabled="false" :mask="false" size="lg" />
    </UFormField>
    <USeparator label="ล็อกอิน" class="mb-4" />
    <div class="pt-4">
      <UButton type="submit" icon="i-lucide-log-in" color="info" size="lg"
        class="w-full flex justify-center items-center ">
        เข้าสู่ระบบ
      </UButton>
    </div>

  </UForm>
</template>