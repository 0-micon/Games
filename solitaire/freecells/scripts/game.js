function newGame(pileNum, cellNum, baseNum) {
    const RANK_NUM = Cards.RANK_NUM;
    const SUIT_NUM = Cards.SUIT_NUM;
    const CARD_NUM = Cards.CARD_NUM;

    const PILE_NUM = pileNum; // cascades
    const CELL_NUM = cellNum; // open cells
    const BASE_NUM = baseNum; // foundation piles
    const DESK_SIZE = PILE_NUM + CELL_NUM + BASE_NUM;

    const PILE_START = 0;
    const PILE_END = PILE_START + PILE_NUM;

    const BASE_START = PILE_END;
    const BASE_END = BASE_START + BASE_NUM;

    const CELL_START = BASE_END;
    const CELL_END = CELL_START + CELL_NUM;

    const moves = [];
    const desk = new Array(DESK_SIZE);
    for (let i = 0; i < DESK_SIZE; i++) {
        desk[i] = [];
    }

    function clear() {
        for (let i = 0; i < DESK_SIZE; i++) {
            desk[i].length = 0;
        }
        moves.length = 0;
    }

    function cardAt(pile, index) {
        return desk[pile][index];
    }

    function isPile(index) {
        return index >= PILE_START && index < PILE_END;
    }

    function isBase(index) {
        return index >= BASE_START && index < BASE_END;
    }

    function isCell(index) {
        return index >= CELL_START && index < CELL_END;
    }

    function action(source, destination) {
        return source * DESK_SIZE + destination;
    }

    function source(action) {
        return Math.floor(action / DESK_SIZE);
    }

    function destination(action) {
        return action % DESK_SIZE;
    }

    function isMoveValid(source, destination) {
        return moves.indexOf(action(source, destination)) >= 0;
    }

    function forEachMove(callback) {
        for (let i = 0; i < moves.length; i++) {
            const m = moves[i];
            if (callback(source(m), destination(m))) {
                break;
            }
        }
    }

    function getMoves() {
        moves.length = 0;

        for (let i = 0; i < DESK_SIZE; i++) {
            const src = desk[i];
            if (src.length > 0) {
                const card = src[src.length - 1];
                const suit = card % SUIT_NUM;
                const rank = (card - suit) / SUIT_NUM;

                for (let j = 0; j < DESK_SIZE; j++) {
                    if (i != j) {
                        const dst = desk[j];

                        if (j >= BASE_START && j < BASE_END) {
                            if (j - BASE_START == suit && dst.length == rank) {
                                // 1. Can move to the foundation.
                                moves.push(action(i, j));
                            }
                        } else if (j >= CELL_START && j < CELL_END) {
                            if (dst.length == 0) {
                                // 2. Can move to an empty cell.
                                moves.push(action(i, j));
                            }
                        } else if (j >= PILE_START && j < PILE_END) {
                            if (dst.length == 0) {
                                // 3. Can move to an empty space.
                                moves.push(action(i, j));
                            } else {
                                // 4. Can move to a tableau. It should be built down in alternating colors.
                                const c = dst[dst.length - 1];
                                const s = c % SUIT_NUM;
                                const r = (c - s) / SUIT_NUM;
                                if (r == ((rank + 1) % RANK_NUM) && (s & 1) != (suit & 1)) {
                                    moves.push(action(i, j));
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    function deal(number) {
        clear();

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
            const dst = PILE_START + (i % PILE_NUM);
            desk[dst].push(card);
            if (this.onmove) {
                this.onmove(card, -1, dst);
            }
        }

        getMoves();
    }

    function moveCard(source, destination) {
        const card = desk[source].pop();
        desk[destination].push(card);
        getMoves();

        if (this.onmove) {
            this.onmove(card, source, destination);
        }
    }

    function numberOfCardsAt(pile) {
        return desk[pile].length;
    }

    return {
        // Constants:
        RANK_NUM: RANK_NUM,
        SUIT_NUM: SUIT_NUM,
        CARD_NUM: CARD_NUM,

        PILE_NUM: PILE_NUM,
        CELL_NUM: CELL_NUM,
        BASE_NUM: BASE_NUM,
        DESK_SIZE: DESK_SIZE,

        PILE_START: PILE_START,
        PILE_END: PILE_END,

        BASE_START: BASE_START,
        BASE_END: BASE_END,

        CELL_START: CELL_START,
        CELL_END: CELL_END,

        // Methods:
        isBase: isBase,
        isCell: isCell,
        isPile: isPile,

        deal: deal,
        moveCard: moveCard,
        numberOfCardsAt: numberOfCardsAt,
        cardAt: cardAt,

        isMoveValid: isMoveValid,
        forEachMove: forEachMove
    };
}
