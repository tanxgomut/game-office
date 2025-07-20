<script setup lang="ts">
import { useConfirmDialog } from '@/composables/useConfirmDialog'

async function handleDelete() {
    const { showDialog } = useConfirmDialog()

    const confirmed = await showDialog({
        title: 'คุณแน่ใจหรือไม่?',
        message: 'เมื่อลบแล้วไม่สามารถกู้คืนได้',
        icon: 'info',
        textConfirm: 'ลบ',
        textCancel: 'ยกเลิก',
    })

    if (confirmed) {
        console.log('ลบเรียบร้อย')
    } else {
        console.log('ยกเลิกการลบ')
    }
}

</script>

<template>
    <div class="flex flex-col">
        <div class="flex justify-end mt-4">
            <UButton icon="i-lucide-bitcoin" size="xl" color="primary" variant="solid">เติมเงิน</UButton>
        </div>
        <div class=" mt-4 ">
            <div>ยอดเงิน : </div>
             <div class="text-6xl text-center font-medium my-18">200.00 ฿</div>
            <UButton icon="i-lucide-gamepad-2" block size="xl" color="neutral" variant="solid">เข้าเกม</UButton>
        </div>

    </div>

</template>