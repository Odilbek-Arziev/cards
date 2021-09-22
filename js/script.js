let cards = [
    {number: '1111 2222 3333 4444', date: "11/11", holder: 'Maruf Tairov'},
    {number: '2222 3333 4444 5555', date: "12/12", holder: 'Shoxjahon Rustamov'},
    {number: '3333 4444 5555 6666', date: "09/22", holder: 'Faxriddin Gulomov'},
    {number: '4444 5555 6666 7777', date: "10/25", holder: 'Rustam Teshayev'}
]
console.log(cards)

const plastiks = document.querySelector('.cards')
const plastik = plastiks.querySelector('.plastik')
let form = document.querySelector('form')


const showCard = card => {
    let clone = plastik.cloneNode(true)
    plastiks.appendChild(clone)
    clone.classList.remove('is-hidden')

    let id = toggleSpace(card.number)
    clone.setAttribute('id', id)
    //
    clone.querySelector('.card-number').textContent = card.number
    clone.querySelector('.card-date').textContent = card.date
    clone.querySelector('.card-holder').textContent = card.holder
    clone.querySelector('#delete').dataset.id = id
    clone.querySelector('#edit').dataset.id = id
}

const toggleSpace = cardNumber => {
    if (cardNumber.length !== 19) {
        console.error('This function is only for card number!')
        return
    }

    return cardNumber.split(' ').join('')
}

cards.forEach(card => {
    showCard(card)
})

IMask(form.number, {mask: '0000 0000 0000 0000'})
IMask(form.date, {mask: '00/00'})

