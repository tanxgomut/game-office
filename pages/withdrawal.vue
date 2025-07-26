<script setup lang="ts">
import { useConfirmDialog } from '@/composables/useConfirmDialog'
import { getPaginationRowModel } from '@tanstack/vue-table'
import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date'
import { h, ref, computed, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
const table = useTemplateRef('table')
const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')

declare module 'jspdf' {
    interface jsPDF {
        addFileToVFS(filename: string, data: string): void;
        addFont(postScriptName: string, id: string, fontStyle: string): void;
        setFont(fontName: string, fontStyle?: string): void;
    }
}

type Transaction = {
    id: string
    name: string
    phone: string
    amount: number
    status: 'success' | 'pending' | 'failed'
    date: string
}

const allData = ref<Transaction[]>(
    Array.from({ length: 20 }, (_, i) => ({
        id: `WD${i + 1}`,
        name: `User ${i + 1}`,
        phone: `08${Math.floor(300000000 + Math.random() * 699999999)}`,
        amount: Math.floor(Math.random() * 1000) + 100,
        status: ['success', 'pending', 'failed'][i % 3] as Transaction['status'],
        date: new Date(Date.now() - i * 86400000).toISOString(), // ถอยหลังวันละ 1 วัน
    }))
)

const df = new DateFormatter('th-TH', { dateStyle: 'medium' })

const today = new Date()
const localZone = getLocalTimeZone()

const startDate = ref<CalendarDate | null>(null)
const endDate = ref<CalendarDate | null>(null)

function calendarDateToJS(d: CalendarDate | null): Date | null {
    return d ? d.toDate(localZone) : null
}

const search = ref('')
const selectedType = ref<'all' | 'deposit' | 'withdrawal'>('all')

const filteredData = computed(() => {
    return allData.value.filter(item => {
        const s = search.value.toLowerCase()
        const matchSearch = item.name.toLowerCase().includes(s) || item.phone.includes(s)
        const dateObj = new Date(item.date)
        const matchStart = startDate.value ? dateObj >= calendarDateToJS(startDate.value)! : true
        const matchEnd = endDate.value ? dateObj <= calendarDateToJS(endDate.value)! : true

        return matchSearch && matchStart && matchEnd
    })
})

const resetFilter = () => {
    search.value = ''
    startDate.value = null
    endDate.value = null
}

const columns: TableColumn<Transaction>[] = [
    {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ row }) => `#${row.getValue('id')}`
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
        accessorKey: 'amount',
        header: () => h('div', { class: 'text-right' }, 'จำนวนเงิน'),
        cell: ({ row }) => {
            const amount = Number(row.getValue('amount'))
            return h('div', { class: 'text-right font-medium' },
                new Intl.NumberFormat('th-TH', {
                    style: 'currency',
                    currency: 'THB'
                }).format(amount)
            )
        }
    },
    {
        accessorKey: 'status',
        header: 'สถานะ',
        cell: ({ row }) => {
            const status = row.getValue('status')
            const map = {
                success: 'text-primary',
                pending: 'text-warning',
                failed: 'text-error'
            }
            return h('span', { class: `font-semibold ${map[status]}` }, status)
        }
    },
    {
        accessorKey: 'date',
        header: 'วันที่',
        cell: ({ row }) => new Date(row.getValue('date')).toLocaleString('th-TH', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        })
    },
    {
        id: 'actions',
        header: 'การจัดการ',
        cell: ({ row }) => {
            const item = row.original
            if (item.status !== 'pending') {
                return null
            }
            return h('div', { class: 'flex gap-4' }, [
                h(UButton, {
                    label: 'ยกเลิก',
                    color: 'neutral',
                    size: 'xs',
                    variant: 'solid',
                    onClick: () => handleCancel(row.original)
                }),
                h(UButton, {
                    label: 'ยืนยัน',
                    color: 'primary',
                    size: 'xs',
                    onClick: () => handleConfirm(row.original)
                })
            ])
        }
    }
]

const handleConfirm = async (item: Transaction) => {
    const { showDialog } = useConfirmDialog()

    const confirmed = await showDialog({
        title: 'ยืนยันรายการถอน ',
        message: `คุณ ${item.name} ถอนเงินจำนวน : ฿${item.amount} บาท`,
        icon: 'info',
        textConfirm: 'ยืนยันการถอน',
        textCancel: 'ปิด',
    })

    if (confirmed) {
        confirmAction(item)
    } else {
        console.log('ยกเลิกการลบ')
    }
}

const handleCancel = async (item: Transaction) => {
    const { showDialog } = useConfirmDialog()

    const confirmed = await showDialog({
        title: 'ยกเลิกรายการถอน ',
        message: `คุณ ${item.name} ถอนเงินจำนวน : ฿${item.amount} บาท`,
        icon: 'error',
        textConfirm: 'ยกเลิกการถอน',
        textCancel: 'ปิด'
    })

    if (confirmed) {
        cancelAction(item)
    } else {
        console.log('ยกเลิกการลบ')
    }
}

const confirmAction = (item: Transaction) => {
    item.status = 'success'
    console.log('✅ ยืนยัน:', item)
    // ทำ logic ยืนยันที่นี่ เช่น ส่ง API
}

const cancelAction = (item: Transaction) => {
    item.status = 'failed'
    console.log('❌ ยกเลิก:', item)
    // ทำ logic ยกเลิกที่นี่ เช่น ส่ง API
}

const pagination = ref({
    pageIndex: 0,
    pageSize: 10
})



</script>

<template>
    <div class="sticky top-[64px] z-10  py-4 bg-background">
        <div class="flex justify-between items-center">
            <div class="text-4xl sticky top-0 font-medium py-4">รายการถอน</div>
        </div>


        <!-- 🔍 Filter Section -->
        <div class="flex flex-wrap gap-4 items-end">
            <UInput v-model="search" placeholder="ค้นหาชื่อหรือเบอร์" class="w-100" />
            <!-- <USelect v-model="selectedType" :items="[
                { label: 'ทั้งหมด', value: 'all' },
                { label: 'ฝาก', value: 'deposit' },
                { label: 'ถอน', value: 'withdrawal' }
            ]" class="w-40" placeholder="ประเภท" /> -->

            <UPopover>
                <UButton variant="outline" icon="i-lucide-calendar" color="neutral" class="w-40">
                    {{ startDate ? df.format(startDate.toDate(localZone)) : 'จากวันที่' }}
                </UButton>
                <template #content>
                    <UCalendar v-model="startDate" class="p-2" :fixed-weeks="false" />
                </template>
            </UPopover>
            <UPopover>
                <UButton variant="outline" icon="i-lucide-calendar" color="neutral" class="w-40">
                    {{ endDate ? df.format(endDate.toDate(localZone)) : 'ถึงวันที่' }}
                </UButton>
                <template #content>
                    <UCalendar v-model="endDate" class="p-2" :fixed-weeks="false" />
                </template>
            </UPopover>
            <UButton color="primary" variant="outline" icon="i-lucide-rotate-ccw" @click="resetFilter">
                ล้างตัวกรอง
            </UButton>
        </div>
    </div>
    <div class="space-y-4">
        <!-- 📊 Table -->
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
