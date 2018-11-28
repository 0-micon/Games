const SUITS = 'SDCH';
const RANKS = 'A23456789TJQK';

const SUIT_NUM = SUITS.length;
const RANK_NUM = RANKS.length;
const CARD_NUM = SUIT_NUM * RANK_NUM;

// Cards:
// Card index is defined as: suit + rank * SUIT_NUM
function Desk(pileNum, cellNum, baseNum) {
    this.piles = [];
    for (let i = 0; i < pileNum; i++) {
        this.piles.push([]);
    }

    this.cells = new Array(cellNum);
    this.bases = new Array(baseNum);
}

Desk.prototype.toString = function () {
    return JSON.stringify(this);
};

Desk.prototype.toJSON = function () {
    // Note: Cards in the free cells can be deduced so we don't save them.
    let a = this.piles.map(x => JSON.stringify(x));
    a.sort();   // to invariant
    a.push(JSON.stringify(this.bases));
    return JSON.stringify(a);
};


Desk.prototype.clear = function () {
    for (let i = 0; i < this.piles.length; i++) {
        this.piles[i].length = 0;
    }

    this.cells.length = 0;
    this.bases.length = 0;
};

Desk.prototype.deal = function (number) {
    this.clear();

    // use LCG algorithm to pick up cards from the deck
    // http://en.wikipedia.org/wiki/Linear_congruential_generator
    const m = Math.pow(2, 31);
    const a = 1103515245;
    const c = 12345;

    const done = {};
    for (let i = 0; i < CARD_NUM; i++) {
        number = (a * number + c) % m;

        let card = number % CARD_NUM;
        while (done[card]) {
            card = (card + 1) % CARD_NUM;
        }
        this.piles[i % this.piles.length].push(card);
    }
};
