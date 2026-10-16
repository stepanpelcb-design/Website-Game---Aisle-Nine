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

    3: {
        start: {row: 18, col: 0},

        finish: {row: 1, col: 19},

        barriers: ["#", "S"],

        obstacles: {
            box: {row: [2, 4, 6, 12, 18], col: [15, 2, 14, 17, 4]},
            bananaPeel: {row: [3, 8, 11, 15], col: [17, 4, 13, 7]},
            angryOldLady: {row: [1, 9], col: [13, 2]}
        },

        powerups: {
            ladder: {row: [6, 7, 11, 14], col: [1, 12, 8, 18]},
            energyDrink: {row: [11, 13], col: [2, 9]},
            water: {row: [3, 15], col: [12, 9]}
        },

        groceries: {
            eggs: {row: [1], col: [2]},
            pepper: {row: [3], col: [10]},
            pasta: {row: [5], col: [7]},
            onion: {row: [7], col: [16]},
            carrot: {row: [10], col: [4]},
            bread: {row: [11], col: [10]},
            butter: {row: [13], col: [3]},
            beans: {row: [13], col: [16]},
            apple: {row: [16], col: [ 16]},
            grapes: {row: [18], col: [12]}
        },

        listedGroceries: ["apple", "beans", "bread", "eggs", "pepper"],

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

