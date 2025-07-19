<script setup lang="ts">
import { object, string } from 'yup'
import type { InferType } from 'yup'
import type { FormSubmitEvent } from '@nuxt/ui'

const toast = useToast()

const isLogin = useCookie('isLogin')
const showModal = defineModel<boolean>()
const page = ref('login')

const schema = object({
  phone: string()
    .required('กรุณากรอกเบอร์โทร')
    .matches(/^0[689]\d{8}$/, 'เบอร์โทรไม่ถูกต้อง'),
  bank: string().required('กรุณาเลือกธนาคาร'),
  accountNumber: string().required('กรุณากรอกเลขบัญชี'),
  pin: string()
    .required('กรุณากรอก PIN')
    .matches(/^\d{6}$/, 'PIN ต้องเป็นตัวเลข 6 หลัก')
})

const schemaLogin = object({
  phone: string()
    .required('กรุณากรอกเบอร์โทร')
    .matches(/^0[689]\d{8}$/, 'เบอร์โทรไม่ถูกต้อง'),
  pin: string()
    .required('กรุณากรอก PIN')
    .matches(/^\d{6}$/, 'PIN ต้องเป็นตัวเลข 6 หลัก')
})

type Schema = InferType<typeof schema>
type SchemaLogin = InferType<typeof schemaLogin>

const pinRegis = ref<string[]>(Array(6).fill(''))
const pinLogin = ref<string[]>(Array(6).fill(''))

const state = reactive({
  phone: '',
  bank: '',
  accountNumber: '',
  get pin() {
    return pinRegis.value.join('')
  },
  set pin(val: string) {
    pinRegis.value = val.split('')
  }
})

const stateLogin = reactive({
  phone: '',
  get pin() {
    return pinLogin.value.join('')
  },
  set pin(val: string) {
    pinLogin.value = val.split('')
  }
})

const bankOptions = [
  { label: 'กสิกรไทย', value: 'kbank' },
  { label: 'ไทยพาณิชย์', value: 'scb' },
  { label: 'กรุงไทย', value: 'ktb' },
  { label: 'กรุงเทพ', value: 'bbl' }
]


watch(showModal, (val) => {
  if (!val) {
    resetFrom()
  }
})

const resetFrom = () => {
  stateLogin.phone = ''
  stateLogin.pin = ''
  pinLogin.value = Array(6).fill('')

  state.phone = ''
  state.bank = ''
  state.accountNumber = ''
  state.pin = ''
  pinRegis.value = Array(6).fill('')
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log('📦 :', event.data)
}

async function onSubmitLogin(event: FormSubmitEvent<SchemaLogin>) {
  // toast.add({
  //   title: 'เข้าสู่ระบบสำเร็จ',
  //   description: `สวัสดีคุณ ${stateLogin.phone}`,
  //   color: 'success'
  // })
  console.log('📦 ข้อมูลที่ส่ง:', event.data)
  isLogin.value = 'isLogin'
}
</script>

<template>
  <UModal v-model:open="showModal" :title="page == 'login' ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'">
    <UButton color="primary">เข้าสู่ระบบ </UButton>
    <template #body>
      <template v-if="page === 'login'">
        <UForm :schema="schemaLogin" :state="stateLogin" class="space-y-4" @submit="onSubmitLogin">
          <UFormField label="เบอร์โทรศัพท์" name="phone">
            <UInput v-model="stateLogin.phone" placeholder="089xxxxxxx" size="lg" class="w-full" />
          </UFormField>
          <UFormField label="PIN (6 หลัก)" name="pin">
            <UPinInput v-model="pinLogin" length="6" :disabled="false" :mask="false" />
          </UFormField>
          <div class="w-full flex justify-end items-center">
            <UButton label="ลืมรหัสผ่าน ?" color="neutral" variant="link" />
          </div>
          <USeparator label="ล็อกอิน" />
          <div class="">
            <UButton type="submit" color="primary" size="md" class="w-full flex justify-center items-center">
              เข้าสู่ระบบ
            </UButton>
            <div class="w-full flex justify-center items-center mt-2 text-sm">
              ยังไม่มีบัญชี ?
              <UButton label="สมัครสมาชิก" @click="page = 'register'" color="primary" variant="link" />
            </div>
          </div>
        </UForm>
      </template>
      <template v-if="page === 'register'">
        <UForm :schema="schema" :state="state" class="space-y-3" @submit="onSubmit">
          <UFormField label="เบอร์โทรศัพท์" name="phone">
            <UInput v-model="state.phone" placeholder="089xxxxxxx" class="w-full" />
          </UFormField>
          <UFormField label="ธนาคาร" name="bank">
            <USelect v-model="state.bank" :items="bankOptions" placeholder="เลือกธนาคาร" class="w-full" />
          </UFormField>
          <UFormField label="เลขที่บัญชี" name="accountNumber">
            <UInput v-model="state.accountNumber" class="w-full" placeholder="1234567890" />
          </UFormField>
          <UFormField label="PIN (6 หลัก)" name="pin">
            <UPinInput v-model="pinRegis" length="6" :disabled="false" :mask="false" />
          </UFormField>
          <USeparator label="สมัคร" />
          <div class=" pt-2">
            <UButton type="submit" color="primary" size="md" class="w-full flex justify-center items-center">
              สมัครสมาชิก
            </UButton>
            <div class="w-full flex justify-end items-center mt-2 text-sm">
              <UButton label="เข้าสู่ระบบ ?" @click="page = 'login'" color="primary" variant="link" />
            </div>
          </div>
        </UForm>
      </template>
    </template>
  </UModal>
</template>