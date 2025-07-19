<script setup lang="ts">
const mobileMenuOpen = ref(false)

const navItems = [
    { name: 'หน้าแรก', href: '/' },
    { name: 'auth', href: '/auth' },
    { name: 'map', href: '/map' }
]

const toggleMobileMenu = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value
}
</script>

<template>
    <header
        class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div class="flex h-16 items-center justify-between">
            <div class="flex items-center gap-2">
                <NuxtLink to="/" class="flex items-center space-x-2">
                    <span class="font-bold text-xl">BRAND</span>
                </NuxtLink>
            </div>

            <!-- Desktop navigation -->
            <nav class="hidden md:flex items-center space-x-6">
                <NuxtLink v-for="item in navItems" :key="item.href" :to="item.href"
                    class="text-sm font-medium transition-colors hover:text-primary">
                    {{ item.name }}
                </NuxtLink>
                
                <UButton size="sm" class="dark:bg-red-100">เริ่มต้นใช้งาน</UButton>
            </nav>

            <!-- Mobile menu button -->
            <div class="flex md:hidden">
              
                <UButton variant="ghost" icon="i-lucide-rocket" class="ml-2" @click="toggleMobileMenu">
                    <span class="sr-only">Toggle menu</span>

                </UButton>
            </div>
        </div>

        <!-- Mobile navigation -->
        <div class="fixed animate-fade-left inset-0 top-16 bg-white z-50 grid h-screen-minus-navbar grid-flow-row auto-rows-max overflow-auto p-6  bg-background border-t md:hidden"
            v-show="mobileMenuOpen">
            <div class="grid grid-flow-row auto-rows-max text-center">
                <NuxtLink v-for="item in navItems" :key="item.href" :to="item.href"
                    class="flex items-center justify-center py-3 text-base font-medium transition-colors hover:text-primary"
                    @click="mobileMenuOpen = false">
                    {{ item.name }}
                </NuxtLink>
                <UButton class="mt-4">เริ่มต้นใช้งาน</UButton>
            </div>
        </div>
    </header>
</template>

<style scoped>
.h-screen-minus-navbar {
  height: calc(100vh - 64px);
}

</style>
