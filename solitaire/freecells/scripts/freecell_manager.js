function createFreecellManager(pileNum, cellNum, baseNum) {
    const basis = createFreecellBasis(pileNum, cellNum, baseNum);
    const desk = basis.createDesk();
    const back = basis.createDesk();

    const moves = [];

    function getMoves() {
        moves.length = 0;
        desk.getMoves(moves);
    }

    function isMoveValid(source, destination) {
        return moves.indexOf(basis.toMove(source, destination)) >= 0;
    }

    function forEachMove(callback) {
        for (let i = 0; i < moves.length; i++) {
            const m = moves[i];
            // Call callback with the current context. Break out of the loop if it returns true.
            if (callback.call(this, basis.toSource(m), basis.toDestination(m))) {
                break;
            }
        }
    }

    function deal(number) {
        const cards = desk.deal(number);
        getMoves();
        //if (this.ondeal) {
        //    this.ondeal(cards);
        //}
        return cards;
    }

    function moveCard(source, destination) {
        desk.moveCard(source, destination);
        getMoves();

        if (this.onmove) {
            this.onmove(desk.cardAt(destination, -1), source, destination);
        }
    }

    // Returns how many cards you can move to the destination.
    function solveMove(from, to) {
        const destinations = [to];
        if (desk.numberOfCardsAt(to) == 0) {
            if (basis.isPile(to)) {
                for (let i = basis.PILE_START; i < basis.PILE_END; i++) {
                    if (i != to && desk.numberOfCardsAt(i) == 0) {
                        destinations.push(i);
                    }
                }
            } else if (basis.isCell(to)) {
                for (let i = basis.CELL_START; i < basis.CELL_END; i++) {
                    if (i != to && desk.numberOfCardsAt(i) == 0) {
                        destinations.push(i);
                    }
                }
            }
        }

        const result = { count: 0 };

        const tableau = desk.tableauAt(from);
        const lastCard = desk.cardAt(from, -1);

        const startTime = Date.now();

        function callback(desk, path) {
            for (let d = 0; d < destinations.length; d++) {
                const dest = destinations[d];

                const dstCount = desk.numberOfCardsAt(dest);
                // 1. Test if the last filtered card has been moved to the destination.
                if (dstCount > 0 && desk.cardAt(dest, -1) == lastCard) {
                    // 2. Count how many cards from the tableau has been moved to the destination.
                    const count = desk.countEqualsBackward(dest, tableau);
                    if (count == tableau.length) {
                        result.count = count;
                        result.path = path;
                        result.destination = dest;
                        return true;
                    } else if (count > result.count) {
                        const delta = tableau.length - count;
                        // 3. Update result if the rest of the tableau is still intact.
                        if (desk.numberOfCardsAt(from) >= delta) {
                            let i = 0;
                            for (; i < delta && desk.cardAt(from, -i - 1) == tableau[delta - i - 1]; i++);
                            if (i == delta) {
                                result.count = count;
                                result.path = path;
                                result.destination = dest;
                            }
                        }
                    }
                }
                if (Date.now() - startTime > 500) {
                    // It's time to stop the search.
                    return true;
                }
            }

        }

        back.from(desk);
        basis.solve(back, callback, function (card) { return tableau.indexOf(card) >= 0; });

        if (result.count > 0 && result.destination != to) {
            const A = to, B = result.destination;
            const path = [];
            for (let i = 0; i < result.path.length; i++) {
                const move = result.path[i];
                let s = basis.toSource(move);
                let d = basis.toDestination(move);
                if (s == A) {
                    s = B;
                } else if (s == B) {
                    s = A;
                }
                if (d == A) {
                    d = B;
                } else if (d == B) {
                    d = A;
                }
                path.push(basis.toMove(s, d));
            }
            result.path = path;
        }

        return result;
    }

    return Object.setPrototypeOf({
        // Overrides:
        deal: deal,
        moveCard: moveCard,

        // Methods:
        solveMove: solveMove,
        isMoveValid: isMoveValid,
        forEachMove: forEachMove,

        // Some Desk const methods:
        forEachLocus: desk.forEachLocus,
        buildTableauFrom: desk.buildTableauFrom,
        tableauLengthAt: desk.tableauLengthAt,
        cardAt: desk.cardAt,
        numberOfCardsAt: desk.numberOfCardsAt,
    }, basis);
}
