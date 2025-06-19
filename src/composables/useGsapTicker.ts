// composables/useGsapTicker.ts
import { ref, onUnmounted } from 'vue'
import { gsap } from 'gsap'

export function useGsapTicker(callback: () => void) {
    const isRunning = ref(false)
    let tickerFn: (() => void) | null = null

    function start() {
        if (isRunning.value || tickerFn) return
        tickerFn = () => {
            callback()
        }
        gsap.ticker.add(tickerFn)
        isRunning.value = true
    }

    function stop() {
        if (tickerFn) {
            gsap.ticker.remove(tickerFn)
            tickerFn = null
        }
        isRunning.value = false
    }

    onUnmounted(() => {
        stop()
    })

    return {
        isRunning,
        start,
        stop,
    }
}
