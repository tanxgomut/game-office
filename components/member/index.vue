<script setup lang="ts">
import { object, string } from 'yup'
import type { InferType } from 'yup'
import type { FormSubmitEvent } from '@nuxt/ui'
const toast = useToast()

const props = defineProps(['text', 'userData'])
const emit = defineEmits(['submit', 'close'])

const isOpen = defineModel<boolean>()
const isLogin = useCookie('isLogin')

onMounted(() => {

})

watch(isOpen, (val) => {
  if (val && props.userData) {
    state.phone = props.userData.phone
    state.bank = props.userData.bankType
    state.accountNumber = props.userData.bankAccount
    state.pin = '123456'
  } else {
    resetFrom()
  }
})

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

type Schema = InferType<typeof schema>

const pinRegis = ref<string[]>(Array(6).fill(''))

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

const bankOptions = [
  { label: 'กสิกรไทย', value: 'kbank' },
  { label: 'ไทยพาณิชย์', value: 'scb' },
  { label: 'กรุงไทย', value: 'ktb' },
  { label: 'กรุงเทพ', value: 'bbl' }
]

const resetFrom = () => {
  state.phone = ''
  state.bank = ''
  state.accountNumber = ''
  state.pin = ''
  pinRegis.value = Array(6).fill('')
}

async function onSubmit() {
  try {
    await schema.validate(state, { abortEarly: false })
    emit('submit', state)
    isOpen.value = false
  } catch (error) {
    toast.add({ title: 'กรอกข้อมูลไม่ครบหรือไม่ถูกต้อง', color: 'error' })
  }
}

</script>

<template>
  <UDrawer v-model:open="isOpen" direction="right" :dismissible="false" :handle="false"
    :ui="{ body: 'h-full overflow-auto min-w-[500px]', header: 'flex items-center justify-between' }">
    <template #header>
      <h2 class="text-highlighted font-semibold">{{ text }}</h2>
      <UButton color="neutral" variant="ghost" icon="i-lucide-x" @click="isOpen = false" />
    </template>
    <template #body>
      <UForm :schema="schema" :state="state" class="space-y-3">
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
      </UForm>
    </template>
    <template #footer>
      <div class="flex justify-end gap-x-2 ">
        <UButton label="ยกเลิก" color="error" variant="soft" />
        <UButton @click="onSubmit()" label="บันทึก" color="primary" variant="soft" />
      </div>
    </template>
  </UDrawer>

</template>