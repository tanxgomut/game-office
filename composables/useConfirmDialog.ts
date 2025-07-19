import type { alertItem } from '@/types/dialog/alert'

const isOpen = ref(false)
const options = ref<alertItem>({
  title: '',
  message: '',
  icon: 'info',
})

let resolvePromise: ((value: boolean) => void) | null = null

export function useConfirmDialog() {
  function showDialog(item: alertItem): Promise<boolean> {
    if (isOpen.value) return Promise.resolve(false)

    options.value = item
    isOpen.value = true

    return new Promise((resolve) => {
      resolvePromise = resolve
    })
  }

  function confirm() {
    isOpen.value = false
    resolvePromise?.(true)
    resolvePromise = null
  }

  function cancel() {
    isOpen.value = false
    resolvePromise?.(false)
    resolvePromise = null
  }

  return {
    isOpen,
    options,
    showDialog,
    confirm,
    cancel,
  }
}
