let cards = [
    {number: '1111 2222 3333 4444', date: "11/11", holder: 'Maruf Tairov'},
    {number: '2222 3333 4444 5555', date: "12/12", holder: 'Shoxjahon Rustamov'},
    {number: '3333 4444 5555 6666', date: "09/22", holder: 'Faxriddin Gulomov'},
    {number: '4444 5555 6666 7777', date: "10/25", holder: 'Rustam Teshayev'}
]
console.log(cards)
const plastiks = document.querySelector('.cards')
const plastik = plastiks.querySelector('.plastik')

const showCard = card => {
    let clone = plastik.cloneNode(true)
    plastiks.appendChild(clone)
    clone.classList.remove('is-hidden')

    clone.querySelector('.card-number').textContent = card.number
    clone.querySelector('.card-date').textContent = card.date
    clone.querySelector('.card-holder').textContent = card.holder
}

cards.forEach(card => {
    showCard(card)
})

