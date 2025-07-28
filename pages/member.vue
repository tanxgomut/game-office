<script setup lang="ts">
import { useConfirmDialog } from '@/composables/useConfirmDialog'
import { getPaginationRowModel } from '@tanstack/vue-table'
import { h, ref, computed, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import axios from 'axios'
const table = useTemplateRef('table')
const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')

const open = ref(false)
const textHeader = ref('เพิ่มสมาชิก')
const itemUser = ref<User | null>(null)


interface User {
    id: string
    name: string
    phone: string
    bankAccount: string
    bankType: string
    credit: number
}

const bankTypes = [
    { label: 'กสิกรไทย', value: 'kbank' },
    { label: 'ไทยพาณิชย์', value: 'scb' },
    { label: 'กรุงไทย', value: 'ktb' },
    { label: 'กรุงเทพ', value: 'bbl' }]

const allUsers = ref<User[]>(Array.from({ length: 20 }, (_, i) => ({
    id: `U${(i + 1).toString().padStart(3, '0')}`,
    name: ['James', 'Mia', 'William', 'Emma', 'Noah', 'Olivia', 'Ethan', 'Sophia', 'Lucas', 'Ava'][i % 10] + ` ${i}`,
    phone: `08${Math.floor(10000000 + Math.random() * 89999999)}`,
    bankAccount: `${Math.floor(1000000000 + Math.random() * 8999999999)}`,
    bankType: bankTypes[i % bankTypes.length].value,
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
        header: 'ธนาคาร',
        cell: ({ row }) => {
            const value = row.getValue('bankType')
            const label = bankTypes.find(b => b.value === value)?.label || '-'
            return label
        }
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
                    itemUser.value = row.original
                    open.value = true
                }
            })
        }
    }
]

import { useApi } from '@/composables/useApi'

const { get } = useApi()
const users = ref()
// const { data: users, pending, error } = await useAsyncData('users', get)

onMounted(async () => {
   // const res = await axios.get('https://api.example.com/users')
    users.value = await get()
    console.log(users.value, 852);
    //const res = await axios.get('https://api.example.com/users')
    //console.log(res);

})


const addMember = () => {
    textHeader.value = 'เพิ่มสมาชิก'
    itemUser.value = null
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

const mangeMember = (e: any) => {

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
    <Member v-model="open" :text="textHeader" :userData="itemUser" @submit="mangeMember" />
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

</template>