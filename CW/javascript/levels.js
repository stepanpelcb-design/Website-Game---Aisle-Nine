"use strict";

// All levels structure, maps, positions of obstacles, powerups, and groceries.

const levels = {
    1: {
        start: {row: 8, col: 9},

        finish: {row: 0, col: 1},

        barriers: ["#", "S"],

        obstacles: {
            box: {row: [5, 4], col: [1, 8]},
            bananaPeel: {row: [1, 4], col: [3, 4]},
        },

        powerups: {
            ladder: {row: [8], col: [1]},
            energyDrink: {row: [1], col: [7]},
        },

        groceries: {
            apple: {row: [5], col: [3]},
            bread: {row: [5], col: [6]},
            cheese: {row: [6], col: [8]},
            pasta: {row: [7], col: [2]}
        },

        listedGroceries: ["apple", "cheese"],

        map: [
            "#.########",
            "#.....S..#",
            "#SSSS.SS.#",
            "#........#",
            "#.SS.SSS.#",
            "#.S..S...#",
            "#.SSSS.S.#",
            "#....S.SS#",
            "#.SS......",
            "##########"
        ],


    },


    2: {
        start: {row: 0, col: 2},

        finish: {row: 11, col: 5},

        barriers: ["#", "S"],

        obstacles: {
            box: {row: [4, 8, 9], col: [10, 4, 1]},
            bananaPeel: {row: [1, 4, 5, 10], col: [4, 7, 3, 8]}
        },

        powerups: {
            ladder: {row: [1, 1, 10], col: [6, 10, 10]},
            energyDrink: {row: [2, 7], col: [2, 1]}
        },

        groceries: {
            beans: {row: [5], col: [10]},
            butter: {row: [6], col: [8]},
            carrot: {row: [10], col: [1]},
            milk: {row: [9], col: [10]},
            orange: {row: [3], col: [4]},
            pasta: {row: [7], col: [10]},
            pepper: {row: [3], col: [6]},
            tomatto: {row: [8], col: [3]}
        },

        listedGroceries: ["orange", "tomatto", "milk"],

        map: [
            "##.#########",
            "#S.....SSS.#",
            "#..SSSSS...#",
            "#.SS.S.S.S.#",
            "#.S..S...S.#",
            "#.S.SS.SSS.#",
            "#........S.#",
            "#.SSSSSS...#",
            "#.S......SS#",
            "#.S.S.S.SS.#",
            "#...S.S....#",
            "#####.######"
        ]
    },

    3: {
        start: {row: 5, col: 14},

        finish: {row: 0, col: 11},

        barriers: ["#", "S"],

        obstacles: {
            box: {row: [1, 2, 8, 11], col: [3, 9, 2, 11]},
            bananaPeel: {row: [2, 5, 9, 12], col: [11, 2, 5, 13]},
            angryOldLady: {row: [4, 4, 13], col: [6, 13, 7]},
            spilledLiquid: {row: [3, 4, 7, 7, 11, 11], col: [2, 10, 6, 12, 3, 8]}
        },

        powerups: {
            ladder: {row: [1, 2, 6, 7, 9, 9, 13], col: [7, 1, 3, 7, 7, 13, 1]},
            energyDrink: {row: [3, 6, 13], col: [13, 5, 4]},
            water: {row: [1, 3, 10, 13], col: [4, 7, 1, 9]},
            mop: {row: [3, 7], col: [5, 13]}
        },

        groceries: {
            apple: {row: [9], col: [3]},
            beans: {row: [1], col: [6]},
            bread: {row: [3], col: [3]},
            butter: {row: [9], col: [9]},
            carrot: {row: [10], col: [11]},
            cereal: {row: [1], col: [2]},
            eggs: {row: [13], col: [3]},
            grapes: {row: [12], col: [1]},
            milk: {row: [10], col: [13]},
            orange: {row: [1], col: [13]},
            pasta: {row: [7], col: [1]}
        },

        listedGroceries: ["apple", "carrot", "cereal", "beans"],

        map: [
            "###########.###",
            "#....S....S...#",
            "#.SS.SSSS.S.SS#",
            "#.....S.S.S...#",
            "#SSSS...S...S.#",
            "#...SSS.SSS.S..",
            "#.S...S.....S.#",
            "#.SSS...SSS...#",
            "#...S.SSS...SS#",
            "#SS.S.S.S.SSS.#",
            "#.SSS.S.S.S.S.#",
            "#.....S...S.S.#",
            "#.SSS.SSS...S.#",
            "#.S.......S...#",
            "###############"
        ]
    },

    4: {
        start: {row: 5, col: 0},

        finish: {row: 17, col: 15},

        barriers: ["#", "S"],

        obstacles: {
            box: {row: [4, 7, 11, 16, 16], col: [12, 3, 3, 5, 14]},
            bananaPeel: {row: [5, 6, 8, 12, 12, 13, 14, 16], col: [5, 10, 4, 1, 13, 5, 6, 10]},
            angryOldLady: {row: [4, 4, 5, 11, 12, 15], col: [3, 9, 16, 10, 8, 15]},
            spilledLiquid: {row: [1, 2, 5, 8, 11, 16, 16, 16], col: [8, 2, 13, 8, 14, 3, 9, 12]}
        },

        powerups: {
            ladder: {row: [1, 8, 8, 9, 11, 14], col: [4, 1, 6, 16, 8, 4]},
            energyDrink: {row: [9, 10, 13], col: [1, 10, 3]},
            water: {row: [1, 1, 6, 7, 11, 14], col: [1, 16, 6, 16, 4, 16]},
            mop: {row: [1, 3, 3, 10, 14], col: [2, 6, 16, 16, 10]}
        },

        groceries: {
            bread: {row: [10], col: [5]},
            butter: {row: [16], col: [13]},
            carrot: {row: [3], col: [14]},
            cereal: {row: [15], col: [8]},
            cheese: {row: [15], col: [1]},
            eggs: {row: [3], col: [1]},
            grapes: {row: [9], col: [2]},
            onion: {row: [12], col: [16]},
            orange: {row: [7], col: [12]},
            pasta: {row: [13], col: [1]},
            pepper: {row: [5], col: [2]},
            tomatto: {row: [1], col: [6]},
            yoghurt: {row: [3], col: [8]}
        },

        listedGroceries: ["butter", "yoghurt", "cheese", "eggs", "grapes"],
        map: [
            "##################",
            "#..S.......SSS...#",
            "#S.SS.SSSS...S.S.#",
            "#...S..S.SSS.S.S.#",
            "#SS.SS.S...S.S.S.#",
            ".......SSS.....S.#",
            "#SSSSS...S.SSSSS.#",
            "#....SSS.S.......#",
            "#.SS.S.S.SS.SS.SS#",
            "#..S.S.S.....S...#",
            "#SSS...SSS.S.S.S.#",
            "#....S...S.S.S.S.#",
            "#.SSSS.S.S.S.....#",
            "#.S....S...SSS.SS#",
            "#SSS.S.S.S.......#",
            "#..SSS.S.SSSSSS.S#",
            "#S.....S.........#",
            "###############.##"
        ]
    },

    5: {
        start: {row: 0, col: 15},

        finish: {row: 19, col: 3},

        barriers: ["#", "S"],

        obstacles: {
            box: {row: [5, 10, 14, 16], col: [1, 9, 15, 3]},
            bananaPeel: {row: [1, 1, 7, 8, 11, 12, 15, 16], col: [5, 11, 15, 2, 1, 13, 5, 7]},
            angryOldLady: {row: [7, 11, 12, 15, 17], col: [17, 17, 7, 18, 1]},
            spilledLiquid: {row: [2, 2, 4, 7, 7, 9, 14, 14, 18], col: [1, 7, 8, 3, 7, 14, 4, 10, 14]}
        },

        powerups: {
            ladder: {row: [3, 6, 10, 18, 18], col: [16, 5, 3, 8, 18]},
            energyDrink: {row: [1, 4, 5, 12], col: [9, 18, 14, 5]},
            water: {row: [1, 1, 3, 5, 8, 14, 18, 18], col: [7, 18, 3, 16, 5, 2, 11, 16]},
            mop: {row: [3, 4, 6, 9, 13], col: [13, 4, 13, 12, 5]}
        },

        groceries: {
            apple: {row: [1], col: [3]},
            beans: {row: [9], col: [10]},
            bread: {row: [9], col: [17]},
            butter: {row: [2], col: [5]},
            carrot: {row: [18], col: [5]},
            cereal: {row: [10], col: [7]},
            cheese: {row: [7], col: [1]},
            eggs: {row: [18], col: [1]},
            grapes: {row: [16], col: [16]},
            milk: {row: [11], col: [15]},
            onion: {row: [15], col: [13]},
            orange: {row: [6], col: [9]},
            pasta: {row: [4], col: [5]},
            pepper: {row: [3], col: [18]},
            tomatto: {row: [5], col: [3]}
        },

        listedGroceries: ["pepper", "pasta", "apple", "bread", "butter", "grapes"],
        map: [
            "###############.####",
            "#...S...S..........#",
            "#.SSS.S.SS.SSSSS.SS#",
            "#.S.SSS..S.....S.S.#",
            "#.S...SS.SS.SS.SSS.#",
            "#.S.SSS...S.S..S.S.#",
            "#.S...S.S.S.S.SS.S.#",
            "#.S.SSS.S...S......#",
            "#...S...SSSSS.SSSSS#",
            "#.SSSSS.S.......S..#",
            "#.S.....S.SSSSS.SS.#",
            "#.S.SSS.S.S...S....#",
            "#.S.S.S.S...S.SSSSS#",
            "#.S.S.S.SSSSS.....S#",
            "#.....S.S.....S.S..#",
            "#.SSS.S...SSS.S.SS.#",
            "#.....S.S...S.S..S.#",
            "#.SSS.S.SSS.S.SSSS.#",
            "#...S.......S....S.#",
            "###.################"
        ]
    },
};

