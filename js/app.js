/*
 * Create a list that holds all of your cards
 */
const allCards = ['diamond', 'diamond',
                'paper-plane-o', 'paper-plane-o',
                'anchor', 'anchor',
                'bolt', 'bolt',
                'cube', 'cube',
                'leaf', 'leaf',
                'bicycle', 'bicycle',
                'bomb', 'bomb'];
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
function displayCards() {
    const shuffledCards = shuffle(allCards);
    const fragment = document.createDocumentFragment();

    for(let i = 0; i < shuffledCards.length; i++) {
        const card = document.createElement('li');
        card.classList.add('card');
        card.dataset.symbol = shuffledCards[i];
        card.innerHTML = `<i class="fa fa-${shuffledCards[i]}"></i>`;
        fragment.appendChild(card);
    }
    deck.appendChild(fragment);
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

const deck = document.querySelector('.deck');
const moves = document.querySelector('.moves');
const restart = document.querySelector('.restart');
const stars = document.querySelector('.stars');
const timer = document.getElementById('timer');
let openCards = [];
let countStar = 3;
let countMoves = 0;
let matchedCard = 0;
let formattedTime;
let intervalId;

function clickCard(event) {
    const clickedCard = event.target;
    if (clickedCard.classList.contains('show') || clickedCard.nodeName === 'I') {
        return;
    }
    displayCard(clickedCard);
    addCardToList(clickedCard.dataset.symbol);

    if (openCards.length > 1) {
        matchCard(clickedCard.dataset.symbol);
        openCards = [];
        countMoves++;
        renderMoves(countMoves);
        starRaiting();
    }
    if (matchedCard === 8) {
        winGame();
    }
}

function renderMoves(countMoves) {
    moves.textContent = countMoves;
}

function displayCard(card) {
    card.classList.add('show', 'open');
}

function addCardToList(card) {
    openCards.push(card);
}

function matchCard(cardSymbol) {
    const elements = deck.querySelectorAll(`.open`);

    if (openCards[0] === cardSymbol) {
        lockCardOpen(elements);
        matchedCard++;
    } else {
        hideCard(elements);
    }
}

function lockCardOpen(elements) {
    elements.forEach(function(elem) {
        elem.classList.add('match');
        elem.classList.remove('show', 'open');
    });
}

function hideCard(elements) {
    elements.forEach(function(elem) {
        setTimeout(function() {
            elem.classList.remove('show', 'open');
        }, 700);
    });
}

function starRaiting() {
    if (countMoves > 16 && countMoves <= 20) {
        countStar = 2;
    } else if (countMoves > 20 && countMoves <= 24) {
        countStar = 1;
    } else if (countMoves > 24) {
        countStar = 0;
    }
    renderStars(stars, countStar);
}

function renderStars(element, num) {
    const fragment = document.createDocumentFragment();
    for(let i = 0; i < 3; i++) {
        const star = document.createElement('li');
        if(i >= num) {
            star.innerHTML ='<li><i class="fa fa-star-o"></i></li>';
        } else {
            star.innerHTML = '<li><i class="fa fa-star"></i></li>'
        }
        fragment.appendChild(star);
    }
    element.innerHTML = '';
    element.appendChild(fragment);
}

function startTimer() {
    const start = Date.now();
    
    function render() {
        const diff = Date.now() - start;
        const millis = Math.floor(diff/1000)%60;
        const minutes = Math.floor(diff/60000);
        formattedTime = `${minutes > 9 ? minutes : '0' + minutes}:${millis > 9 ? millis  : '0' + millis}`;
        timer.textContent = formattedTime;
    }
    
    intervalId = setInterval(render, 1000);
}

function winGame() {
    const endStars = document.createElement('ul');
    endStars.classList.add('stars');
    renderStars(endStars, countStar);
    clearInterval(intervalId);
    swal({
        title: 'Congratulation!',
        text: `You spent ${formattedTime}\nYou've earned`,
        content: endStars,
        icon: 'success',
        button: {
            text: 'Play again!'
        },
        closeOnEsc: false,
        closeOnClickOutside: false
    }).then(function() {
        startTimer();
        startNewGame();
    })
}

function startNewGame() {
    deck.innerHTML = '';
    timer.textContent = '00:00';
    countMoves = 0;
    countStar = 3;
    matchedCard = 0;
    openCards = [];
    clearInterval(intervalId);
    startTimer();
    displayCards();
    renderMoves(0);
    starRaiting();
}

startNewGame();

deck.addEventListener('click', clickCard);
restart.addEventListener('click', startNewGame);