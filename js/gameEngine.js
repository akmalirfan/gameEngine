var interval = 1000 / 60,
    tile = new Image(),
    tile2 = new Image(),
    bubble = new Image(),
    tileWidth = 32,
    tileHeight = 32,
    tileNo,
    i,
    j,
    
    sineTable = [],
    sineTblBerubah = [],
    sineTblBerubah_length,
    cameraCounter = 0,
    
    // Untuk resize canvas
    resizeCanvas = true,
    initWidth = 352,
    initHeight = 224,
    scale = 1,
    
    box_x,
    box_y,
    
    vx = 0,
    vy = 0,
    
    bezaX,
    bezaY,
    left = false,
    right = false,
    up = false,
    down = false,
    space = false,
    inv = false,
    
    unlock = false,
    
    // Guna untuk inventory //
    row = 0,
    col = 0,
    boleh_tekan = true,
    // Parallel arrays
    inv_arr = [],
    inv_arrQty = [],
    
    // Berkaitan dengan scene
    currentScene,
    
    dahlepas_space = true, //untuk space
    dahlepas_inv = true,
    //NPC,
    enpisi,
    
    // Collision detection
    alligned = false,
    
    collisionL = false,
    collisionR = false,
    collisionU = false,
    collisionD = false,
    
    collisionL2 = false,
    collisionR2 = false,
    collisionU2 = false,
    collisionD2 = false,
    ///////////////////////
    
    /* Variables untuk dialog */
    //can_interact = false,
    typeface = new Image(),
    sdgcakap = false,
    bekas = [[],[]],
    panjang_teks = 0,
    NPC_bercakap,
    var_panjang = [0, 0], //untuk buat FX menaip pada string
    //tukar = 0,
    char_width = 6,
    char_height = 11,
    
    game_canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d');
    
// Kira siap-siap, masukkan dalam table
for (i = 0, j = 0; i <= 90; i += 10, j++) {
    sineTable[j] = Math.round(Math.sin(i / 180 * Math.PI) * 32);
}

sineTblBerubah[0] = 0;

// Cari perubahan
for (i = 1; i <= 9; i++) {
    if (sineTable[i] === sineTable[i - 1]) {
        sineTblBerubah[i] = 0;
    } else {
        sineTblBerubah[i] = sineTable[i] - sineTable[i - 1];
    }
}

//sineTblBerubah = [0, 6, 6, 5, 5, 4, 2, 2, 2, 0];

sineTblBerubah_length = sineTblBerubah.length;

/*// Entity object
function Entity() {
    'use strict';
    this.x;
    this.y;
    this.hspeed = 0;
    this.vspeed = 0;
    this.inView = false;
}*/

// Entity object
function Entity() {
    private:
        this.x;
        this.y;
        this.hspeed = 0;
        this.vspeed = 0;
        this.inView = false;
    public:
        // Getters
        this.getX = function() {
            return this.x;
        }
        this.getY = function() {
            return this.y;
        }
        this.getHSpeed = function() {
            return this.hspeed;
        }
        this.getVSpeed = function() {
            return this.vspeed;
        }
        this.getInView = function() {
            return this.inView;
        }
}

/*// Character object, derived from Entity
function Character(img_src, textID) {
    'use strict';
    this.sprite = new Image();
    if (img_src !== null) this.sprite.src = img_src;
    this.arah_hor = 0; // 0(kanan) 1(kiri) >> nak guna tribool?
    this.arah_ver = 0; // 0(bawah) 1(atas)
    this.frame_row = 0;
    this.frame_column = 0;
    this.pelambat = 0;
    this.depth = 0;
    this.textID = textID;
    this.text = 0;
    this.draw = function() {
        //drawImage(image,sx,sy,sw,sh,dx,dy,dw,dh)
        if (img_src !== null) {
            ctx.drawImage(
                    this.sprite,
                    this.frame_column * 32,
                    this.frame_row * 32,
                    32,
                    32,
                    this.x - vx,
                    this.y - vy,
                    32,
                    32
            );
        }
    };
    
    /// BERKAITAN CHAT ENGINE ///
    this.legap = 0;
    
    this.can_interact = false;
    this.tukar = 0;
}*/

// Character object, derived from Entity
function Character(img_src, textID) {
    'use strict';
    this.sprite = new Image();
    if (img_src !== null) this.sprite.src = img_src;
    this.arah_hor = 0; // 0(kanan) 1(kiri) >> nak guna tribool?
    this.arah_ver = 0; // 0(bawah) 1(atas)
    this.frame_row = 0;
    this.frame_column = 0;
    this.pelambat = 0;
    this.depth = 0;
    this.textID = textID;
    this.text = 0;
    this.draw = function() {
        //drawImage(image,sx,sy,sw,sh,dx,dy,dw,dh)
        if (img_src !== null) {
            ctx.drawImage(
                    this.sprite,
                    this.frame_column * 32,
                    this.frame_row * 32,
                    32,
                    32,
                    this.getX() - vx,
                    this.getY() - vy,
                    32,
                    32
            );
        }
    };
    
    /// BERKAITAN CHAT ENGINE ///
    this.legap = 0;
    
    this.can_interact = false;
    this.tukar = 0;
}

// Inherits from Entity
Character.prototype = new Entity();

// Item constructor
function Item(img_src, name, textID, price) {
    'use strict';
    this.sprite = new Image();
    this.sprite.src = img_src;
    this.name = name;
    this.textID = textID;
    this.price = price;
    this.describe = function() {
        'use strict';
        var desc_length = text[3][0][this.textID].length;
        
        for (var i = 0; i < this.name.length; i++) {
            //drawImage(image,sx,sy,sw,sh,dx,dy,dw,dh)
            ctx.drawImage(
                typeface,
                (this.name.charCodeAt(i) - 32) * char_width,
                0,
                char_width,
                char_height,
                193 + i * char_width,
                149,
                char_width,
                char_height);
        }
        
        for (var i = 0; i < 21; i++) {
            //drawImage(image,sx,sy,sw,sh,dx,dy,dw,dh)
            ctx.drawImage(
                typeface,
                (text[3][0][this.textID].charCodeAt(i) - 32) * char_width,
                0,
                char_width,
                char_height,
                193 + i * char_width,
                170,
                char_width,
                char_height);
        }
        
        // Baris kedua (mula dari 22)
        for (var i = 22; i < desc_length; i++) {
            //drawImage(image,sx,sy,sw,sh,dx,dy,dw,dh)
            ctx.drawImage(
                typeface,
                (text[3][0][this.textID].charCodeAt(i) - 32) * char_width,
                0,
                char_width,
                char_height,
                61 + i * char_width, //61 = 193 - 132  (132 = 6 * 22)
                181,
                char_width,
                char_height);
        }
    }
}

// Barang-barang dalam inventory
var tangga = new Item("./img/tangga.png", "Tangga", 0, 20),
    roti = new Item("./img/roti.png", "Roti", 1, 5),
    kelapa = new Item("./img/kelapa.png", "Kelapa", 2, 10);
    kelapa2 = new Item("./img/kelapa.png", "Kelapa2", 2, 10);
    kelapa3 = new Item("./img/kelapa.png", "Kelapa3", 2, 10);
    kelapa4 = new Item("./img/kelapa.png", "Kelapa4", 2, 10);

var select = [
    [tangga, roti, kelapa],
    [kelapa2, kelapa3, kelapa4]
];

// Masukkan barang dalam inventory
function masuk(item) {
    'use strict';
    var i,
        inv_arrLength = inv_arr.length,
        had = false,
        index;
    
    // Uji item dah ada ke belum
    for (i = 0; i < inv_arrLength; i++) {
        if (inv_arr[i] === item) {
            had = true;
            index = i;
        }
    }
    
    if (had) {
        inv_arrQty[index]++;
    } else {
        inv_arr.push(item);
        inv_arrQty.push(1);
    }
}

var entArray = [
    // Main character
    boxman = new Character("./img/mainChar.png", null),
    
    // Invisible walls
    invWalls1 = new Entity(),
    invWalls2 = new Entity(),
    invWalls3 = new Entity(),
    invWalls4 = new Entity(),
    invWalls5 = new Entity(),
    invWalls6 = new Entity(),
    invWalls7 = new Entity(),
    invWalls8 = new Entity(),
    invWalls9 = new Entity(),
    invWalls10 = new Entity(),
    invWalls11 = new Entity(),
    invWalls12 = new Entity(),
    invWalls13 = new Entity(),
    invWalls14 = new Entity(),
    invWalls15 = new Entity(),
    invWalls16 = new Entity(),
    
    // NPCs
    monstak = new Character("./img/monsta.png", 0),
    boxbiru = new Character("./img/npc_biru.png", 1),
    kk = new Character("./img/kk.png", 2),
    
    // Objects
    crate = new Character("./img/crate.png", null)
];

// Sama macam entArray cuma takde boxman
var entArray2 = entArray.slice(1);

tile.src = "./img/tile_gmc6.png";
tile2.src = "./img/tile2.png";
bubble.src = "./img/speech_bubble3.png";
typeface.src = "./img/gohufont_sprite.png";

// Insert polyfill here

// tileNo[currentScene][layer][baris]
tileNo = [
    [ // scene0 /////////////////////////////////////////////////////////////////////
        [ // layer 0
            [3, 3, 3, 3, 3, 3, 3, 3, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 3, 3, 3, 3, 3, 3, 3, 3, 2, 3, 3],
            [3, 2, 3, 3, 3, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,13,13,13,13,13, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,13,13,13,13,13, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,13,13,13,13,13, 3, 3, 3, 3, 3],
            [3, 3, 2, 3, 3, 3, 2, 3, 3, 3, 3, 3, 3, 3,13,13,13,13,13, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 3, 3, 3, 3, 3, 1, 3, 3, 3, 3, 2, 3, 3],
            [3, 3, 4, 5, 5, 5, 6, 3, 3, 3, 3, 3, 3, 3, 3, 2, 3, 3, 3, 3, 3, 3, 3, 3],
            [3, 3, 7, 8, 8, 8, 9, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
            [3, 3, 7, 8, 8, 8, 9, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
            [3, 3, 7, 8, 8, 8, 9, 3, 3, 3, 2, 3, 3, 3, 3, 3, 2, 3, 3, 3, 3, 3, 3, 3],
            [3, 3,10,11,11,11,12, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 3, 3],
            [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
            [3, 2, 3, 3, 3, 2, 3, 3, 3, 3, 3, 3, 3, 2, 3, 3, 3, 3, 3, 3, 3, 2, 3, 3],
            [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]
        ],
        [ // layer 1
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 3],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 5, 5, 6],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 8],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 8],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9,10,10,10,11],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,12,12,13,12,12]
        ]
    ],
    [ // scene1 /////////////////////////////////////////////////////////////////////
        [ // layer 0
            [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]
        ]
    ]
];

// Function untuk pilih scene
function gotoScene(scene) {
    'use strict';
    
    currentScene = scene;
    
    enpisi = undefined;
    
    // View kat tempat yang betul
    vx = 0;
    vy = 0;
    
    entArray = []; // Kosongkan
    
    if (scene === 0) {
        entArray = [
            boxman,
            invWalls1,
            invWalls2,
            invWalls3,
            invWalls4,
            invWalls5,
            invWalls6,
            invWalls7,
            invWalls8,
            invWalls9,
            invWalls10,
            invWalls11,
            invWalls12,
            invWalls13,
            invWalls14,
            invWalls15,
            invWalls16,
            monstak,
            boxbiru,
            kk,
            crate
        ];
        
        entArray2 = entArray.slice(1);
        
        boxman.x = 160;
        boxman.y = 96;
        
        monstak.x = 224;
        monstak.y = 96;
        
        boxbiru.x = 224;
        boxbiru.y = 256;
        
        kk.x = 512;
        kk.y = 128;
        
        crate.x = 128;
        crate.y = 128;
        
        // Invisible walls
        invWalls1.x = 64;
        invWalls1.y = 256;
        invWalls2.x = 96;
        invWalls2.y = 256;
        invWalls3.x = 128;
        invWalls3.y = 256;
        invWalls4.x = 160;
        invWalls4.y = 256;
        invWalls5.x = 192;
        invWalls5.y = 256;
        
        invWalls6.x = 64;
        invWalls6.y = 288;
        invWalls7.x = 192;
        invWalls7.y = 288;
        
        invWalls8.x = 64;
        invWalls8.y = 320;
        invWalls9.x = 192;
        invWalls9.y = 320;
        
        invWalls10.x = 64;
        invWalls10.y = 352;
        invWalls11.x = 192;
        invWalls11.y = 352;
        
        invWalls12.x = 64;
        invWalls12.y = 384;
        invWalls13.x = 96;
        invWalls13.y = 384;
        invWalls14.x = 128;
        invWalls14.y = 384;
        invWalls15.x = 160;
        invWalls15.y = 384;
        invWalls16.x = 192;
        invWalls16.y = 384;
    } else if (scene === 1) {
        entArray = [
            boxman,
            crate
        ];
        
        entArray2 = entArray.slice(1);
        
        boxman.x = 160;
        boxman.y = 96;
        
        crate.x = 128;
        crate.y = 128;
    }
}

// Function untuk lukis tiles
function drawTiles(row, column, scene, layer, tileset) {
    'use strict';
    for (var i = column, tileNo0_l = tileNo[scene][layer][0].length; i < tileNo0_l; i++) {
        for (var j = row, tileNo_l = tileNo[scene][layer].length; j < tileNo_l; j++) {
            if (tileNo[scene][layer][j][i] !== 0) // if 0, do nothing
            ctx.drawImage(
                tileset,
                0,
                tileNo[scene][layer][j][i] * tileHeight,
                tileWidth,
                tileHeight,
                i * tileWidth - vx,
                j * tileHeight - vy,
                tileWidth,
                tileHeight);
        }
    }
}

// Function untuk draw watak ikut depth
function drawCharacters() {
    'use strict';
    var entArray_length = entArray.length;
    
    /* Susun entities ikut depth */
    entArray.sort(function(a, b) {
        return b.depth - a.depth;
    });
    
    // Lukis ikut turutan
    for (var i = 0; i < entArray_length; i++) {
        if (entArray[i] !== undefined) {
            if (entArray[i].x-vx >= -32
                && entArray[i].x-vx < game_canvas.width
                && entArray[i].y-vy >= -32
                && entArray[i].y-vy < game_canvas.height) {
                entArray[i].inView = true;
                if (entArray[i] instanceof Character) {
                    entArray[i].draw();
                }
            } else {
                entArray[i].inView = false;
            }
        }
    }
}

function movements() {
    'use strict';
    // If alligned to grid
    if (boxman.x % 32 === 0 && boxman.y % 32 === 0) {
        alligned = true;
        
        if (up) {
            boxman.frame_column = 1;
            boxman.arah_ver = 1;
            boxman.frame_row = 0 + 4 * boxman.arah_ver;
        }
        
        if (down) {
            boxman.frame_column = 1;
            boxman.arah_ver = 0;
            boxman.frame_row = 0 + 4 * boxman.arah_ver;
        }
        
        if (left) {
            boxman.frame_column = 0;
            boxman.arah_hor = 1;
            boxman.frame_row = 0 + 4 * boxman.arah_hor;
        }
        
        if (right) {
            boxman.frame_column = 0;
            boxman.arah_hor = 0;
            boxman.frame_row = 0 + 4 * boxman.arah_hor;
        }
        
        if (!up && !down) { // disable diagonal movements
            if (left) {
                boxman.hspeed = -2;
            }
            
            if (right) {
                boxman.hspeed = 2;
            }
        }
        
        if (!left && !right) { // disable diagonal movements
            if (up) {
                boxman.vspeed = -2;
            }
            
            if (down) {
                boxman.vspeed = 2;
            }
        }
        
        if (!left && !right) boxman.hspeed = 0;
        
        if (!up && !down) boxman.vspeed = 0;
        
        if (dahlepas_inv && inv) {
            currentScene = 5;
            dahlepas_inv = false;
        }
    } else {
        //alligned = false;
        alligned = true; // coba
    }
}

// Guna semasa dalam menu
function navigate() {
    'use strict';
    /*if (up) {
        boxman.frame_column = 1;
        boxman.arah_ver = 1;
        boxman.frame_row = 0 + 4 * boxman.arah_ver;
    }

    if (down) {
        boxman.frame_column = 1;
        boxman.arah_ver = 0;
        boxman.frame_row = 0 + 4 * boxman.arah_ver;
    }*/
    
    if (boleh_tekan) {
        // Row
        if (up) {
            if (row === 0) {
                row = 1;
            } else {
                row -= 1;
            }
            boleh_tekan = false;
        }

        if (down) {
            row = (row + 1) % 2;
            boleh_tekan = false;
        }
        
        // Column
        if (left) {
            if (col === 0) {
                col = 2;
            } else {
                col -= 1;
            }
            boleh_tekan = false;
        }

        if (right) {
            col = (col + 1) % 3;
            boleh_tekan = false;
        }
    }
    
    if (!(up || down || left || right)) boleh_tekan = true;
/*
    if (!up && !down) { // disable diagonal movements
        if (left) {
            boxman.hspeed = -2;
        }

        if (right) {
            boxman.hspeed = 2;
        }
    }

    if (!left && !right) { // disable diagonal movements
        if (up) {
            boxman.vspeed = -2;
        }

        if (down) {
            boxman.vspeed = 2;
        }
    }

    if (!left && !right) boxman.hspeed = 0;

    if (!up && !down) boxman.vspeed = 0;

    if (dahlepas_inv && inv) {
        currentScene = 5;
        dahlepas_inv = false;
    }*/
}

// Gerakkan boxman dan crate
function motion() {
    'use strict';
    if (boxman.hspeed > 0) {
        if (!collisionR) {
            if (crate.x === boxman.x + 32 && crate.y === boxman.y) {
                if (!collisionR2) boxman.x += boxman.hspeed / 2;
            } else {
                boxman.x += boxman.hspeed;
            }
        }
        
        if (!collisionR2
            && crate.can_interact
            && crate.x > boxman.x
            && crate.x + boxman.hspeed > boxman.x) crate.x += boxman.hspeed / 2;
    } else if (boxman.hspeed < 0) {
        if (!collisionL) {
            if (crate.x === boxman.x - 32 && crate.y === boxman.y) {
                if (!collisionL2) boxman.x += boxman.hspeed / 2;
            } else {
                boxman.x += boxman.hspeed;
            }
        }
        if (!collisionL2
            && crate.can_interact
            && crate.x < boxman.x
            && crate.x + boxman.hspeed < boxman.x) crate.x += boxman.hspeed / 2;
    }
    //////////////////////////////////////////
    if (boxman.vspeed > 0) {
        if (!collisionD) {
            if (crate.y === boxman.y + 32 && crate.x === boxman.x) {
                if (!collisionD2) boxman.y += boxman.vspeed / 2;
            } else {
                boxman.y += boxman.vspeed;
            }
        }
        if (!collisionD2
            && crate.can_interact
            && crate.y > boxman.y
            && crate.y + boxman.vspeed > boxman.y) crate.y += boxman.vspeed / 2;
    } else if (boxman.vspeed < 0) {
        if (!collisionU) {
            if (crate.y === boxman.y - 32 && crate.x === boxman.x) {
                if (!collisionU2) boxman.y += boxman.vspeed / 2;
            } else {
                boxman.y += boxman.vspeed;
            }
        }
        if (!collisionU2
            && crate.can_interact
            && crate.y < boxman.y
            && crate.y + boxman.vspeed < boxman.y) crate.y += boxman.vspeed / 2;
    }
}

//Animasi untuk boxman
function boxmanAnimate(box_x, box_y) {
    'use strict';
    if (box_x !== boxman.x) { // Kalau kedudukan berubah
        boxman.frame_column = 0;
        if (boxman.pelambat === 0) {
            boxman.frame_row = 4 * boxman.arah_hor + (boxman.frame_row + 1) % 4;
        }
        boxman.pelambat = (boxman.pelambat + 1) % 4;
    } else if (box_y !== boxman.y) { // Kalau kedudukan berubah
        boxman.frame_column = 1;
        if (boxman.pelambat === 0) {
            boxman.frame_row = 4 * boxman.arah_ver + (boxman.frame_row + 1) % 4;
        }
        boxman.pelambat = (boxman.pelambat + 1) % 4;
    }/* else { // Kalau stay (macam tak perlu)
        boxman.frame_row = 0 + 4 * boxman.arah_hor;
    }*/
}

function collisionCheck(box_x, box_y) {
    'use strict';
    var entArray2_length = entArray2.length;
    for (var ent = 0; ent < entArray2_length; ent++) {
        // Uji jarak boleh bercakap
        if (((boxman.x === entArray2[ent].x-32 || boxman.x === entArray2[ent].x+32)
            && (boxman.y === entArray2[ent].y))
            || ((boxman.x === entArray2[ent].x)
            && (boxman.y === entArray2[ent].y-32 || boxman.y === entArray2[ent].y+32))) {
            entArray2[ent].can_interact = true;
            if (entArray2[ent] !== crate) // coba
                enpisi = entArray2[ent];
            if (enpisi !== undefined
                && enpisi.textID !== null
                && enpisi instanceof Character) {
                tulis(
                    text[enpisi.textID][enpisi.text],
                    boxman,
                    box_x,
                    box_y,
                    enpisi);
            }
        } else {
            entArray2[ent].can_interact = false;
            entArray2[ent].legap = 0;
        }
        
        // Uji collision
        if (entArray2[ent].inView && entArray2[ent] !== crate) {
            if (entArray2[ent].y === boxman.y) {
                if (entArray2[ent].x === boxman.x - 32) {
                    collisionL = true;
                } else if (entArray2[ent].x === boxman.x - 64) {
                    collisionL2 = true;
                } else if (entArray2[ent].x === boxman.x + 32) {
                    collisionR = true;
                } else if (entArray2[ent].x === boxman.x + 64) {
                    collisionR2 = true;
                }
            } else if (entArray2[ent].x === boxman.x) {
                if (entArray2[ent].y === boxman.y - 32) {
                    collisionU = true;
                } else if (entArray2[ent].y === boxman.y - 64) {
                    collisionU2 = true;
                } else if (entArray2[ent].y === boxman.y + 32) {
                    collisionD = true;
                } else if (entArray2[ent].y === boxman.y + 64) {
                    collisionD2 = true;
                }
            }
        }
    }
}

function drawTextbox(player, NPC, ygbercakap_x, ygbercakap_y, text_width) {
    var x1, y1, x2, y2;
    
    if (player.x !== NPC.x) {
        if (NPC.tukar !== 0) {
            x1 = ygbercakap_x - vx + 16 - (text_width / 2 + 10);
            y1 = ygbercakap_y - vy - 57;
            x2 = ygbercakap_x - vx + 16 + (text_width / 2 + 10);
            y2 = ygbercakap_y - vy - 13;
            
            x1 += 10;
            x2 -= 10;

            //drawImage(image,sx,sy,sw,sh,dx,dy,dw,dh)
            ctx.drawImage(bubble, 4, 0, 1, 44, x1, y1, x2 - x1, 44); // latar
            ctx.drawImage(bubble, 0, 0, 10, 44, x1 - 10, y1, 10, 44);
            ctx.drawImage(bubble, 40, 0, 10, 44, x2, y1, 10, 44);
            ctx.drawImage(bubble, 20, 42, 10, 7, ygbercakap_x - vx + 11, y2 - 2, 10, 7); // segi tiga
        }
    } else { // player.x === NPC.x
        if (NPC.tukar !== 0) {
            if ((ygbercakap_y === NPC.y && NPC.y < player.y)
                || (ygbercakap_y === player.y && NPC.y > player.y)) {
                x1 = ygbercakap_x - vx + 16 - (text_width / 2 + 10);
                y1 = ygbercakap_y - vy - 57;
                x2 = ygbercakap_x - vx + 16 + (text_width / 2 + 10);
                y2 = ygbercakap_y - vy - 13;

                x1 += 10;
                x2 -= 10;

                //drawImage(image,sx,sy,sw,sh,dx,dy,dw,dh)
                ctx.drawImage(bubble, 4, 0, 1, 44, x1, y1, x2 - x1, 44); // latar
                ctx.drawImage(bubble, 0, 0, 10, 44, x1 - 10, y1, 10, 44);
                ctx.drawImage(bubble, 40, 0, 10, 44, x2, y1, 10, 44);
                ctx.drawImage(bubble, 20, 42, 10, 7, ygbercakap_x - vx + 11, y2 - 2, 10, 7); // segi tiga
            } else {
                x1 = ygbercakap_x - vx + 16 - (text_width / 2 + 10);
                y1 = ygbercakap_y - vy + 45;
                x2 = ygbercakap_x - vx + 16 + (text_width / 2 + 10);
                y2 = ygbercakap_y - vy + 89;

                x1 += 10;
                x2 -= 10;

                //drawImage(image,sx,sy,sw,sh,dx,dy,dw,dh)
                ctx.drawImage(bubble, 4, 0, 1, 44, x1, y1, x2 - x1, 44); // latar
                ctx.drawImage(bubble, 0, 0, 10, 44, x1 - 10, y1, 10, 44);
                ctx.drawImage(bubble, 40, 0, 10, 44, x2, y1, 10, 44);
                ctx.drawImage(bubble, 20, 15, 10, 7, ygbercakap_x - vx + 11, y1 - 5, 10, 7); // segi tiga
            }
        }
    }
}

function textToBekas(bekasIndex, text) {
    'use strict';
    var text_length = text.length;
    
    for (var i = 0; i < text_length; i++) {
        bekas[bekasIndex][i] = (text.charCodeAt(i) - 32) * char_width;
    }
}

// LUKIS TEXTBOX + 'TULIS' ////////////////
function tulis(text, player, player_x, player_y, NPC) {
    'use strict';
    sdgcakap = (NPC.tukar === 0) ? false : true;
    
    NPC.legap += 0.1;
	if (NPC.legap > 1) NPC.legap = 1; // hadkan nilai legap
    
    if (!sdgcakap) {
        if (player.x === player_x && player.y === player_y) { // Kalau kedudukan tak berubah
            ctx.fillStyle = 'rgba(255, 255, 255, ' + NPC.legap + ')';
            
            // coba
            /*ctx.save();
            ctx.globalAlpha = NPC.legap;
            ctx.fillStyle = 'rgb(255, 255, 255)';
            ctx.restore();*/
            // endcoba ///////////////
            
            ygbercakap = player;
            
            drawTextbox(player, NPC, ygbercakap.x, ygbercakap.y, text_width);
        }
    } else {
        //Tukar sprite player berdasarkan kedudukan NPC
        if (player.x > NPC.x) {
            player.frame_column = 0;
            player.arah_hor = 1;
            boxman.frame_row = 4 * boxman.arah_hor;
        } else if (player.x < NPC.x) {
            player.frame_column = 0;
            player.arah_hor = 0;
            boxman.frame_row = 4 * boxman.arah_hor;
        } else if (player.y > NPC.y) {
            player.frame_column = 1;
            player.arah_ver = 1;
            boxman.frame_row = 4 * boxman.arah_ver;
        } else if (player.y < NPC.y) {
            player.frame_column = 1;
            player.arah_ver = 0;
            boxman.frame_row = 4 * boxman.arah_ver;
        }
        
        var ygbercakap = (text[NPC.tukar][21] === '#') ? NPC : player;
        
        var text_width; //lebar dalam pixel
        if (var_panjang[0] > var_panjang[1]) {
            text_width = var_panjang[0] * char_width;
        } else {
            text_width = var_panjang[1] * char_width;
        }
        
        ctx.fillStyle = '#FFF';
        
        drawTextbox(player, NPC, ygbercakap.x, ygbercakap.y, text_width);

        // 'TULIS' //////////////////
        // bekas[0] (baris pertama)
        
        var string_reg_x = ygbercakap.x - vx + 16 - var_panjang[0] * char_width / 2;
        
        if (player.x === NPC.x) {
            if ((ygbercakap === NPC && NPC.y < player.y)
                || (ygbercakap === player && NPC.y > player.y)) {
                var string_reg_y = ygbercakap.y - 46; //13 + char_height*3 = 46
            } else {
                var string_reg_y = ygbercakap.y + 56; //46+32-char_height*2= 56
            }
        } else {
            var string_reg_y = ygbercakap.y - 46; //13 + char_height*3 = 46
        }

        var i;

        // panjang_teks untuk simpan bil aksara
        panjang_teks = text[NPC.tukar].substring(0, 21).trim().length;

        // kosongkan bekas sebelum isi nombor baru
        // Kena ubah supaya lebih efficient///////
        for (i = 0; i < panjang_teks; i++) {
            bekas[0][i] = 0;
        }

        var_panjang[0] += (var_panjang[0] < panjang_teks) ? 1 : 0;
        textToBekas(0, text[NPC.tukar].substring(0, var_panjang[0]));
        
        for (i = 0; i < panjang_teks; i++) {
            //drawImage(image,sx,sy,sw,sh,dx,dy,dw,dh)
            ctx.drawImage(
                typeface,
                bekas[0][i],
                0,
                char_width,
                char_height,
                string_reg_x + i * char_width,
                string_reg_y - vy,
                char_width,
                char_height);
        }

        // bekas[1] (baris kedua)
        //text = text[3].substring(22);

        // kosongkan bekas sebelum isi nombor baru
        // Kena ubah supaya lebih efficient /////////////////
        var pjg_teks_sblm = panjang_teks;
        panjang_teks = text[NPC.tukar].substring(22).length; //bil aksara
        for (i = 0; i < panjang_teks; i++) {
            bekas[1][i] = 0;
        }

        //kalau line yg pertama dah habis tulis
        if (var_panjang[0] === pjg_teks_sblm) {
            var_panjang[1] += (var_panjang[1] < panjang_teks) ? 1 : 0;
        }

        textToBekas(1, text[NPC.tukar].substring(22, 22 + var_panjang[1]));
        
        string_reg_x = ygbercakap.x - vx + 16 - var_panjang[1] * char_width / 2;
        
        string_reg_y += 11;
        for (i = 0; i < panjang_teks; i++) {
            //drawImage(image,sx,sy,sw,sh,dx,dy,dw,dh)
            ctx.drawImage(
                typeface,
                bekas[1][i],
                0,
                char_width,
                char_height,
                string_reg_x + i * char_width,
                string_reg_y - vy,
                char_width,
                char_height);
        }
        
        // ketengahkan kamera ke character yang bercakap
        if (initWidth / 2 !== ygbercakap.x - vx + 16 || initHeight / 2 !== ygbercakap.y - vy + 16) {
            cameraCounter = (cameraCounter + 1) % sineTblBerubah_length;
            if (ygbercakap.x - vx + 16 > initWidth / 2) {
                if (vx + sineTblBerubah[cameraCounter] <= 416)
                    vx += sineTblBerubah[cameraCounter];
            } else if (ygbercakap.x - vx + 16 < initWidth / 2) {
                if (vx - sineTblBerubah[cameraCounter] >= 0)
                    vx -= sineTblBerubah[cameraCounter];
            } else if (ygbercakap.y - vy + 16 > initHeight / 2) {
                if (vy + sineTblBerubah[cameraCounter] <= 384)
                    vy += sineTblBerubah[cameraCounter];
            } else if (ygbercakap.y - vy + 16 < initHeight / 2) {
                if (vy - sineTblBerubah[cameraCounter] >= 0)
                    vy -= sineTblBerubah[cameraCounter];
            }
        } else {
            cameraCounter = 0;
        }
        
        /*if (ygbercakap.x - vx + 16 > initWidth / 2) {
            if (ygbercakap.x - vx + 20 > initWidth / 2) { //16 + 4 = 20
                if (vx + 4 <= 416) vx += 4; // 24tiles * 32px = 768
            } else {
                if (vx + 1 <= 416) vx += 1; // 768 - initWidth
            }
        } else if (ygbercakap.x - vx + 16 < initWidth / 2) {
            if (ygbercakap.x - vx + 12 < initWidth / 2) { //16 - 4 = 12
                if (vx - 4 >= 0) vx -= 4;
            } else {
                if (vx - 1 >= 0) vx -= 1;
            }
        } else if (ygbercakap.y - vy + 16 > initHeight / 2) {
            if (ygbercakap.y - vy + 20 > initHeight / 2) { //16 + 4 = 20
                if (vy + 4 <= 384) vy += 4; // 19tiles * 32px = 608
            } else {
                if (vy + 1 <= 384) vy += 1; // 608 - initHeight
            }
        } else if (ygbercakap.y - vy + 16 < initHeight / 2) {
            if (ygbercakap.y - vy + 12 < initHeight / 2) { //16 - 4 = 12
                if (vy - 4 >= 0) vy -= 4;
            } else {
                if (vy - 1 >= 0) vy -= 1;
            }
        }*/
    }
}

function gameLoop() {
    'use strict';
    
    if (resizeCanvas) {
        if (window.innerHeight < window.innerWidth) {
            scale = Math.floor(window.innerHeight / initHeight);
        } else {
            scale = Math.floor(window.innerWidth / initWidth);
        }
        
        canvas.width = initWidth * scale;
        canvas.height = initHeight * scale;
        
        console.log(canvas.width + "x" + canvas.height);
        
        // Ketengahkan canvas
        canvas.style.left = window.innerWidth / 2 - canvas.width / 2 + 'px';
        canvas.style.top = window.innerHeight / 2 - canvas.height / 2 + 'px';
        
        ctx.imageSmoothingEnabled = false;
        
        ctx.scale(scale, scale);
        
        resizeCanvas = false;
    }
    
    setTimeout(function() {
        window.requestAnimationFrame(gameLoop);
    }, interval);
    ctx.clearRect(0, 0, initWidth, initHeight);

    // Scenes
    switch (currentScene) {
        case 0:
            scene0();
            break;
        case 1:
            scene1();
            break;
        case 5:
            inventory();
            break;
    }
}

function scene0() {
    'use strict';
    
    collisionL = false;
    collisionR = false;
    collisionD = false;
    collisionU = false;
    
    collisionL2 = false;
    collisionR2 = false;
    collisionD2 = false;
    collisionU2 = false;
    
    drawTiles(0, 0, currentScene, 0, tile);
    
    // Tetapkan depth
    boxman.depth = -boxman.y;
    if (monstak !== undefined) // coba
        monstak.depth = -monstak.y;
    boxbiru.depth = -boxbiru.y;
    kk.depth = -kk.y;
    crate.depth = -crate.y;

    // Draw watak ikut depth
    drawCharacters();
    
    // Draw tiles for second layer
    drawTiles(1, 14, currentScene, 1, tile2);
    
    ///////////////////////////
    
    // Tukar frame index monstak berdasarkan
    // kedudukan boxman
    if (monstak !== undefined) // coba
        monstak.frame_row = (boxman.x > monstak.x) ? 0 : 4;
    
    // Tukar frame index kk berdasarkan
    // kedudukan boxman
    kk.frame_row = (boxman.x > kk.x) ? 0 : 1;
    
    if (!sdgcakap) {
        movements();
        
        // Simpan nilai x dan y
        box_x = boxman.x;
        box_y = boxman.y;
        
        // If alligned to grid
        if (alligned) {
            // Uji jarak dan collision
            collisionCheck(box_x, box_y);
            
            unlock = (crate.x === 32 && crate.y === 32) ? true : false;
        }
        
        // Gerakkan boxman dan crate
        motion();
        
        boxmanAnimate(box_x, box_y);
        
        // KAMERA ////////////////////////////
        if (boxman.x >= 160 && boxman.x <= 576) { // 160 = 352/2 - 16
            bezaX = boxman.x-vx - 160;
            vx += bezaX;
        }
        
        if (boxman.y >= 96 && boxman.y <= 480) {
            bezaY = boxman.y-vy - 96;
            vy += bezaY;
        }
        ///////////////////////////////////////
    } else if (enpisi.textID !== null) {
        console.log(text[enpisi.textID][enpisi.text][enpisi.tukar]);
        
        tulis(
            text[enpisi.textID][enpisi.text],
            boxman,
            box_x,
            box_y,
            enpisi);
    }
} //scene0

function scene1() {
    'use strict';
    
    collisionL = false;
    collisionR = false;
    collisionD = false;
    collisionU = false;
    
    collisionL2 = false;
    collisionR2 = false;
    collisionD2 = false;
    collisionU2 = false;
    
    drawTiles(0, 0, currentScene, 0, tile);
    
    // Tetapkan depth
    boxman.depth = -boxman.y;
    crate.depth = -crate.y;

    // Draw watak ikut depth
    drawCharacters();
    
    movements();
    
    // Simpan nilai x dan y
    box_x = boxman.x;
    box_y = boxman.y;
    
    // If alligned to grid
    if (alligned) {
        collisionCheck(box_x, box_y);
    }
    
    // Gerakkan boxman dan crate
    motion();
    
    boxmanAnimate(box_x, box_y);
} //scene1

function inventory() {
    'use strict';
    
    // Nanti tukar guna unit relative supaya
    // jadi responsive
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 17, 176, 207);
    
    ctx.fillStyle = '#404040';
    ctx.fillRect(176, 17, 176, 207);
    
    ctx.fillStyle = '#515151';
    ctx.fillRect(0, 0, game_canvas.width, 17);
    
    ctx.fillRect(188, 144, 152, 21);
    
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 5; j++) {
            ctx.fillStyle = '#5B5B5B';
            ctx.fillRect(12 + 40 * i, 24 + 40 * j, 32, 32);
        }
    }
    
    ctx.fillRect(188, 24, 152, 112);
    
    ctx.fillRect(188, 165, 152, 51);
    
    ctx.fillStyle = '#494949';
    ctx.fillRect(193, 29, 142, 102);
    
    /*ctx.fillStyle = '#404040';
    ctx.fillRect(0, 0, 115, game_canvas.height);
    
    ctx.fillStyle = '#515151';
    ctx.fillRect(115, 0, game_canvas.width - 115, game_canvas.height);*/
    
    navigate();
    
    // Tak fleksibel
    if (inv_arr.length > 0 && inv_arr[0] === tangga) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(12 + 40 * col, 24 + 40 * row, 32, 32);
        ctx.fillStyle = '#707070';
        ctx.fillRect(13 + 40 * col, 25 + 40 * row, 30, 30);
        ctx.drawImage(tangga.sprite, 12, 24);
        ctx.drawImage(roti.sprite, 52, 24);
        ctx.drawImage(kelapa.sprite, 92, 24);
        select[row][col].describe();
    }
    
    if (dahlepas_inv && inv) {
        currentScene = 0;
        dahlepas_inv = false;
    }
} //inventory

/*function kedai() {
    'use strict';
    
    ctx.fillStyle = '#404040';
    ctx.fillRect(0, 0, 115, game_canvas.height);
    
    ctx.fillStyle = '#515151';
    ctx.fillRect(115, 0, game_canvas.width - 115, game_canvas.height);
    
    // Tak fleksibel
    if (inv_arr.length > 0 && inv_arr[0] === tangga) {
        ctx.drawImage(tangga.sprite, 135, 30);
    }
    
    if (dahlepas_inv && inv) {
        currentScene = 0;
        dahlepas_inv = false;
    }
} //kedai*/

document.addEventListener('keydown', function (event) {
    switch (event.keyCode) {
        case 32:
            space = true;
            
            // If allined to grid
            if (alligned) {
                if (enpisi !== undefined && enpisi.can_interact && dahlepas_space) {
                    if (var_panjang[1] === panjang_teks) {
                        // Kosongkan var_panjang
                        var_panjang = [0,0];
                        if (enpisi.tukar < text[enpisi.textID][enpisi.text].length - 1) {
                            enpisi.tukar += 1;
                        } else {
                            panjang_teks = 0;
                            enpisi.tukar = 0;
                            if (enpisi === kk && kk.text === 0) {
                                masuk(tangga);
                                kk.text = 1;
                            }
                        }
                        dahlepas_space = false;
                    }
                }
            }
            
            break;
        case 37:
            left = true;
            break;
        case 38:
            up = true;
            break;
        case 39:
            right = true;
            break;
        case 40:
            down = true;
            break;
        case 73:
            inv = true;
            break;
    }
});

document.addEventListener('keyup', function (event) {
    switch (event.keyCode) {
        case 32:
            space = false;
            dahlepas_space = true;
            break;
        case 37:
            left = false;
            break;
        case 38:
            up = false;
            break;
        case 39:
            right = false;
            break;
        case 40:
            down = false;
            break;
        case 73:
            inv = false;
            dahlepas_inv = true;
            break;
    }
});

game_canvas.addEventListener('mouseup', function (event) {
    console.log('asdasd');
});

window.addEventListener('resize', function() {
    resizeCanvas = true;
}, false);

gotoScene(0);
gameLoop();