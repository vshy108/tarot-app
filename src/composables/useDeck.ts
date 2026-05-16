import { tarotInventory } from '@/data/inventory'
import type { TarotCard } from '@/data/inventory'

export interface CardWithId extends TarotCard {
    type: 'Major' | 'Minor'
}

export interface DrawnCard extends CardWithId {
    orientation: 'upright' | 'reversed'
}

export function useDeck(): CardWithId[] {
    return tarotInventory.map((card) => ({
        ...card,
        type: card.suit === 'Major' ? 'Major' : 'Minor',
    }))
}

export interface ScatteredCard extends CardWithId {
    angle: number
    radius: number
    speed: number
    x: number
    y: number
    rotate: number
    orientation: 'upright' | 'reversed' | null
    revealed: boolean
}

export interface CollectedCard extends DrawnCard, Omit<ScatteredCard, keyof CardWithId | 'orientation'> { }
