const createFreecellGameDOM = (function () {
    // Helpers:
    function forEachElement(children, from, to, callback) {
        for (let i = from; i < to; i++) {
            callback(children[i], i - from);
        }
    }

    function createPlaceholders(parent, number, cx, cy, units) {
        const children = new Array(number);
        for (let i = 0; i < number; i++) {
            const element = (children[i] = document.createElement("div"));
            element.style.position = "absolute";
            element.style.width = cx + units;
            element.style.height = cy + units;
            element.style.zIndex = 0;
            element.classList.add("placeholder");

            parent.appendChild(element);
        }
        return children;
    }

    function positionCell(x, y, dx, dy, units) {
        return function (element, index) {
            element.classList.add("cell");
            element.style.left = x + index * dx + units;
            element.style.top = y + index * dy + units;
        };
    }

    function positionBase(x, y, dx, dy, units) {
        return function (element, index) {
            element.classList.add("base", Cards.suitFullNameOf(index));
            element.innerHTML = Cards.suitHTMLCodeOf(index);
            element.style.left = x + index * dx + units;
            element.style.top = y + index * dy + units;
        };
    }

    function positionPile(x, y, dx, dy, units) {
        return function (element, index) {
            element.classList.add("pile");
            element.style.left = x + index * dx + units;
            element.style.top = y + index * dy + units;
        };
    }

    function createCards(parent, number, x, y, cx, cy, units) {
        const cards = new Array(number);
        for (let i = 0; i < number; i++) {
            const element = document.createElement('div');
            element.classList.add('card', Cards.suitFullNameOf(i));
            element.id = 'm_card_' + i;
            element.innerHTML = Cards.rankPlayNameOf(i) + Cards.suitHTMLCodeOf(i);
            element.style.position = 'absolute';
            element.style.left = x;
            element.style.top = y;
            element.style.width = cx + units;
            element.style.height = cy + units;

            parent.appendChild(element);
            cards[i] = { element: element };
        }
        return cards;
    }

    return function (pileNum, cellNum, baseNum, parent) {
        // Base object
        const game = createFreecellManager(pileNum, cellNum, baseNum);

        const UNITS = "em";
        /*
         * The most common sizes:
         * 1. poker size (2.5 × 3.5 inches (64 × 89 mm);
         * 2. bridge size (2.25 × 3.5 inches (57 × 89 mm);
         */
        const CX = 2.5,
          CY = 3.5,
          DX = 0.25 * CX,
          DY = 0.25 * CY,
          PLAY_CX = 2 * CX + Math.max(game.CELL_NUM + game.BASE_NUM, game.PILE_NUM) * (CX + DX),
          PLAY_CY = 9 * CY,
          CELL_X = CX,
          CELL_Y = CY,
          BASE_X = CELL_X + game.CELL_NUM * (CX + DX),
          BASE_Y = CELL_Y,
          PILE_X = CELL_X,
          PILE_Y = CELL_Y + CY + DY;

        // Style the parent:
        parent.style.position = "relative";
        parent.style.top = 0;
        parent.style.left = 0;
        parent.style.width = PLAY_CX + UNITS;
        parent.style.height = PLAY_CY + UNITS;

        // Create and position placeholders:
        const placeholders = createPlaceholders(parent, game.DESK_SIZE, CX, CY, UNITS);
        forEachElement(placeholders, game.CELL_START, game.CELL_END,
            positionCell(CELL_X, CELL_Y, CX + DX, 0, UNITS));
        forEachElement(placeholders, game.BASE_START, game.BASE_END,
            positionBase(BASE_X, BASE_Y, CX + DX, 0, UNITS));
        forEachElement(placeholders, game.PILE_START, game.PILE_END,
            positionPile(PILE_X, PILE_Y, CX + DX, 0, UNITS));

        // Create cards:
        const cards = createCards(parent, game.CARD_NUM, 0, 0, CX, CY, UNITS);

        function deal(number) {
            const deck = game.deal(number);
            for (let i = 0; i < game.CARD_NUM; i++) {
                const element = cards[deck[i]].element;
                element.style.zIndex = i;
                //removePlayable(element);
            }

            for (let i = 0; i < game.DESK_SIZE; i++) {
                const count = game.numberOfCardsAt(i);
                if (count > 0) {
                    //removePlayable(placeholders[i]);
                    //addPlayable(game.cardElementAt(i, count - 1), i);

                    for (let j = 0; j < count; j++) {
                        const card = cards[game.cardAt(i, j)];
                        card.pile = i;
                        card.index = j;

                        const element = card.element;
                        if (game.isPile(i)) {
                            element.style.left = placeholders[i].style.left;
                            element.style.top = parseFloat(placeholders[i].style.top) + j * DY + UNITS;
                        } else {
                            element.style.left = placeholders[i].style.left;
                            element.style.top = placeholders[i].style.top;
                        }
                    }
                } else {
                    //addPlayable(placeholders[i], i);
                }
            }

            return deck;
        }

        return Object.setPrototypeOf({
            // Overrides:
            deal: deal,
        }, game);
    }
})();
