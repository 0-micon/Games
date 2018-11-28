const SUITS = 'SDCH';
const RANKS = 'A23456789TJQK';

const SUIT_NUM = SUITS.length;
const RANK_NUM = RANKS.length;
const CARD_NUM = SUIT_NUM * RANK_NUM;

// Cards:
// Card index is defined as: suit + rank * SUIT_NUM
function indexToCard(index) {
    if (index < 0) {
        return '--';
    } else {
        const suit = index % SUIT_NUM;
        const rank = Math.floor(index / SUIT_NUM);
        return '' + RANKS[rank % RANK_NUM] + SUITS[suit];
    }
}

function cardsToString(array) {
    let buf = '[';
    let prefix = '';
    for (let i = 0; i < array.length; i++) {
        buf += prefix + indexToCard(array[i]);
        prefix = ',';
    }
    buf += ']';
    return buf;
}

function Desk(pileNum, cellNum, baseNum) {
    this.piles = [];
    for (let i = 0; i < pileNum; i++) {
        this.piles.push([]);
    }

    this.cells = new Array(cellNum);
    this.bases = new Array(baseNum);
    this.clear();
}

Desk.prototype.getCellIndex = function () {
    for (let i = 0; i < this.cells.length; i++) {
        if (this.cells[i] < 0) {
            return i;
        }
    }
    return -1;
};

Desk.prototype.getBaseIndex = function (card) {
    const suit = card % SUIT_NUM;
    const rank = Math.floor(card / SUIT_NUM);
    for (let i = suit; i < this.bases.length; i += suit) {
        if (rank - this.bases[i] == 1) {
            return i;
        }
    }
    return -1;
};

Desk.prototype.toMove = function (source, destination) {
    return source * (this.piles.length + 2) + destination;
};

Desk.prototype.toCell = function (source) {
    return this.toMove(source, this.piles.length + 0);
};

Desk.prototype.toBase = function (source) {
    return this.toMove(source, this.piles.length + 1);
};

Desk.prototype.toString = function () {
    let buf = 'bases: ' + cardsToString(this.bases)
        + ' cells: ' + cardsToString(this.cells)
        + ' piles: [';
    let prefix = '';
    for (let i = 0; i < this.piles.length; i++) {
        buf += prefix + cardsToString(this.piles[i]);
        prefix = ',';
    }
    buf += ']';
    return buf;
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

    this.cells.fill(-1);
    this.bases.fill(-1);
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
        done[card] = true;
        this.piles[i % this.piles.length].push(card);
    }
};

Desk.prototype.getMoves = function () {
    const moves = [];

    return moves;
};
