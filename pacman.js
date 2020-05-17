const CANVAS_SIZE = 480;
const BOARD_SIZE = 15;
const TILE_SIZE = 32;

let fitness = 0;
let player = {x: 1, y: 1}; 
let last_position = {x: 1, y: 1}; 
let ghost = [{x: 13, y: 13}, {x: 13, y: 13}];
let direcciones = [{x: 0, y: -1}, {x: 1, y: 0}, {x: 0, y: 1}, {x: -1, y: 0}];

let board = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

let app = new PIXI.Application({width: CANVAS_SIZE, height: CANVAS_SIZE});
document.querySelector(".pacman").appendChild(app.view);

let graphics = new PIXI.Graphics();
app.stage.addChild(graphics);

app.ticker.add(delta => {

    graphics.clear();

    // Paredes del tablero 
    for(let i = 0; i < BOARD_SIZE; i++) {
        for(let j = 0; j < BOARD_SIZE; j++) {
            if(board[i][j] == 1) {
                graphics.lineStyle(3, 0x0000ff);
                graphics.drawRect(j * TILE_SIZE, i * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            }
        }
    }

    // Pacman
    graphics.lineStyle(0, 0x000);
    graphics.beginFill(0xffff00, 1);
    graphics.drawCircle(player.x * TILE_SIZE + 16, player.y * TILE_SIZE + 16, TILE_SIZE / 2);
    graphics.endFill();
    
    // Fantasma rojo
    graphics.lineStyle(0, 0x000);
    graphics.beginFill(0xff0000, 1);
    graphics.drawCircle(ghost[0].x * TILE_SIZE + 16, ghost[0].y * TILE_SIZE + 16, TILE_SIZE / 2);
    graphics.drawRect(ghost[0].x * TILE_SIZE, ghost[0].y * TILE_SIZE + 16, TILE_SIZE, TILE_SIZE / 2);
    graphics.endFill();
    
    // // Fantasma morado
    // graphics.lineStyle(0, 0x000);
    // graphics.beginFill(0xff00ff, 1);
    // graphics.drawCircle(ghost[1].x * TILE_SIZE + 16, ghost[1].y * TILE_SIZE + 16, TILE_SIZE / 2);
    // graphics.drawRect(ghost[1].x * TILE_SIZE, ghost[1].y * TILE_SIZE + 16, TILE_SIZE, TILE_SIZE / 2);
    // graphics.endFill();

    // // Movimiento de entrenamiento
    // movimientoRandom();

});

// Hacemos que pacman se mueva de manera aleatoria por
// todo el tablero para facilitar el entrenamiento
function movimientoRandom() {

    let direccion = Math.round(Math.random() * 3);
    let next_x = player.x + direcciones[direccion].x; 
    let next_y = player.y + direcciones[direccion].y; 
    let next_pos = {x: next_x, y: next_y}; 
    
    while(board[next_y][next_x] == 1 || jsonEqual(next_pos, last_position)) {
        direccion = Math.round(Math.random() * 3);
        next_x = player.x + direcciones[direccion].x; 
        next_y = player.y + direcciones[direccion].y; 
        next_pos = {x: next_x, y: next_y}; 
    }

    if(!jsonEqual(next_pos, ghost[0]) && !jsonEqual(next_pos, ghost[1])) {
        last_position = player; 
        player = next_pos;
    }

    else {
        last_position = player;
    }

}

// Posicion al azar
function posicionRandom() {

    player = {x: Math.round(Math.random() * (BOARD_SIZE - 1)), y: Math.round(Math.random() * (BOARD_SIZE - 1))}; 

    while(board[player.y][player.x] == 1) {
        player = {x: Math.round(Math.random() * (BOARD_SIZE - 1)), y: Math.round(Math.random() * (BOARD_SIZE - 1))};
    }

}

// Mueve al fantasma si la posición es valida
function moveGhost(dir) {
    
    next_x = ghost[0].x + direcciones[dir].x; 
    next_y = ghost[0].y + direcciones[dir].y; 

    if(board[next_y][next_x] == 0) {
        ghost[0] = {x: next_x, y: next_y}; 
    }

}

// Para comprobar objetos JSON
function jsonEqual(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
}