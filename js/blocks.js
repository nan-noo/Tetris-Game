// type -> direction -> position
const BLOCKS = {
    tree: [
        [[1,0], [0,1], [1,1], [1,2]],
        [[2,1], [0,1], [1,1], [1,2]],
        [[1,0], [2,1], [1,1], [1,2]],
        [[1,0], [0,1], [1,1], [2,1]],
    ],
    square: [
        [[0,0], [0,1], [1,0], [1,1]],
        [[0,0], [0,1], [1,0], [1,1]],
        [[0,0], [0,1], [1,0], [1,1]],
        [[0,0], [0,1], [1,0], [1,1]],
    ],
    bar: [
        [[0,0], [0,1], [0,2], [0,3]],
        [[0,1], [1,1], [2,1], [3,1]],
        [[0,0], [0,1], [0,2], [0,3]],
        [[0,1], [1,1], [2,1], [3,1]],
    ],
    leftL: [
        [[1,0], [1,1], [1,2], [0,2]],
        [[0,1], [1,1], [2,1], [2,2]],
        [[1,0], [1,1], [1,2], [2,0]],
        [[0,1], [1,1], [2,1], [0,0]],
    ],
    rightL: [
        [[0,0], [1,0], [1,1], [1,2]],
        [[0,1], [0,2], [1,1], [2,1]],
        [[1,0], [1,1], [1,2], [2,2]],
        [[2,0], [0,1], [1,1], [2,1]],
    ],
    leftZ: [
        [[0,0], [0,1], [1,1], [1,2]],
        [[1,0], [0,1], [1,1], [2,0]],
        [[1,0], [1,1], [2,1], [2,2]],
        [[0,2], [1,2], [1,1], [2,1]],
    ],
    rightZ: [
        [[1,0], [1,1], [0,1], [0,2]],
        [[1,0], [1,1], [0,0], [2,1]],
        [[2,0], [1,2], [1,1], [2,1]],
        [[1,1], [1,2], [0,1], [2,2]],
    ],
}

export default BLOCKS;