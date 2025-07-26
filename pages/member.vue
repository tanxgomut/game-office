<script setup lang="ts">
import { useConfirmDialog } from '@/composables/useConfirmDialog'
import { getPaginationRowModel } from '@tanstack/vue-table'
import { h, ref, computed, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
const table = useTemplateRef('table')
const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')

const open = ref(false)
const textHeader = ref('เพิ่มสมาชิก')



interface User {
    id: string
    name: string
    phone: string
    bankAccount: string
    bankType: string
    credit: number
}

const bankTypes = ['SCB', 'KBank', 'BBL', 'Krungsri', 'TMB', 'UOB', 'Kiatnakin', 'GSB']

const allUsers = ref<User[]>(Array.from({ length: 20 }, (_, i) => ({
    id: `U${(i + 1).toString().padStart(3, '0')}`,
    name: ['James', 'Mia', 'William', 'Emma', 'Noah', 'Olivia', 'Ethan', 'Sophia', 'Lucas', 'Ava'][i % 10] + ` ${i}`,
    phone: `08${Math.floor(10000000 + Math.random() * 89999999)}`,
    bankAccount: `${Math.floor(1000000000 + Math.random() * 8999999999)}`,
    bankType: bankTypes[i % bankTypes.length],
    credit: 0
})))

const filteredData = computed(() => {
    return allUsers.value
})

const columns: TableColumn<User>[] = [
    {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ row }) => `#MB${row.getValue('id')}`
    },
    {
        accessorKey: 'name',
        header: 'ชื่อ'
    },
    {
        accessorKey: 'phone',
        header: 'เบอร์โทรศัพท์'
    },
    {
        accessorKey: 'bankAccount',
        header: 'เลขบัญชีธนาคาร'
    },
    {
        accessorKey: 'bankType',
        header: 'ธนาคาร'
    },
    {
        id: 'actions',
        header: 'เพิ่ม/ลบ เครดิต',
        cell: ({ row }) => {
            const item = row.original
            return h('div', { class: 'flex gap-4' }, [
                h(UButton, {
                    icon: 'i-lucide-minus',
                    label: 'ลบ',
                    color: 'neutral',
                    size: 'xs',
                    variant: 'soft',
                    onClick: () => deleteCredit(row.original)
                }),
                h('div', { class: 'min-w-[30px] px-1 text-center ' }, item.credit),
                h(UButton, {
                    icon: 'i-lucide-plus',
                    label: 'เพิ่ม',
                    color: 'primary',
                    size: 'xs',
                    variant: 'soft',
                    onClick: () => addCredit(row.original)
                })
            ])
        }
    },
    {
        id: 'edit',
        header: 'แก้ไขข้อมูล',
        cell: ({ row }) => {
            return h(UButton, {
                icon: 'i-lucide-user-pen',
                label: 'แก้ไขข้อมูล',
                color: 'secondary',
                size: 'xs',
                variant: 'solid',
                onClick: () => {
                    textHeader.value = 'แก้ไขข้อมูลสมาชิก'
                    open.value = true
                }
            })
        }
    }
]

const addMember = () => {
    textHeader.value = 'เพิ่มสมาชิก'
    open.value = true
}

const addCredit = (item: User) => {
    if (item.credit < 99) {
        item.credit++
    }
}

const deleteCredit = (item: User) => {
    if (item.credit > 0) {
        item.credit--
    }
}

const pagination = ref({
    pageIndex: 0,
    pageSize: 10
})

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
    <div class="sticky top-[64px] z-10  py-4 bg-background">
        <div class="flex justify-between items-center">
            <div class="text-4xl sticky top-0 font-medium py-4">สมาชิก</div>
            <div>
                <UButton icon="i-lucide-user-plus" size="lg" color="primary" block class="mr-4 w-40" @click="addMember">
                    เพิ่มสมาชิก
                </UButton>

            </div>

        </div>
    </div>
    <div class="space-y-4">
        <div id="pdf-content" class="w-full space-y-4 pb-4 ">
            <UTable ref="table" sticky v-model:pagination="pagination" :data="filteredData" :columns="columns"
                :pagination-options="{ getPaginationRowModel: getPaginationRowModel() }" class="flex-1 max-h-[550]">
            </UTable>

            <div class="flex justify-center border-t border-default pt-4">
                <UPagination :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
                    :items-per-page="table?.tableApi?.getState().pagination.pageSize" :total="filteredData.length"
                    @update:page="(p) => table?.tableApi?.setPageIndex(p - 1)" />
            </div>
        </div>
    </div>
    <!-- <UDrawer v-model:open="open" direction="right" :dismissible="false" :handle="false"
        :ui="{ header: 'flex items-center justify-between' }">
        <template #header>
            <h2 class="text-highlighted font-semibold">{{ textHeader }}</h2>

            <UButton color="neutral" variant="ghost" icon="i-lucide-x" @click="open = false" />
        </template>

<template #body>
            <div class="min-w-[500px] ">
                <div class="flex flex-col h-full">
                    <div class="flex-1 overflow-y-auto">
                        <div class="h-[2000px] p-4">
                            
                        </div>
                    </div>
                    <div class="flex justify-end gap-x-2 py-4">
                        <UButton label="ยกเลิก" color="error" variant="soft" />
                        <UButton label="บันทึก" color="primary" variant="soft" />
                    </div>
                </div>
            </div>
        </template>
</UDrawer> -->
    <UDrawer v-model:open="open" direction="right" :dismissible="false" :handle="false"
        :ui="{ body: 'h-full overflow-auto min-w-[500px]', header: 'flex items-center justify-between' }">
        <template #header>
            <h2 class="text-highlighted font-semibold">{{ textHeader }}</h2>
            <UButton color="neutral" variant="ghost" icon="i-lucide-x" @click="open = false" />
        </template>
        <template #body>
            <div class="h-[2000px]"></div>
        </template>

        <template #footer>
            <div class="flex justify-end gap-x-2 ">
                <UButton label="ยกเลิก" color="error" variant="soft" />
                <UButton label="บันทึก" color="primary" variant="soft" />
            </div>
        </template>
    </UDrawer>


</template>