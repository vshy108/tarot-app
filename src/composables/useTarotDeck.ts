import { tarotDeck } from '@/data/tarotDeck'
import type { TarotCard } from '@/data/tarotDeck'

export interface TarotCardWithId extends TarotCard {
    id: string
}

export function useTarotDeck(): TarotCardWithId[] {
    return Object.entries(tarotDeck).map(([id, card]) => ({
        id,
        ...card,
    }))
}