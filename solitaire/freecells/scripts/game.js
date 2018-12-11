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
        if (index < 0) {
            index = desk[pile].length + index;
        }
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
            // Call callback with the current context. Break out of the loop if it returns true.
            if (callback.call(this, source(m), destination(m))) {
                break;
            }
        }
    }

    function forEachLocus(callback) {
        for (let i = 0; i < DESK_SIZE; i++) {
            const length = desk[i].length;
            // Call callback with the current context. Break out of the loop if it returns true.
            if (callback.call(this, i, length > 0 ? desk[i][length - 1] : -1)) {
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
        const cards = Cards.deck(number);

        for (let i = 0; i < cards.length; i++) {
            desk[PILE_START + (i % PILE_NUM)].push(cards[i]);
        }

        getMoves();
        if (this.ondeal) {
            this.ondeal(cards);
        }
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

    function isTableau(cardA, cardB) {
        return Cards.rank(cardA) == ((Cards.rank(cardB) + 1) % RANK_NUM)
            && (Cards.suit(cardA) & 1) != (Cards.suit(cardB) & 1);
    }

    function tableauLengthAt(pile) {
        const cascade = desk[pile];
        const length = cascade.length;
        for (let i = length; i-- > 1;) {
            const c1 = cascade[i];
            const s1 = c1 % SUIT_NUM;
            const r1 = (c1 - s1) / SUIT_NUM;

            const c2 = cascade[i - 1];
            const s2 = c2 % SUIT_NUM;
            const r2 = (c2 - s2) / SUIT_NUM;

            if (!(r2 == ((r1 + 1) % RANK_NUM) && (s2 & 1) != (s1 & 1))) {
                return length - i;
            }
        }

        return length;
    }

    function buildTableauFrom(card) {
        const tableau = [];
        tableau.push(card);
        for (let i = PILE_START; i < PILE_END; i++) {
            const pile = desk[i];
            let j = pile.indexOf(card);
            if (j >= 0) {
                while (++j < pile.length && isTableau(card, pile[j])) {
                    card = pile[j];
                    tableau.push(card);
                }
                break;
            }
        }
        return tableau;
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
        tableauLengthAt: tableauLengthAt,
        buildTableauFrom: buildTableauFrom,
        forEachLocus: forEachLocus,

        isMoveValid: isMoveValid,
        forEachMove: forEachMove
    };
}
