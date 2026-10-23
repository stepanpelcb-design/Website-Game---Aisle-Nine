// Defining the maze structure and storing it

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
        start: {row: 11, col: 0},
        finish: {row: 0, col: 11},
        barriers: ["#", "S"],
        obstacles: {
            box: {row: [11, 8], col: [4, 7]},
            spilledLiquid: {row: [6, 6], col: [5, 1]}
        },
        powerups: {
            ladder: {row: [8, 3], col: [1, 11]},
            mop: {row: [5], col: [10]}
        },
        groceries: {
            bread: {row: [1], col: [4]},
            butter: {row: [7], col: [10]},
            cereal: {row: [4], col: [1]},
            milk: {row: [6], col: [8]},
            orange: {row: [1], col: [7]},
            yoghurt: {row: [1], col: [1]}
        },
        listedGroceries: ["milk", "cereal", "orange"],
        map: [
            "###########.#",
            "#.S.........#",
            "#.SSS.SS.SSS#",
            "#.S...S.....#",
            "#.S.S....S..#",
            "#.SSS.SSSS.S#",
            "#.S.S..S.S..#",
            "#.S.SS.S.S..#",
            "#.S......SS.#",
            "#.SSSS.SSS..#",
            "#.S.S..S.SS.#",
            "............#",
            "#############"
        ]
    },
    3: {
        start: {row: 14, col: 2},
        finish: {row: 2, col: 14},
        barriers: ["#", "S"],
        obstacles: {
            box: {row: [8, 13], col: [13, 11]},
            bananaPeel: {row: [2, 11], col: [7, 2]},
            angryOldLady: {row: [12], col: [6]}
        },
        powerups: {
            ladder: {row: [10, 10], col: [6, 4]},
            energyDrink: {row: [5], col: [6]},
            water: {row: [7], col: [5]}
        },
        groceries: {
            beans: {row: [9], col: [1]},
            carrot: {row: [12], col: [13]},
            cheese: {row: [6], col: [8]},
            grapes: {row: [5], col: [1]},
            onion: {row: [2], col: [1]},
            pasta: {row: [1], col: [3]},
            pepper: {row: [2], col: [10]}
        },
        listedGroceries: ["carrot", "onion", "pepper", "beans"],
        map: [
            "###############",
            "#.....S....S..#",
            "#..SS.S.SS.S...",
            "#S.S....S..S.S#",
            "#..SS.SS.SSS..#",
            "#..S.......S.S#",
            "#S.SSSSS.SS...#",
            "#..S.......S..#",
            "#...SSSSSSSSS.#",
            "#.SS..S..S....#",
            "#..S.......S..#",
            "#S.SSSS.SSSSSS#",
            "#..S.......S..#",
            "#.....S.S.....#",
            "##.############"
        ]
    },
    4: {
        start: {row: 16, col: 17},
        finish: {row: 0, col: 2},
        barriers: ["#", "S"],
        obstacles: {
            box: {row: [12, 7], col: [16, 1]},
            bananaPeel: {row: [15, 11], col: [4, 8]},
            angryOldLady: {row: [13, 15], col: [6, 12]},
            spilledLiquid: {row: [13, 16], col: [14, 9]}
        },
        powerups: {
            ladder: {row: [16, 13], col: [14, 3]},
            energyDrink: {row: [4], col: [6]},
            water: {row: [12, 4], col: [1, 8]},
            mop: {row: [6], col: [10]}
        },
        groceries: {
            bread: {row: [11], col: [14]},
            butter: {row: [1], col: [16]},
            carrot: {row: [8], col: [9]},
            cheese: {row: [15], col: [2]},
            eggs: {row: [1], col: [5]},
            grapes: {row: [6], col: [4]},
            orange: {row: [6], col: [6]},
            pasta: {row: [10], col: [6]},
            yoghurt: {row: [9], col: [16]}
        },
        listedGroceries: ["pasta", "cheese", "butter", "eggs", "yoghurt"],
        map: [
            "##.###############",
            "#...S..S.......S.#",
            "#.S.S.SSS.SSSS.S.#",
            "#.SS...S...S.....#",
            "#...S..S.S.SSS.S.#",
            "#.SSSS.S.SSS.S.S.#",
            "#..S.S.S...S...S.#",
            "#.SS.S...SSSS.SS.#",
            "#......S..S.S..S.#",
            "#SSS.SSS.SS.SS...#",
            "#....S.S..S....S.#",
            "#SS.S..S..SSSS.S.#",
            "#....S.SS.S.S..S.#",
            "#.S....S.......S.#",
            "#SSSSSSSSSSSSSSS.#",
            "#......S.S....S..#",
            "#.S.S.......S.....",
            "##################"
        ]
    },







    5: {
        start: {row: 18, col: 0},

        finish: {row: 1, col: 19},

        barriers: ["#", "S"],

        obstacles: {
            box: {row: [2, 4, 6, 12, 18], col: [15, 2, 14, 17, 4]},
            bananaPeel: {row: [3, 11], col: [17, 13]},
            angryOldLady: {row: [1, 9], col: [13, 2]},
            spilledLiquid: {row: [8, 15], col: [4, 7]}
        },

        powerups: {
            ladder: {row: [6, 7, 11, 14], col: [1, 12, 8, 18]},
            energyDrink: {row: [7, 13], col: [16, 9]},
            water: {row: [3, 15], col: [12, 9]},
            mop: {row: [11, 18], col: [2, 3]}
        },

        groceries: {
            eggs: {row: [1], col: [2]},
            pepper: {row: [3], col: [10]},
            pasta: {row: [5], col: [7]},
            onion: {row: [3], col: [14]},
            carrot: {row: [10], col: [4]},
            bread: {row: [11], col: [10]},
            butter: {row: [13], col: [3]},
            beans: {row: [13], col: [16]},
            apple: {row: [16], col: [ 16]},
            grapes: {row: [18], col: [12]}
        },

        listedGroceries: ["apple", "bread", "eggs", "onion", "pepper"],

        map: [
            "####################",
            "#S..................",
            "#..SSSSSSSSS.SS.SSS#",
            "#.SS.......S.S.....#",
            "#....SSSSSSSSSSSSS.#",
            "#SSS.S.........S...#",
            "#..S.S.SSS.SSS.S.S.#",
            "#S...S.S...S...S.S.#",
            "#SSS.S.S.SSSSS...S.#",
            "#....S.S.S...SSSSS.#",
            "#.SS.S.S.S.S.S.....#",
            "#..S.....S.S...SSS.#",
            "#.SSSSSSSSSSSSSS...#",
            "#.S.S.....S......SS#",
            "#.S.S.S.SSS.SSSSSS.#",
            "#.....S.S.S.S....S.#",
            "#.SSS...S.S....S.S.#",
            "#...S.S...SS.S.SSS.#",
            "..S...SSS....S.....#",
            "####################",
        ],

    }
};

