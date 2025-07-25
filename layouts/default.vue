<script setup lang="ts">
import BaseHeader from '~/components/base/header.vue';

const route = useRoute()
const router = useRouter()
const isLogin = useCookie('isLogin')

const item = ref([
    {
        page: 'member',
        label: 'สมาชิก',
        icon: 'i-lucide-users-round',
        to: '/member',
    },
    {
        page: 'withdrawal',
        label: 'รายการถอน',
        icon: 'i-lucide-banknote-arrow-down',
        to: '/withdrawal',
    },
    {
        page: 'report',
        label: 'รายงาน',
        icon: 'i-lucide-file-stack',
        to: '/report',
    },
])



const logOut = () => {
    isLogin.value = null
    router.push('/')
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

    if (confirmed) logOut()
}

</script>
<template>
    <div class="h-screen flex max-w-full min-w-md  mx-auto ">
        <div class="w-[200px] flex flex-col p-4 shadow-lg dark:shadow-xl ">
            <NuxtLink class="flex items-center  py-4">
                <span class="font-bold text-xl text-foreground">BRAND</span>
            </NuxtLink>
            <div class="flex-1 space-y-4 overflow-auto">
                <UButton v-for="page in item" :key="page.page" :to="page.to" :icon="page.icon" size="lg" color="primary"
                    :variant="route.path.startsWith(page.to) ? 'soft' : 'ghost'" class="w-full">
                    {{ page.label }}
                </UButton>
            </div>
            <div class="mt-4 flex justify-end">
                <UButton @click="handleLogout" icon="i-lucide-log-out" size="lg" color="neutral" variant="soft">
                    ออกจากระบบ
                </UButton>
            </div>
        </div>
        <div class="flex-1 flex flex-col  h-screen overflow-auto">
            <!-- <BaseHeader /> -->
            <div class="flex-1  px-4 w-full ">
                <BaseHeader />
                <NuxtPage  />
            </div>
        </div>
    </div>
    <BaseConfirmDialog />
</template>