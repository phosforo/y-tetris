export const SHAPE_SIZE = 4;
export const I_SHAPE = {
    states:[
        [
            [0,1,0,0],
            [0,1,0,0],
            [0,1,0,0],
            [0,1,0,0]
        ],
        [
            [0,0,0,0],
            [1,1,1,1],
            [0,0,0,0],
            [0,0,0,0]
        ],
        [
            [0,0,1,0],
            [0,0,1,0],
            [0,0,1,0],
            [0,0,1,0]
        ],
        [
            [0,0,0,0],
            [0,0,0,0],
            [1,1,1,1],
            [0,0,0,0]
        ]],
    color: 0x00FFFF
};

export const L_SHAPE = {
    states:[
        [
        [0,1,0,0],
        [0,1,0,0],
        [0,1,1,0],
        [0,0,0,0]
        ],
        [
        [0,0,0,0],
        [1,1,1,0],
        [1,0,0,0],
        [0,0,0,0]
        ],
        [
        [1,1,0,0],
        [0,1,0,0],
        [0,1,0,0],
        [0,0,0,0]
        ],
        [
        [0,0,1,0],
        [1,1,1,0],
        [0,0,0,0],
        [0,0,0,0]
        ]],
    color: "0xFFA500"
};

export const J_SHAPE = {
    states:[
        [
            [0,1,0,0],
            [0,1,0,0],
            [1,1,0,0],
            [0,0,0,0]
        ],
        [
            [1,0,0,0],
            [1,1,1,0],
            [0,0,0,0],
            [0,0,0,0]
        ],
        [
            [0,1,1,0],
            [0,1,0,0],
            [0,1,0,0],
            [0,0,0,0]
        ],
        [
            [0,0,0,0],
            [1,1,1,0],
            [0,0,1,0],
            [0,0,0,0]
        ]],
    color: "0x0000FF"
};

export const O_SHAPE = {
    states:[
        [
            [1,1,0,0],
            [1,1,0,0],
            [0,0,0,0],
            [0,0,0,0]
        ],
        [
            [1,1,0,0],
            [1,1,0,0],
            [0,0,0,0],
            [0,0,0,0]
        ],
        [
            [1,1,0,0],
            [1,1,0,0],
            [0,0,0,0],
            [0,0,0,0]
        ],
        [
            [1,1,0,0],
            [1,1,0,0],
            [0,0,0,0],
            [0,0,0,0]
        ]],
    color: "0xFFFF00"
};

export const T_SHAPE = {
    states:[
        [
            [0,0,0,0],
            [1,1,1,0],
            [0,1,0,0],
            [0,0,0,0]
        ],
        [
            [0,1,0,0],
            [1,1,0,0],
            [0,1,0,0],
            [0,0,0,0]
        ],
        [
            [0,1,0,0],
            [1,1,1,0],
            [0,0,0,0],
            [0,0,0,0]
        ],
        [
            [0,1,0,0],
            [0,1,1,0],
            [0,1,0,0],
            [0,0,0,0]
        ]],
    color: "0x800080"
};

export const Z_SHAPE = {
    states:[
        [
            [0,0,0,0],
            [1,1,0,0],
            [0,1,1,0],
            [0,0,0,0]
        ],
        [
            [0,1,0,0],
            [1,1,0,0],
            [1,0,0,0],
            [0,0,0,0]
        ],
        [
            [1,1,0,0],
            [0,1,1,0],
            [0,0,0,0],
            [0,0,0,0]
        ],
        [
            [0,0,1,0],
            [0,1,1,0],
            [0,1,0,0],
            [0,0,0,0]
        ]],
    color: "0xFF0000"
};

export const S_SHAPE = {
    states:[
        [
            [0,0,0,0],
            [0,1,1,0],
            [1,1,0,0],
            [0,0,0,0]
        ],
        [
            [1,0,0,0],
            [1,1,0,0],
            [0,1,0,0],
            [0,0,0,0]
        ],
        [
            [0,1,1,0],
            [1,1,0,0],
            [0,0,0,0],
            [0,0,0,0]
        ],
        [
            [0,1,0,0],
            [0,1,1,0],
            [0,0,1,0],
            [0,0,0,0]
        ]],
    color: "0x00FF00"
};


export const BLOCKS = [I_SHAPE, J_SHAPE, L_SHAPE, O_SHAPE, S_SHAPE, T_SHAPE, Z_SHAPE];