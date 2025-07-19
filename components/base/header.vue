<script setup lang="ts">
import ColorModeButton from '~/components/base/ColorModeButton.vue';
import AuthLogin from '~/components/auth/login.vue'
import type { DropdownMenuItem } from '@nuxt/ui'


const router = useRouter()
const mobileMenuOpen = ref<boolean>(false)
const isLogin = useCookie('isLogin')
const navItems = [
    { name: 'หน้าหลัก', href: '/' },
    { name: 'เกม', href: '/game' },
    { name: 'ติดต่อแอดมิน', href: '/contact' }
]

const items = ref<DropdownMenuItem[]>([
    {
        label: 'Profile',
        icon: 'i-lucide-user'
    },
    {
        label: 'Billing',
        icon: 'i-lucide-credit-card'
    },
    {
        label: 'Settings',
        icon: 'i-lucide-cog'
    }
])

const showLogin = ref(false)

const toProfile = () => {
    router.push('/profile')
}
</script>

<template>

    <header class="sticky top-0 z-50 w-full bg-background backdrop-blur supports-[backdrop-filter]:bg-background/60 ">
        <div class="flex h-16 items-center justify-between">
            <div class="flex items-center gap-2">
                <NuxtLink to="/" class="flex items-center space-x-2">
                    <span class="font-bold text-xl text-foreground">BRAND</span>
                </NuxtLink>
            </div>

            <nav class="hidden md:flex items-center space-x-4">
                <!-- <NuxtLink v-for="item in navItems" :key="item.href" :to="item.href"
                    class="text-sm font-medium transition-colors hover:text-primary text-foreground">
                    {{ item.name }}
                </NuxtLink> -->
                <UButton to="https://line.me/ti/p/yourlineid" icon="i-lucide-message-circle-heart" size="md"
                    color="primary" variant="soft">
                    ติดต่อแอดมิน
                </UButton>
                <ColorModeButton />
                <UAvatar v-if="isLogin" @click="toProfile" src="https://github.com/benjamincanac.png" size="xl" />
                <AuthLogin v-else />

            </nav>

            <nav class="md:hidden flex items-center space-x-4">
                <UButton to="https://line.me/ti/p/yourlineid" icon="i-lucide-message-circle-heart" size="md"
                    color="primary" variant="soft">
                    ติดต่อแอดมิน
                </UButton>
                <ColorModeButton />
                <!-- <UDropdownMenu :items="items" :ui="{
                    content: 'w-48'
                }">
                    <UButton icon="i-lucide-menu" color="neutral" variant="outline" />
                </UDropdownMenu> -->
            </nav>

            <!-- <div class="flex md:hidden">
                <UButton variant="ghost" icon="i-lucide-rocket" class="ml-2" @click="toggleMobileMenu">
                    <span class="sr-only">Toggle menu</span>
                </UButton>
            </div> -->
        </div>
        <!-- <div v-show="mobileMenuOpen"
            class="fixed animate-fade-left inset-0 top-16 z-50 grid h-screen-minus-navbar grid-flow-row auto-rows-max overflow-auto p-6 bg-background text-foreground border-t md:hidden">
            <div class="grid grid-flow-row auto-rows-max text-center">
                <NuxtLink v-for="item in navItems" :key="item.href" :to="item.href"
                    class="flex items-center justify-center py-3 text-base font-medium transition-colors hover:text-primary"
                    @click="mobileMenuOpen = false">
                    {{ item.name }}
                </NuxtLink>

                <UButton class="mt-4" color="primary">เริ่มต้นใช้งาน</UButton>
            </div>
        </div> -->

    </header>
</template>

<style scoped>
.h-screen-minus-navbar {
    height: calc(100vh - 64px);
}
</style>
