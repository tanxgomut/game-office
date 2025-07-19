<script setup lang="ts">
import { useConfirmDialog } from '@/composables/useConfirmDialog'

const { isOpen, options, confirm, cancel } = useConfirmDialog()

watch(isOpen, (val) => {

})


const iconMap: Record<string, string> = {
    info: 'i-heroicons-information-circle',
    success: 'i-heroicons-check-circle',
    error: 'i-heroicons-x-circle',
    warning: 'i-heroicons-exclamation-triangle'
}

</script>

<template>
    <UModal :open="isOpen" @close="isOpen = false">
        <template #content>
            <div class="p-4 space-y-4 ">
                <div class="flex ">
                    <UIcon :name="iconMap[options.icon ?? 'primary']"
                        :class="`text-3xl text-${options.icon || 'primary'} mr-2`" />
                    <h3 class="text-lg font-semibold">{{ options.title }}</h3>
                </div>

                <p class="text-sm text-gray-500 whitespace-pre-line">{{ options.message }}</p>

                <div v-if="!options.textSubmit" class="flex justify-end gap-2 pt-4">
                    <UButton v-if="options.textCancel" :label="options.textCancel || 'ยกเลิก'" @click="cancel"
                        variant="outline" color="primary" />
                    <UButton :label="options.textConfirm || 'ตกลง'" @click="confirm" color="primary" />

                </div>
                <UButton v-else block color="neutral" @click="confirm">
                    {{ options.textSubmit }}
                </UButton>
            </div>
        </template>
    </UModal>
</template>
