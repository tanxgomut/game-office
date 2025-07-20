export default defineAppConfig({
    toaster: {
        position: 'top-center' as const,
        expand: true,
        duration: 3000
    },
    ui: {
        colors: {
            primary: 'sky',
            error: 'rose',
            info: 'sky',
            neutral: 'zinc',
            warning: 'yellow',
            secondary: 'pink'
        },
        theme: {
            colors: ['primary', 'error', 'info', 'neutral', 'warning', 'secondary']
        },
        modal: {
            slots: {
                header: 'flex justify-center items-center gap-1.5 p-4 sm:px-6 min-h-16 border-none'
            }
        }
    }
})
