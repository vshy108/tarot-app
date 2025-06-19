import { ref, onUnmounted } from 'vue'

export function useSmoothStop(duration = 300) {
    const isStopping = ref(false)
    const isAnimating = ref(false)
    let stopTimeoutId: ReturnType<typeof setTimeout> | null = null

    function triggerSmoothStop(customDuration?: number) {
        isStopping.value = true
        isAnimating.value = true

        if (stopTimeoutId !== null) {
            clearTimeout(stopTimeoutId)
        }

        stopTimeoutId = setTimeout(() => {
            isStopping.value = false
            isAnimating.value = false
            stopTimeoutId = null
        }, customDuration ?? duration)
    }

    onUnmounted(() => {
        if (stopTimeoutId !== null) {
            clearTimeout(stopTimeoutId)
            stopTimeoutId = null
        }
    })

    return {
        isStopping,
        isAnimating,
        triggerSmoothStop,
    }
}
