import { deck, type Card } from './deck'

export type TarotSuit = 'Major' | 'Wands' | 'Cups' | 'Swords' | 'Pentacles'
export type TarotRank =
  | '00'
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | '11'
  | '12'
  | '13'
  | '14'
  | '15'
  | '16'
  | '17'
  | '18'
  | '19'
  | '20'
  | '21'
  | 'Ace'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | 'Page'
  | 'Knight'
  | 'Queen'
  | 'King'

export interface TarotCard extends Card {
  id: string
  title: string
  suit: TarotSuit
  rank: TarotRank
  imagePath: string
}

const suitMap: Record<string, Exclude<TarotSuit, 'Major'>> = {
  W: 'Wands',
  C: 'Cups',
  S: 'Swords',
  P: 'Pentacles',
}

const pathPrefixBySuit: Record<Exclude<TarotSuit, 'Major'>, string> = {
  Wands: 'w',
  Cups: 'c',
  Swords: 's',
  Pentacles: 'p',
}

const rankMap: Record<string, TarotRank> = {
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
  KING: 'King',
}

export const tarotInventory: TarotCard[] = Object.entries(deck).map(([id, card]) => {
  const metadata = metadataFor(id, card.name)
  return {
    ...card,
    id,
    title: card.name,
    ...metadata,
  }
})

export const deckInventorySummary = validateTarotInventory(tarotInventory)

function metadataFor(id: string, title: string): Pick<TarotCard, 'suit' | 'rank' | 'imagePath'> {
  if (id.startsWith('MAJ-')) {
    const majorRank = id.slice(4) as TarotRank
    return {
      suit: 'Major',
      rank: majorRank,
      imagePath: `/src/assets/cards/maj-${id.slice(4)}-${slugify(title)}.png`,
    }
  }

  const [suitCode, rankCode] = id.split('-')
  const suit = suitMap[suitCode]
  const rank = rankMap[rankCode]
  if (!suit || !rank) {
    throw new Error(`Unknown tarot card id: ${id}`)
  }

  return {
    suit,
    rank,
    imagePath: `/src/assets/cards/${pathPrefixBySuit[suit]}-${rankCode.toLowerCase()}.png`,
  }
}

function validateTarotInventory(cards: TarotCard[]) {
  const imagePaths = new Set(cards.map((card) => card.imagePath))
  const ids = new Set(cards.map((card) => card.id))
  const missingImages = cards.filter((card) => !card.image)

  if (cards.length !== 78 || ids.size !== 78 || imagePaths.size !== 78 || missingImages.length > 0) {
    throw new Error('Tarot inventory must represent all 78 card images exactly once')
  }

  return {
    cards: cards.length,
    uniqueIds: ids.size,
    uniqueImagePaths: imagePaths.size,
  }
}

function slugify(title: string): string {
  return title.toLowerCase().replaceAll(' ', '-')
}
