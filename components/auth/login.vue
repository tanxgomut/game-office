<script setup lang="ts">
import { object, string } from 'yup'
import type { InferType } from 'yup'
import type { FormSubmitEvent } from '@nuxt/ui'

const toast = useToast()

const isLogin = useCookie('isLogin')
const router = useRouter()



const schemaLogin = object({
  phone: string()
    .required('กรอก username'),
  pin: string()
    .required('กรอก password')
})


type SchemaLogin = InferType<typeof schemaLogin>


// const pinLogin = ref<string[]>(Array(6).fill(''))


const stateLogin = reactive({
  phone: '',
  pin: ''
})

const resetFrom = () => {
  stateLogin.phone = ''
  stateLogin.pin = ''
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
    <UFormField label="username" name="phone">
      <UInput v-model="stateLogin.phone" placeholder="username" size="lg" class="w-full" />
    </UFormField>
    <UFormField label="password" name="pin">
      <UInput v-model="stateLogin.pin" placeholder="password" type="password" size="lg" class="w-full" />
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