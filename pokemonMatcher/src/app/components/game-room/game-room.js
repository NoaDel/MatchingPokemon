const carding = document.querySelectorAll('.memory-card');
let cards[] = carding;
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add('flip');

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;

    return;
  }

  secondCard = this;
  checkForMatch();
}

checkForMatch() {
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;

  isMatch ? disableCards() : unflipCards();
}

disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);

  resetBoard();
}

flipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');

    resetBoard();
  }, 1500);
}

resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

shuffle() {
  console.log(carding);
  carding.slice(12);
  carding.forEach(card => {
    let randomPos = Math.floor(Math.random() * 12);
  });
}

carding.forEach(card => card.addEventListener('click', flipCard));
