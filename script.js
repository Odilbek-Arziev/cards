let cards = JSON.parse(localStorage.getItem('cards')) ?? []
let form = document.querySelector('form')
let cardsContainer = document.querySelector('.cards')
let cardElement = cardsContainer.firstElementChild
let modal = document.querySelector('.modal')
let editingCard;

const modalClose = modal.querySelector('.modal-close')
const modalContent = modal.querySelector('.content')
const buttons = modal.querySelector('.buttons')
const button = buttons.querySelector('button')

form.addEventListener('submit', (event) => {
    event.preventDefault()

    let hasCard = validate(form.number.value)
    let isValidPhoneNumber = phoneCounter(form.phone.value)

    if (form.number.value.length !== 19)
        return showModal('Некорректный номер карты')

    if (!new RegExp('^([А-ЯA-Z][а-яa-z]+ ?){2}$').test(form.holder.value)) {
        form.holder.classList.add('is-danger')
        return showModal('Имя введено некорректно')
    }

    if (!new RegExp('^(0\d)|(1[12])/(24|2[5-9])|(3[1-4])$').test(form.date.value)) {
        form.date.classList.add('is-danger')
        return showModal('Дата введена некорректно')
    }
    if (form.password.value.length !== 4) {
        form.password.classList.add('is-danger')
        return showModal('Введите 4-х значный пароль')
    }

    if (!hasCard && editingCard && isValidPhoneNumber) {
        cards = cards.map((card) => {
            if (card.number == editingCard.number) {
                card.number = form.number.value
                card.date = form.date.value
                card.holder = form.holder.value
                card.phone = form.phone.value
            }
            return card
        })
        save()

        let thisCard = document.getElementById(editingCard.id)

        thisCard.querySelector('.card-number').textContent = form.number.value
        thisCard.querySelector('.card-holder').textContent = form.holder.value
        thisCard.querySelector('.card-date').textContent = form.date.value

        form.reset()

        editingCard = null
    } else if (!hasCard && isValidPhoneNumber) {
        let newCard = {
            id: new Date().getTime(),
            number: form.number.value,
            date: form.date.value,
            holder: form.holder.value,
            phone: form.phone.value,
            password: form.password.value && 1111,
            active: true,
            cvv: getRandomInt(100, 999)
        }

        showCard(newCard)
        cards.push(newCard)
        save()

        form.reset()
        form.number.classList.remove('is-danger')
    }
    counter()
    form.querySelectorAll('input').forEach((input) =>
        input.classList.remove('is-danger'))
})

function phoneCounter(phoneNumber) {
    let phoneNumberQuantity = cards.filter((card) => card.phone == phoneNumber).length

    if (phoneNumberQuantity > 2 && phoneNumber === editingCard.phone) {
        return true
    }
    if (phoneNumberQuantity > 2) {
        showModal('По этому номеру уже добавлены 3 карты')
        form.phone.classList.add('is-danger')
        form.phone.focus()
        return false
    }
    return true
}

function validate(cardNumber) {
    let hasCard = cards.find((card) => card.number === cardNumber)

    if (hasCard && editingCard && editingCard.number == hasCard.number) {
        return false
    } else if (hasCard) {
        showModal('Такая карта уже добавлена')
        form.number.classList.add('is-danger')
        form.number.focus()
        return true
    }
    return false
}

function showCard(card) {
    let clone = cardElement.cloneNode(true)

    clone.setAttribute('id', card.id)

    clone.querySelector('.card-number').textContent =
        card.number
    clone.querySelector('.card-date').textContent =
        card.date
    clone.querySelector('.card-holder').textContent =
        card.holder

    clone.querySelector('.active-text').textContent =
        card.active ? 'Активирована' : 'Не активирована'

    clone.querySelector('#activate').textContent =
        card.active ? "Дезактивировать карту" : "Активировать карту"

    clone.querySelector('#activate').dataset.action =
        card.active ? "deactivate" : "activate"

    clone.querySelector('.flip').dataset.side = 'front'
    clone.querySelector('.show-cvv').dataset.id = card.id

    clone.querySelectorAll('.dropdown-item')
        .forEach((dropdownItem) => dropdownItem.dataset.id = card.id)

    clone.classList.remove('is-hidden')
    cardsContainer.append(clone)
}

function toggleSpace(cardNumber) {
    return cardNumber.split(' ').join('')
}

function close() {
    modal.classList.remove('is-active')

    modalContent.innerHTML = ''
    button.textContent = ''
    buttons.classList.remove('is-hidden')
    modal.classList.remove('has-text-centered')

    window.onkeydown = () => { }
}

function showModal(innerContent, buttonText, handler) {
    modal.classList.add('is-active')

    switch (typeof innerContent) {
        case 'object':
            modalContent.append(innerContent)
            buttons.classList.add('is-hidden')
            window.onkeydown = (event) => {
                if (event.key == 'Escape') close()
            }
            break
        case 'string':
            modalContent.textContent = innerContent
            modal.classList.add('has-text-centered')
            button.textContent = buttonText ?? 'Ок'

            button.onclick = handler ? handler : close

            window.onkeydown = (event) => {
                if (handler && event.key == 'Enter') handler()
                else close()
            }
    }
    modalClose.onclick = close
}

function save() {
    localStorage.setItem('cards', JSON.stringify(cards))
}

function deleteCard(id) {
    const thisCard = document.getElementById(id)
    const cardNumber = thisCard.querySelector('.card-number').textContent

    showModal(`Подтвердите удаление карты c номером ${cardNumber}`,
        'Да',
        () => {
            cards = cards.filter((card) => card.id != id)

            save()
            document.getElementById(id).remove()
            close()
            counter()
        })
}

function editCard(id) {
    let thisCard = cards.find((card) => card.id == id)

    form.number.value = thisCard.number
    form.holder.value = thisCard.holder
    form.date.value = thisCard.date
    form.phone.value = thisCard.phone

    editingCard = thisCard

    const cancelButton = form.querySelector('.button.is-danger')
    cancelButton.classList.remove('is-hidden')

    cancelButton.addEventListener('click', (event) => {
        cancelButton.classList.add('is-hidden')
        form.reset()
        editingCard = null
    })
}

function counter() {
    document.querySelector('.counter').textContent = cards.length
}

function resetPassword(id) {
    const fields = [
        { label: 'Укажите старый пароль', name: 'oldPassword', type: 'password' },
        { label: 'Придумайте новый пароль', name: 'newPassword1', type: 'password' },
        { label: 'Повторите новый пароль', name: 'newPassword2', type: 'password' },
    ]

    const form = generateForm(fields)
    showModal(form, 'Закрыть')

    const currentCard = cards.find((card) => card.id == id)

    form.addEventListener('submit', (event) => {
        event.preventDefault()

        let oldPassword = form.oldPassword
        let newPassword1 = form.newPassword1
        let newPassword2 = form.newPassword2

        oldPassword.nextSibling.textContent =
            oldPassword.value != currentCard.password
                ? 'Старый пароль введен неверно' : ''

        newPassword1.nextSibling.textContent =
            currentCard.password == newPassword1.value
                ? 'Введите новый пароль. Такой пароль уже установлен'
                : ''
        newPassword2.nextSibling.textContent =
            newPassword1.value != newPassword2.value
                ? 'Пароли не совпадают' : ""

        const isOkay = [...form.querySelectorAll('.help')]
            .every((element) => element.textContent.length == 0)
            && [...form.querySelectorAll('.help')]
                .every((element) => element.textContent.length == 0)


        if (isOkay) {
            cards = cards.map((card) =>
                card === currentCard
                    ? { ...card, password: newPassword1.value }
                    : card
            )
            save()
            close()
            form.reset()
        }
    })
}

function generateForm(fields) {
    const form = document.createElement('form')

    fields.forEach((field) => {
        const fieldElement = document.createElement('div')
        fieldElement.className = 'field'

        const fieldLabel = document.createElement('label')
        fieldLabel.textContent = field.label
        fieldLabel.className = 'label'
        fieldElement.append(fieldLabel)

        const input = document.createElement('input')
        input.classList.add('input')
        input.name = field.name
        input.type = field.type

        IMask(input, { 'mask': '0000' })
        fieldElement.append(input)

        const help = document.createElement('help')
        help.className = 'help is-danger'
        fieldElement.append(help)

        form.append(fieldElement)
    })
    const button = document.createElement('button')
    button.textContent = 'Отправить'
    button.className = 'button is-success'

    form.append(button)

    return form
}

function toggleActive(id, action) {
    let currentCardElement = document.getElementById(id)
    const dropdownItem = currentCardElement.querySelector('#activate')

    switch (action) {
        case 'deactivate':
            const fields = [{
                'label': 'Введите пароль карты',
                type: 'password',
                name: 'password'
            }]
            const form = generateForm(fields)
            showModal(form, 'Изменение пароля карты')

            form.addEventListener('submit', (event) => {
                event.preventDefault()
                const cardPassword = form.querySelector('input').value
                const correctPassword = cards.find((card) => card.id == id).password

                if (cardPassword != correctPassword) {
                    form.password.nextSibling.textContent = 'Пароль введен неверно'
                    return
                }

                currentCardElement.querySelector('.active-text')
                    .textContent = 'Не активирована'

                cards = cards.map((card) =>
                    card.id == id
                        ? { ...card, active: false }
                        : card
                )
                dropdownItem.textContent = 'Активировать карту'
                dropdownItem.dataset.action = 'activate'

                save()
                close()
            })

            break
        case 'activate':
            const formFields = [
                { label: 'Введите последние 4 цифры номера телефона', type: 'number', name: 'phone' },
                { label: 'Введите пароль от карты', type: 'password', name: 'password' }
            ]
            const activateForm = generateForm(formFields)
            showModal(activateForm)

            activateForm.addEventListener('submit', (event) => {
                event.preventDefault()

                const currentCardObject = cards.find((card) => card.id == id)
                const lastDigits = currentCardObject.phone.slice(11, 16).split('-').join('')
                const password = currentCardObject.password

                const lastDigitsInput = activateForm.phone
                const passwordInput = activateForm.password

                lastDigitsInput.nextSibling.textContent =
                    lastDigitsInput.value != lastDigits ? 'Неверные 4 цифры номера телефона' : ''
                passwordInput.nextSibling.textContent =
                    passwordInput.value != password ? 'Неверный пароль' : ''

                cards = cards.map((card) => card.id == id ? { ...card, active: true } : card)

                currentCardElement.querySelector('.active-text').textContent = 'Активирована'
                dropdownItem.textContent = 'Дезактивировать карту'
                dropdownItem.dataset.action = 'deactivate'

                save()
                close()
            })
    }
}
function flip(id) {
    let thisCard = document.getElementById(id).querySelector('.credit-card')
    thisCard.classList.toggle('is-flipped')
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function toggleCVV(id) {
    const thisCard = cards.find((card) => card.id == id)
    const cvv = thisCard.cvv
    const cvvElement = document.getElementById(id).querySelector('.cvv')
    const button = cvvElement.nextElementSibling

    const formFields = [{
        label: 'Введите пароль от карты',
        type: 'password',
        name: 'password'
    }]

    if (parseInt(cvvElement.textContent)) {
        cvvElement.textContent = '***'
        button.textContent = 'Показать'
        return
    }

    const form = generateForm(formFields)
    showModal(form)

    form.addEventListener('submit', (event) => {
        event.preventDefault()

        if (form.password.value != thisCard.password) {
            form.password.nextSibling.textContent = 'Неверный пароль'
            return
        }
        cvvElement.textContent = cvv
        close()
        cvvElement.nextElementSibling.textContent = 'Скрыть'
    })
}


document.addEventListener('DOMContentLoaded', counter)

cards.forEach((card) => showCard(card))

IMask(form.number, { mask: '0000 0000 0000 0000' })
IMask(form.date, { mask: '00/00' })
IMask(form.phone, { mask: '+{7}(000)000-00-00' })
IMask(form.password, { mask: '0000' })

// после завершения редактирования необходимо убрать кнопку отмена
// при редактировании выводить текущий пароль
// не работает первоначальная установка пароля
