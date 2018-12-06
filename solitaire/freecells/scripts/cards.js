const Cards = (function () {
    const SUITS = 'SDCH';
    const SUIT_PLAY_NAMES = ['♠', '♦', '♣', '♥'];
    const SUIT_FULL_NAMES = ['spades', 'diamonds', 'clubs', 'hearts'];
    const SUIT_HTML_CODES = ['&spades;', '&diams;', '&clubs;', '&hearts;'];   // Special Symbol Character Codes for HTML

    const RANKS = 'A23456789TJQK';
    const RANK_PLAY_NAMES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const RANK_FULL_NAMES = ['Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Jack', 'Queen', 'King'];

    const SUIT_NUM = SUITS.length;
    const RANK_NUM = RANKS.length;
    const CARD_NUM = SUIT_NUM * RANK_NUM;

    // Card index is defined as: suit + rank * SUIT_NUM
    function index(s, r) {
        return s + r * SUIT_NUM;
    }

    function rank(index) {
        return Math.floor(index / SUIT_NUM);
    }

    function suit(index) {
        return index % SUIT_NUM;
    }

    // Card names:
    function nameOf(index) {
        return RANKS[rank(index)] + SUITS[suit(index)];
    }

    function playNameOf(index) {
        return RANK_PLAY_NAMES[rank(index)] + SUIT_PLAY_NAMES[suit(index)];
    }

    function fullNameOf(index) {
        return RANK_FULL_NAMES[rank(index)] + ' of ' + SUIT_FULL_NAMES[suit(index)];
    }

    // Suit names:
    function suitNameOf(index) {
        return SUITS[suit(index)];
    }

    function suitPlayNameOf(index) {
        return SUIT_PLAY_NAMES[suit(index)];
    }

    function suitFullNameOf(index) {
        return SUIT_FULL_NAMES[suit(index)];
    }

    function suitHTMLCodeOf(index) {
        return SUIT_HTML_CODES[suit(index)];
    }

    // Rank names:
    function rankNameOf(index) {
        return RANKS[rank(index)];
    }

    function rankPlayNameOf(index) {
        return RANK_PLAY_NAMES[rank(index)];
    }

    function rankFullNameOf(index) {
        return RANK_FULL_NAMES[rank(index)];
    }

    return {
        SUITS: SUITS,
        RANKS: RANKS,

        SUIT_NUM: SUIT_NUM,
        RANK_NUM: RANK_NUM,
        CARD_NUM: CARD_NUM,

        index: index,
        rank: rank,
        suit: suit,

        nameOf: nameOf,
        playNameOf: playNameOf,
        fullNameOf: fullNameOf,

        suitNameOf: suitNameOf,
        suitPlayNameOf: suitPlayNameOf,
        suitFullNameOf: suitFullNameOf,
        suitHTMLCodeOf: suitHTMLCodeOf,

        rankNameOf: rankNameOf,
        rankPlayNameOf: rankPlayNameOf,
        rankFullNameOf: rankFullNameOf,
    };
}());
