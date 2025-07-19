<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const menuItems = [
  { name: 'หน้าหลัก', href: '/', icon: 'i-lucide-home' },
  // { name: 'เกม', href: '/game', icon: 'i-lucide-gamepad-2' },
  // { name: 'ติดต่อแอดมิน', href: '/contact', icon: 'i-lucide-message-circle' },
  { name: 'โปรไฟล์', href: '/profile', icon: 'i-lucide-user' }
]

const isActive = (href: string) => {
  return route.path === href
}
</script>

<template>
  <nav
    class="md:hidden sticky bottom-0 z-50 w-full bg-background text-foreground  backdrop-blur supports-[backdrop-filter]:bg-background/60"
  >
    <div class="grid grid-cols-2 gap-1 py-1">
      <NuxtLink
        v-for="item in menuItems"
        :key="item.href"
        :to="item.href"
        class="flex flex-col items-center justify-center text-xs px-2 py-1 transition-colors"
        :class="isActive(item.href) ? 'text-primary' : 'text-foreground/60 hover:text-primary'"
      >
        
        <UIcon :name="item.icon" class="size-5" />
        <span class="mt-1 font-medium">{{ item.name }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>
