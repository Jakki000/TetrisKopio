let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

ctx.scale(20,20);
let piece;

function getRandomInt(min, max) {
    return Math.floor((Math.random() * (max - min + 1)) + min);
}

let rot = 0;

function rotate() {
    let offset = 1;
    if(rot < 3) {
        rot++
    }
    else {
        rot = 0;
    }

    while(collision(arena, player)) {
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        console.log('while in rot')
    }
}

const colors = [
    '',
    'purple',
    'blue',
    'yellow',
    'red',
    'green',
    'orange',
    'cyan'
];

let pieceamount = 6;

function changePiece(type) {  
    if(type === 0) {
        piece = [
            [
                [0, 1, 0],
                [1, 1, 0],
                [0, 1, 0],
            ],
            [
                [0, 1, 0],
                [1, 1, 1],
                [0, 0, 0],
            ],
            [
                [0, 1, 0],
                [0, 1, 1],
                [0, 1, 0],
            ],
            [
                [0, 0, 0],
                [1, 1, 1],
                [0, 1, 0],
            ]
        ];
    }
    else if(type === 1) {
        piece = [
            [
                [2, 2],
                [2, 2],
            ],
            [
                [2, 2],
                [2, 2],
            ],
            [
                [2, 2],
                [2, 2],
            ],
            [
                [2, 2],
                [2, 2],
            ]
        ];
    }
    else if(type === 2) {
        piece = [
            [
                [0, 3, 0],
                [0, 3, 0],
                [3, 3, 0],
            ],
            [
                [3, 0, 0],
                [3, 3, 3],
                [0, 0, 0],
            ],
            [
                [0, 3, 3],
                [0, 3, 0],
                [0, 3, 0],
            ],
            [
                [0, 0, 0],
                [3, 3, 3],
                [0, 0, 3],
            ]
        ];
    }
    else if(type === 3) {
        piece = [
            [
                [0, 0, 0],
                [0, 4, 4],
                [4, 4, 0],
            ],
            [
                [0, 4, 0],
                [0, 4, 4],
                [0, 0, 4],
            ],
            [
                [0, 0, 0],
                [0, 4, 4],
                [4, 4, 0],
            ],
            [
                [0, 4, 0],
                [0, 4, 4],
                [0, 0, 4],
            ]
        ];
    }
    else if(type === 4) {
        piece = [
            [
                [0, 0, 0],
                [5, 5, 0],
                [0, 5, 5],
            ],
            [
                [0, 5, 0],
                [5, 5, 0],
                [5, 0, 0],
            ],
            [
                [0, 0, 0],
                [5, 5, 0],
                [0, 5, 5],
            ],
            [
                [0, 5, 0],
                [5, 5, 0],
                [5, 0, 0],
            ]
        ];
    }
    else if(type === 5) {
        piece = [
            [
                [0, 6, 0],
                [0, 6, 0],
                [0, 6, 6],
            ],
            [
                [0, 0, 0],
                [6, 6, 6],
                [6, 0, 0],
            ],
            [
                [6, 6, 0],
                [0, 6, 0],
                [0, 6, 0],
            ],
            [
                [0, 0, 6],
                [6, 6, 6],
                [0, 0, 0],
            ]
        ];
    }
    else if(type === 6) {
        piece = [
            [ 
                [0,0,7,0],
                [0,0,7,0],
                [0,0,7,0],
                [0,0,7,0],
            ],
            [
                [0,0,0,0],
                [0,0,0,0],
                [7,7,7,7],
                [0,0,0,0],
            ],
            [
                
                [0,0,7,0],
                [0,0,7,0],
                [0,0,7,0],
                [0,0,7,0],
            ],
            [
                [0,0,0,0],
                [0,0,0,0],
                [7,7,7,7],
                [0,0,0,0],
            ]
        ];
        
    }
}

changePiece(getRandomInt(0, pieceamount));

let player = {
    pos: {x: 5, y: 5},
    block: piece
};

function playerMove(dir) {
    player.pos.x += dir;
    if(collision(arena, player)) {
        player.pos.x += -dir;
        console.log('while in move')
        console.log(dir);
    }
}
function arenaSweep() {
    let rowCount = 1;
    outer: for (let y = arena.length -1; y > 0; --y) {
        for (let x = 0; x < arena[y].length; ++x) {
            if (arena[y][x] === 0) {
                continue outer;
            }
        }

        const row = arena.splice(y, 1)[0].fill(0);
        arena.unshift(row);
        ++y;

        player.score += rowCount * 10;
        rowCount *= 2;
    }
}



function playerDrop() {
    player.pos.y++;
    if(collision(arena, player)) {
        player.pos.y--;
        merge(arena, player);
        changePiece(getRandomInt(0, pieceamount));
        player.block = piece;
        player.pos.y = 0;
        player.pos.x = 5;
    }
    dropCounter = 0;
}

function drawMatrix(piece, offset) {
    piece.forEach((row, y) => {
        row.forEach((value, x) => {
            if(value !== 0) {
                ctx.fillStyle = colors[value];
                ctx.fillRect(x + offset.x, y + offset.y, 1, 1);
                ctx.lineWidth=0.04;
                ctx.strokeRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}

function collision(arena, player) {
    const m = player.block[rot];
    const o = player.pos;
    for(let y = 0; y < m.length; ++y) {
        for(let x = 0; x < m[y].length; ++x) {
            if(m[y][x] !== 0 &&
                (arena[y + o.y] &&
                 arena[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

function createArena(w, h) {
    const matrix = [];
    while(h--) {
        matrix.push(new Array(w).fill(0));
    }
    //console.log(matrix);
    return matrix;
    
}

function draw() {
    ctx.clearRect(0, 0, canvas.height, canvas.width);
    drawMatrix(arena, {x:0, y:0});
    drawMatrix(player.block[rot], player.pos);
}

function merge(arena, player) {
    player.block[rot].forEach((row, y) => {
        row.forEach((value, x) => {
            if(value !== 0) {
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

document.addEventListener('keydown', e => {
    switch(e.keyCode) {
        case 38:
            rotate();
            break;
        case 37:
            playerMove(-1);
            break;
        case 39:
            playerMove(1);
            break;
        case 40:
            playerDrop();
                
    }
});

let arena = createArena(10, 20);

let dropCounter = 0;
let dropInterval = 400;
let lastTime = 0;

function loop(time = 0) {
    const deltatime = time - lastTime;
    dropCounter += deltatime;

    if(dropCounter > dropInterval) {
        playerDrop();
    }

    lastTime = time;


    arenaSweep();
    draw();
    requestAnimationFrame(loop);
}

loop();