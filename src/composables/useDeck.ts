// File: src/composables/useDeck.ts

import { deck } from '@/data/deck'
import type { Card } from '@/data/deck'

export interface CardWithId extends Card {
    id: string
    type: 'Major' | 'Minor'
    suit?: 'Cups' | 'Swords' | 'Wands' | 'Pentacles'
    rank?: 'Ace' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'Page' | 'Knight' | 'Queen' | 'King'
}

export interface DrawnCard extends CardWithId {
    orientation: 'upright' | 'reversed'
}

export function useDeck(): CardWithId[] {
    return Object.entries(deck).map(([id, card]) => {
        const isMajor = id.startsWith('MAJ')

        if (isMajor) {
            return {
                id,
                ...card,
                type: 'Major'
            }
        }

        const [suitCode, rankCode] = id.split('-')

        const suitMap: Record<string, CardWithId['suit']> = {
            W: 'Wands',
            C: 'Cups',
            S: 'Swords',
            P: 'Pentacles'
        }

        const rankMap: Record<string, CardWithId['rank']> = {
            '01': 'Ace',
            '02': '2',
            '03': '3',
            '04': '4',
            '05': '5',
            '06': '6',
            '07': '7',
            '08': '8',
            '09': '9',
            '10': '10',
            PAGE: 'Page',
            KNIGHT: 'Knight',
            QUEEN: 'Queen',
            KING: 'King'
        }

        return {
            id,
            ...card,
            type: 'Minor',
            suit: suitMap[suitCode],
            rank: rankMap[rankCode]
        }
    })
}
