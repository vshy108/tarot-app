import type { TarotCard, TarotSuit } from './inventory'

export const majorArcanaPrompts: Record<string, string> = {
  'MAJ-00': 'A fresh threshold, a leap of trust, and the question of what wants to begin.',
  'MAJ-01': 'Skill, focus, and the tools already at hand.',
  'MAJ-02': 'Inner knowing, silence, and the pattern beneath the obvious.',
  'MAJ-03': 'Care, abundance, embodiment, and creative growth.',
  'MAJ-04': 'Structure, protection, authority, and the shape that holds the work.',
  'MAJ-05': 'Tradition, teaching, shared values, and chosen guidance.',
  'MAJ-06': 'Choice, attraction, alignment, and honest relationship.',
  'MAJ-07': 'Direction, willpower, and bringing motion under command.',
  'MAJ-08': 'Courage, patience, and strength that does not need force.',
  'MAJ-09': 'Solitude, study, and the lamp carried inward.',
  'MAJ-10': 'A turn of the wheel, timing, and changing conditions.',
  'MAJ-11': 'Fairness, accountability, and the balance of cause and effect.',
  'MAJ-12': 'Pause, surrender, and the perspective that arrives when striving stops.',
  'MAJ-13': 'Closure, release, and transformation that clears the field.',
  'MAJ-14': 'Integration, moderation, and the slow art of blending opposites.',
  'MAJ-15': 'Attachment, temptation, and the contract that can be renegotiated.',
  'MAJ-16': 'Disruption, revelation, and truth breaking through weak structures.',
  'MAJ-17': 'Hope, renewal, and a wider sky after difficulty.',
  'MAJ-18': 'Dreams, uncertainty, instinct, and the road through ambiguity.',
  'MAJ-19': 'Clarity, vitality, joy, and the confidence to be seen.',
  'MAJ-20': 'Awakening, reckoning, and the call to answer differently.',
  'MAJ-21': 'Completion, integration, and stepping through the finished circle.',
}

export const suitPrompts: Record<Exclude<TarotSuit, 'Major'>, string> = {
  Wands: 'Energy, initiative, desire, and the courage to act.',
  Cups: 'Feeling, relationship, intuition, and emotional truth.',
  Swords: 'Thought, conflict, language, and decisions that need clarity.',
  Pentacles: 'Body, work, money, craft, and what can be made tangible.',
}

export function readingPrompt(card: TarotCard): string {
  if (card.suit === 'Major') {
    return majorArcanaPrompts[card.id] ?? 'A major turning point asks for attention.'
  }

  return suitPrompts[card.suit]
}
