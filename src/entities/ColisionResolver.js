import * as KeyActionConsts from "../constants/BlockActions";
import * as BlockShapeConsts from "../constants/BlockShapes";
import * as GameAreaConsts from "../constants/GameArea";
import * as CollisionConsts from "../constants/Collision";

export const resolve = (block, board, direction) => {
    let incrementFactor = 0;
    let dropIncrementFactor = 0;
    let shape = block.currentShapeState;
    switch (direction) {
    case KeyActionConsts.MOVE_LEFT :
        incrementFactor = -1;
        break;
    case KeyActionConsts.MOVE_RIGHT :
        incrementFactor = 1;
        break;
    case KeyActionConsts.DROP_ONE_ROW:
    case KeyActionConsts.DROP:
        dropIncrementFactor = 1;
        break;
    case KeyActionConsts.ROTATE:
        shape = block.nextRotateState;
        break;
    }

    const startRow = pixelToMatrix(block.y, block.cellSize) + dropIncrementFactor;
    const startCol = pixelToMatrix(block.x, block.cellSize) + incrementFactor;

    const neighbourMatrix = sliceMatrix(board, startRow, startCol, BlockShapeConsts.SHAPE_SIZE, BlockShapeConsts.SHAPE_SIZE);
    return resolveNeighbourBlocksCollision(shape, neighbourMatrix);
};

export const resolveNeighbourBlocksCollision = (matrix, neighbourMatrix) => {
    const neighbourMatrixRowLength = neighbourMatrix.length;
    const neighbourMatrixColLength = neighbourMatrixRowLength > 0 ? neighbourMatrix[0].length : 0;

    for (let row = neighbourMatrixRowLength - 1; row >= 0; row--)
        for (let col = 0; col < neighbourMatrixColLength; col++)
            // check for blocks on board row
            // direct collision if shape has value on checked row
            if (matrix[row][col] && neighbourMatrix[row][col]){
                return CollisionConsts.COLLISION;
            }
    return CollisionConsts.NO_COLLISION;
};

export const sliceMatrix = (matrix, startRow, startCol, lengthRow, lengthCol) => {
    const colEndIdx = startCol + lengthCol > matrix.length ? matrix.length : startCol + lengthCol;
    const rowEndIdx = startRow + lengthRow > matrix.length ? matrix.length : startRow + lengthRow;
    // copy the matrix
    const matrixCopy = matrix.map((row) => {
        return row.slice();
    });


    const slicedMatrix = matrixCopy.map((row) => {
        return row.slice(startCol, colEndIdx);
    }).slice(startRow, rowEndIdx);

    // add fake neighbour rows if needed
    const numFakeRowsToAdd = lengthRow - slicedMatrix.length;
    if (numFakeRowsToAdd > 0){
        const fakeRows = new Array(lengthCol).fill(1);
        slicedMatrix.push(fakeRows);
    }

    // add fake neighbour cols if needed
    const numFakeColsToAdd = slicedMatrix[0].length < lengthCol;
    if (numFakeColsToAdd > 0) {
        const fakeCols = new Array(numFakeColsToAdd).fill(1);
        slicedMatrix.map((row) => {
            row.push(fakeCols);
        });
    }

    return slicedMatrix;

};

export const pixelToMatrix = (val, cellSize) => {
    return Math.floor(val / cellSize);
};

export const matrixToPixel = (val, cellSize) => {
    return val * cellSize;
};

export const resolveDropPosition = (block, board) => {
    const startRow = pixelToMatrix(block.y, block.cellSize);
    const startCol = pixelToMatrix(block.x, block.cellSize);
    const shape = block.currentShapeState;
    let lastValidRow = startRow;

    for (let row = startRow; row < GameAreaConsts.DEFAULT_ROWS; row++) {
        const neighbourMatrix = sliceMatrix(board, row, startCol, BlockShapeConsts.SHAPE_SIZE, BlockShapeConsts.SHAPE_SIZE);
        const collision = resolveNeighbourBlocksCollision(shape, neighbourMatrix);
        if (collision !== CollisionConsts.NO_COLLISION)
            break;
        lastValidRow = row;
    }
    return matrixToPixel(lastValidRow, block.cellSize);
};