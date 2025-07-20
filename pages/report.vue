<script setup lang="ts">
import { getPaginationRowModel } from '@tanstack/vue-table'
import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date'
import { h, ref, computed, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
const table = useTemplateRef('table')
const UBadge = resolveComponent('UBadge')
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { THSarabunNew_normal } from '~/fonts/THSarabunNew-normal';

declare module 'jspdf' {
    interface jsPDF {
        addFileToVFS(filename: string, data: string): void;
        addFont(postScriptName: string, id: string, fontStyle: string): void;
        setFont(fontName: string, fontStyle?: string): void;
    }
}

type Transaction = {
    id: string
    type: 'deposit' | 'withdrawal'
    name: string
    phone: string
    amount: number
    status: 'success' | 'pending' | 'failed'
    date: string
}

// ✅ ข้อมูลจำลอง 20 รายการ
const allData = ref<Transaction[]>(Array.from({ length: 20 }, (_, i) => ({
    id: `T${(i + 1).toString().padStart(3, '0')}`,
    type: i % 2 === 0 ? 'deposit' : 'withdrawal',
    name: ['James', 'Mia', 'William', 'Emma', 'Noah', 'Olivia', 'Ethan', 'Sophia', 'Lucas', 'Ava'][i % 10] + ` ${i}`,
    phone: `08${Math.floor(10000000 + Math.random() * 89999999)}`,
    amount: Math.floor(Math.random() * 1000) + 100,
    status: ['success', 'pending', 'failed'][i % 3] as Transaction['status'],
    date: new Date(Date.now() - i * 86400000).toISOString(), // ถอยหลังวันละ 1 วัน
})))

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

// ✅ ตัวกรองข้อมูลทั้งหมด
// const filteredData = computed(() => {
//     return allData.value.filter((t) => {
//         const matchSearch = t.name.includes(search.value) || t.phone.includes(search.value)
//         const matchType = selectedType.value === 'all' || t.type === selectedType.value
//         const dateObj = new Date(t.date)
//         const matchStart = startDate.value ? dateObj >= new Date(startDate.value) : true
//         const matchEnd = endDate.value ? dateObj <= new Date(endDate.value) : true
//         return matchSearch && matchType && matchStart && matchEnd
//     })
// })

const filteredData = computed(() => {
    return allData.value.filter(item => {
        const s = search.value.toLowerCase()
        const matchSearch = item.name.toLowerCase().includes(s) || item.phone.includes(s)
        const matchType = selectedType.value === 'all' || item.type === selectedType.value

        const dateObj = new Date(item.date)
        const matchStart = startDate.value ? dateObj >= calendarDateToJS(startDate.value)! : true
        const matchEnd = endDate.value ? dateObj <= calendarDateToJS(endDate.value)! : true

        return matchSearch && matchType && matchStart && matchEnd
    })
})

const columns: TableColumn<Transaction>[] = [
    {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ row }) => `#${row.getValue('id')}`
    },
    {
        accessorKey: 'type',
        header: 'ประเภท',
        cell: ({ row }) => {
            const color = {
                deposit: 'success' as const,
                withdrawal: 'error' as const,
            }[row.getValue('type')]
            return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () =>
                row.getValue('type') === 'deposit' ? 'ฝาก' : 'ถอน'
            )
        }
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
    }
]

const pagination = ref({
    pageIndex: 0,
    pageSize: 10
})


const exportCSV = () => {
    const escape = (str: string) => `"${String(str).replace(/"/g, '""')}"`

    const rows = filteredData.value.map(row => [
        row.id,
        row.type === 'deposit' ? 'ฝาก' : 'ถอน',
        row.name,
        row.phone = '0' + row.phone,
        row.amount.toLocaleString('th-TH'),
        row.status === 'success' ? 'สำเร็จ' : row.status === 'pending' ? 'รอดำเนินการ' : 'ล้มเหลว',
        new Date(row.date).toLocaleString('th-TH')
    ])

    const header = ['ID', 'ประเภท', 'ชื่อ', 'เบอร์โทร', 'จำนวนเงิน', 'สถานะ', 'วันที่']

    const csvContent =
        '\uFEFF' +
        [header, ...rows]
            .map(row => row.map(cell => escape(cell)).join(','))
            .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `รายงาน_ฝาก_ถอน_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

const exportPDF = () => {
    const doc = new jsPDF()
    doc.addFileToVFS('THSarabunNew-normal.ttf', THSarabunNew_normal);
    doc.addFont('THSarabunNew-normal.ttf', 'THSarabunNew', 'normal');
    doc.setFont('THSarabunNew', 'normal');
    doc.setFontSize(16);
    doc.text('รายงานการฝาก-ถอน', 14, 16)

    const tableBody = filteredData.value.map(row => [
        row.id,
        row.type === 'deposit' ? 'ฝาก' : 'ถอน',
        row.name,
        row.phone,
        new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(row.amount),
        row.status === 'success' ? 'สำเร็จ' : row.status === 'pending' ? 'รอดำเนินการ' : 'ล้มเหลว',
        new Date(row.date).toLocaleString('th-TH', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        })
    ]);

    autoTable(doc, {
        startY: 25,
        head: [['ID', 'ประเภท', 'ชื่อ', 'เบอร์โทร', 'จำนวนเงิน', 'สถานะ', 'วันที่']],
        body: tableBody,
        theme: 'grid',
        headStyles: { fillColor: '#1e293b', font: 'THSarabunNew', fontStyle: 'normal' },
        styles: { font: 'THSarabunNew', fontStyle: 'normal', fontSize: 10 }
    });

    doc.save(`รายงาน_ฝาก_ถอน_${Date.now()}.pdf`);
}


</script>

<template>
    <div class="sticky top-[64px] z-10  py-4">
        <div class="flex justify-between items-center">
            <div class="text-4xl sticky top-0 font-medium py-4">รายงานการฝาก-ถอน</div>
            <div>
                <UButton @click="exportCSV" variant="soft" icon="i-lucide-calendar" color="success" class="mr-4">
                    export csv
                </UButton>
                <UButton icon="i-heroicons-document-arrow-down" color="error" @click="exportPDF">
                    ดาวน์โหลด PDF
                </UButton>
            </div>

        </div>


        <!-- 🔍 Filter Section -->
        <div class="flex flex-wrap gap-4 items-end">
            <UInput v-model="search" placeholder="ค้นหาชื่อหรือเบอร์" class="w-100" />
            <USelect v-model="selectedType" :items="[
                { label: 'ทั้งหมด', value: 'all' },
                { label: 'ฝาก', value: 'deposit' },
                { label: 'ถอน', value: 'withdrawal' }
            ]" class="w-40" placeholder="ประเภท" />

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
        </div>
    </div>
    <div class="space-y-4">
        <!-- 📊 Table -->
        <div id="pdf-content" class="w-full space-y-4 pb-4 ">
            <UTable ref="table" sticky v-model:pagination="pagination" :data="filteredData" :columns="columns"
                :pagination-options="{ getPaginationRowModel: getPaginationRowModel() }" class="flex-1 max-h-[550]" />

            <div class="flex justify-center border-t border-default pt-4">
                <UPagination :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
                    :items-per-page="table?.tableApi?.getState().pagination.pageSize" :total="filteredData.length"
                    @update:page="(p) => table?.tableApi?.setPageIndex(p - 1)" />
            </div>
        </div>
    </div>
</template>
