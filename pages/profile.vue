<script setup>
import { useConfirmDialog } from '@/composables/useConfirmDialog'

const isLogin = useCookie('isLogin')

const logOut = () => {
    isLogin.value = null
}

const handleLogout = async () => {
    const { showDialog } = useConfirmDialog()

    const confirmed = await showDialog({
        title: 'ออกจากระบบบัญชีนี้',
        // message: 'เมื่อลบแล้วไม่สามารถกู้คืนได้',
        icon: 'warning',
        textConfirm: 'ออกจากระบบ',
        textCancel: 'ยกเลิก',
    })

    if (confirmed) {
        logOut()
    } else {
        console.log('ยกเลิกการลบ')
    }
}
</script>
<template>
    <div class="flex items-center">
        <UAvatar src="https://github.com/benjamincanac.png" size="3xl" />
        <div  class="flex-1 px-3">
            <div class="text-xl">คุณ jack</div>
            <p class="text-sm">064-789-5632</p>
        </div>
        <!-- <UButton v-if="isLogin" icon="i-lucide-settings" size="md" color="primary" variant="soft" />
        <div v-if="!isLogin" class="flex-1 px-3">
            <div class="flex justify-between items-center">
                <div class="text-md font-medium">คุณยังไม่ได้เข้าสู่ระบบ</div>
                <AuthLogin class="md:hidden" />
            </div>
        </div> -->
    </div>
    <div  class="w-full  px-4 py-6 rounded-md mt-2 h-[2000px] ">
        <div class="text-xl">ยอดเงินคงเหลือ</div>
        <div class="text-lg font-bold">฿ : 200</div>
    </div>
    <!-- <div v-if="isLogin" class="mt-6">
        <UButton @click="handleLogout()" label="ออกจากระบบ" size="lg" color="neutral" variant="soft"
            class="w-full flex justify-center items-center" />
    </div> -->
</template>