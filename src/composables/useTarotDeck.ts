export function useTarotDeck() {
    const cards = import.meta.glob('@/assets/cards/*.png', {
        eager: true,
        import: 'default',
    })

    // Convert to usable array of image URLs
    const cardImages = Object.values(cards)

    return cardImages
}
