<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
  error: Object as () => NuxtError
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center  px-4">
    <UCard class="max-w-md w-full text-center space-y-4">
      <div class="flex justify-center ">
        <UIcon name="i-lucide-alert-triangle" class="w-12 h-12" />
      </div>
      <h1 class="text-4xl font-bold ">
        {{ error?.statusCode || 'Error' }}
      </h1>
      <p class="text-lg font-medium text-gray-700 dark:text-gray-300">
        {{ error?.message || 'เกิดข้อผิดพลาดบางอย่าง' }}
      </p>
      <div class="space-y-2">
        <UButton to="/" icon="i-lucide-home" color="primary" block class="mt-4">
          กลับหน้าหลัก
        </UButton>
        <UButton to="https://line.me/ti/p/yourlineid" block icon="i-lucide-message-circle-heart" color="neutral"
          variant="soft" class="mt-4">
          ติดต่อแอดมิน
        </UButton>
      </div>
    </UCard>
  </div>
</template>