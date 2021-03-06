// TO-DO: Jadikan resolution 240x160 (GBA)

let interval = 1000 / 60,
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
    initWidth = 352,
    initHeight = 224,
    scale = 1,
    
    // Untuk draw
    default_h = 32,

    box_x,
    box_y,
    
    vx = 0,
    vy = 0,
    
    bezaX,
    bezaY,
    dpad = 0,
    arrowkey = 0,
    space = false,
    inv = false,
    
    // Guna untuk inventory
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
    aligned = false,
    grid = 32,
    collision = 0,
    
    // Variables untuk dialog
    typeface = new Image(),
    typefacew = new Image(),
    sdgcakap = false,
    bekas = [[],[]],
    panjang_teks = 0,
    var_panjang = [0, 0], //untuk buat FX menaip pada string
    char_width = 6,
    char_height = 11,
    
    ctx = canvas.getContext('2d');

typefacew.src = "./img/gohufont_spritew.png";

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

sineTblBerubah_length = sineTblBerubah.length;

// Entity object
let Entity = {
    x: null,
    y: null,
    w: 32,
    h: 32,
    hspeed: 0,
    vspeed: 0,
    inView: false,
    
    // Getters
    getX() { return this.x },
    getY() { return this.y },
    getW() { return this.w },
    getH() { return this.h },
    getHSpeed() { return this.hspeed },
    getVSpeed() { return this.vspeed },
    getInView() { return this.inView },
    
    // Setters
    setX(X) { this.x = X },
    setY(Y) { this.y = Y },
    setW(W) { this.w = W },
    setH(H) { this.h = H },
    setHSpeed(hs) { this.hspeed = hs },
    setVSpeed(vs) { this.vspeed = vs },
    setInView(iv) { this.inView = iv }
}

// Character object, derived from Entity
let Character = function(img_src, txtID) {
    let char = Object.assign(Object.create(Entity), {
        arah_hor: 0,
        arah_ver: 0,
        frame_row: 0,
        frame_column: 0,
        pelambat: 0,
        depth: 0,
        textID: txtID,
        text: 0,
        legap: 0,
        can_interact: false,
        tukar: -1
    });
    
    char.sprite = new Image();
    char.sprite.src = img_src;
    char.draw = function() {
        let width = this.getW();
        let height = this.getH();

        //drawImage(image,sx,sy,sw,sh,dx,dy,dw,dh)
        ctx.drawImage(
            this.sprite,
            this.frame_column * width,
            this.frame_row * height,
            width,
            height,
            this.getX() - vx,
            this.getY() - vy - height + default_h,
            width,
            height
        );
    }
    
    return char;
}

// Item constructor
function Item(img_src, name, stackable, textID, price) {
    this.sprite = new Image();
    this.sprite.src = img_src;
    this.name = name;
    this.stackable = stackable;
    this.textID = textID;
    this.price = price;
    this.describe = () => {
        var desc_length = text[3][0][this.textID].length;
        
        for (var i = 0; i < this.name.length; i++) {
            //drawImage(image,sx,sy,sw,sh,dx,dy,dw,dh)
            ctx.drawImage(
                typefacew,
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
                typefacew,
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
                typefacew,
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

// Barang-barang
var tangga = new Item("./img/tangga.png", "Tangga", false, 0, 20),
    roti = new Item("./img/roti.png", "Roti", true, 1, 5),
    kelapa = new Item("./img/kelapa.png", "Kelapa", true, 2, 10),
    kelapa2 = new Item("./img/kelapa.png", "Kelapa2", true, 2, 10),
    kelapa3 = new Item("./img/kelapa.png", "Kelapa3", true, 2, 10),
    kelapa4 = new Item("./img/kelapa.png", "Kelapa4", true, 2, 10);

// Masukkan barang dalam inventory
const masuk = (item) => {
    var i,
        inv_arrLength = inv_arr.length,
        had = false,
        index;
    
    // Uji item dah ada ke belum
    for (i = 0; i < inv_arrLength; i++) {
        if (inv_arr[i] === item) {
            had = true;
            index = i;
            break;
        }
    }
    
    if (had && inv_arr[index].stackable) {
        inv_arrQty[index]++;
    } else {
        inv_arr.push(item);
        inv_arrQty.push(1);
    }
}

var entArray = [
    // Main character
    boxman =  Character("./img/mainChar.png", null),
    
    // NPCs
    monstak = new Character("./img/monsta.png", 0),
    boxbiru = new Character("./img/npc_biru.png", 1),
    kk = new Character("./img/kk.png", 2),
    //kk = new Character("./img/kk2.png", 2),
    
    // Objects
    crate = new Character("./img/crate.png", null)
];

// Default value is 32
//kk.setH(48);

// Sama macam entArray cuma takde boxman
var entArray2 = entArray.slice(1);

tile.src = "./img/tile_gmc6.png";
tile2.src = "./img/tile2.png";
bubble.src = "./img/speech_bubble3.png";
typeface.src = "./img/gohufont_sprite.png";

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
    ]
];

let leftside = initWidth / 2 - tileWidth / 2;
let sceneWidth;
let topside = initHeight / 2 - tileHeight / 2;
let sceneHeight;

// Function untuk pilih scene
const initScene = (scene) => {
    currentScene = scene;
    
    enpisi = undefined;
    
    // View kat tempat yang betul
    vx = 0;
    vy = 0;
    
    entArray = []; // Kosongkan
    
    if (scene === 0) {
        entArray = [
            boxman,
            monstak,
            boxbiru,
            kk,
            crate
        ];
        
        entArray2 = entArray.slice(1);
        
        boxman.setX(160);
        boxman.setY(96);
        
        monstak.setX(224);
        monstak.setY(96);
        
        boxbiru.setX(224);
        boxbiru.setY(256);
        
        kk.setX(512);
        kk.setY(128);
        
        crate.setX(128);
        crate.setY(128);
    } else if (scene === 1) {
        entArray = [
            boxman,
            crate
        ];
        
        entArray2 = entArray.slice(1);
        
        boxman.setX(160);
        boxman.setY(96);
        
        crate.setX(128);
        crate.setY(128);
    }
}

// Function untuk lukis tiles
const drawTiles = (row, column, scene, layer, tileset) => {
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
const drawCharacters = () => {
    var entArray_length = entArray.length;

    // Susun entities ikut depth
    entArray.sort(function(a, b) {
        return b.depth - a.depth;
    });
    
    // Lukis ikut turutan
    for (var i = 0; i < entArray_length; i++) {
        if (entArray[i].getX()-vx >= -32
            && entArray[i].getX()-vx < initWidth
            && entArray[i].getY()-vy >= -32
            && entArray[i].getY()-vy < initHeight) {
            entArray[i].setInView(true);
            entArray[i].draw();
        } else {
            entArray[i].setInView(false);
        }
    }
}

const movements = () => {
    // If aligned to grid
    if (!((boxman.getX() + boxman.getY()) % grid)) {
        aligned = true;
        
        if ((arrowkey & 8) === 8) {
            boxman.frame_column = 0;
            boxman.arah_hor = 1;
            boxman.frame_row = 0 + 4 * boxman.arah_hor;
            boxman.setHSpeed(-2);
        } else if ((arrowkey & 4) === 4) {
            boxman.frame_column = 0;
            boxman.arah_hor = 0;
            boxman.frame_row = 0 + 4 * boxman.arah_hor;
            boxman.setHSpeed(2);
        } else if ((arrowkey & 2) === 2) {
            boxman.frame_column = 1;
            boxman.arah_ver = 1;
            boxman.frame_row = 0 + 4 * boxman.arah_ver;
            boxman.setVSpeed(-2);
        } else if ((arrowkey & 1) === 1) {
            boxman.frame_column = 1;
            boxman.arah_ver = 0;
            boxman.frame_row = 0 + 4 * boxman.arah_ver;
            boxman.setVSpeed(2);
        }
        
        if ((arrowkey & 12) === 0)
            boxman.setHSpeed(0);
        
        if ((arrowkey & 3) === 0)
            boxman.setVSpeed(0);
        
        // This is out of place
        if (dahlepas_inv && inv) {
            currentScene = 5;
            dahlepas_inv = false;
        }
    } else {
        aligned = false;
    }
}

// Guna semasa dalam menu
const navigate = () => {
    if (boleh_tekan) {
        if ((arrowkey & 2) === 2) {
            row = (row === 0) ? 4 : row - 1;
        } else if ((arrowkey & 1) === 1) {
            row = (row + 1) % 5;
        } else if ((arrowkey & 12) >= 4) {
            col = col - dpad & 3;
            dpad = 0;
        }
        
        boleh_tekan = false;
    }
    
    if (arrowkey === 0)
        boleh_tekan = true;
    
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(12 + 40 * col, 24 + 40 * row, 32, 32);
    ctx.fillStyle = '#707070';
    ctx.fillRect(13 + 40 * col, 25 + 40 * row, 30, 30);
    
    if (inv_arr[col + row * 4] !== undefined)
        inv_arr[col + row * 4].describe();
}

// Gerakkan boxman dan crate
const motion = () => {
    if (boxman.getHSpeed() > 0 && (collision & 4) !== 4) {
        if (crate.getX() === boxman.getX() + 32 && crate.getY() === boxman.getY()) {
            if ((collision & 64) !== 64) {
                crate.setX(crate.getX() + boxman.getHSpeed() / 2)
                boxman.setX(boxman.getX() + boxman.getHSpeed() / 2);
            }
        } else {
            boxman.setX(boxman.getX() + boxman.getHSpeed());
        }
    } else if (boxman.getHSpeed() < 0 && (collision & 8) !== 8) {
        if (crate.getX() === boxman.getX() - 32 && crate.getY() === boxman.getY()) {
            if ((collision & 128) !== 128) {
                crate.setX(crate.getX() + boxman.getHSpeed() / 2);
                boxman.setX(boxman.getX() + boxman.getHSpeed() / 2);
            }
        } else {
            boxman.setX(boxman.getX() + boxman.getHSpeed());
        }
    } else if (boxman.getVSpeed() > 0 && (collision & 1) !== 1) {
        if (crate.getY() === boxman.getY() + 32 && crate.getX() === boxman.getX()) {
            if ((collision & 16) !== 16) {
                crate.setY(crate.getY() + boxman.getVSpeed() / 2);
                boxman.setY(boxman.getY() + boxman.getVSpeed() / 2);
            }
        } else {
            boxman.setY(boxman.getY() + boxman.getVSpeed());
        }
    } else if (boxman.getVSpeed() < 0 && (collision & 2) !== 2) {
        if (crate.getY() === boxman.getY() - 32 && crate.getX() === boxman.getX()) {
            if ((collision & 32) !== 32) {
                crate.setY(crate.getY() + boxman.getVSpeed() / 2);
                boxman.setY(boxman.getY() + boxman.getVSpeed() / 2);
            }
        } else {
            boxman.setY(boxman.getY() + boxman.getVSpeed());
        }
    }
}

//Animasi untuk boxman
const boxmanAnimate = (box_x, box_y) => {
    // Kalau kedudukan berubah
    if (box_x !== boxman.getX()) {
        boxman.frame_column = 0;
        if (boxman.pelambat === 0) {
            boxman.frame_row = 4 * boxman.arah_hor + (boxman.frame_row + 1) % 4;
        }
        boxman.pelambat = (boxman.pelambat + 1) % 4;
    } else if (box_y !== boxman.getY()) {
        boxman.frame_column = 1;
        if (boxman.pelambat === 0) {
            boxman.frame_row = 4 * boxman.arah_ver + (boxman.frame_row + 1) % 4;
        }
        boxman.pelambat = (boxman.pelambat + 1) % 4;
    }
}

const collisionCheck = (box_x, box_y) => {
    var entArray2_length = entArray2.length;
    for (var ent = 0; ent < entArray2_length; ent++) {
        // Uji jarak boleh bercakap
        if ((Math.abs(boxman.getX() - entArray2[ent].getX()) === 32
             && boxman.getY() === entArray2[ent].getY() && boxman.frame_column === 0)
            || (boxman.getX() === entArray2[ent].getX() && boxman.frame_column === 1
            && Math.abs(boxman.getY() - entArray2[ent].getY()) === 32)) {
            entArray2[ent].can_interact = true;
            
            if (entArray2[ent] !== crate) {
                enpisi = entArray2[ent];
                if (space)
                    sdgcakap = (enpisi.tukar !== -1);
            }
        } else {
            entArray2[ent].can_interact = false;
            //entArray2[ent].legap = 0;
        }
        
        // Uji collision
        // LRUDLRUD
        if (entArray2[ent].getInView() && entArray2[ent] !== crate) {
            if (entArray2[ent].getY() === boxman.getY()) {
                if (entArray2[ent].getX() === boxman.getX() - 32) {
                    collision |= 8;
                } else if (entArray2[ent].getX() === boxman.getX() - 64) {
                    collision |= 128;
                } else if (entArray2[ent].getX() === boxman.getX() + 32) {
                    collision |= 4;
                } else if (entArray2[ent].getX() === boxman.getX() + 64) {
                    collision |= 64;
                }
            } else if (entArray2[ent].getX() === boxman.getX()) {
                if (entArray2[ent].getY() === boxman.getY() - 32) {
                    collision |= 2;
                } else if (entArray2[ent].getY() === boxman.getY() - 64) {
                    collision |= 32;
                } else if (entArray2[ent].getY() === boxman.getY() + 32) {
                    collision |= 1;
                } else if (entArray2[ent].getY() === boxman.getY() + 64) {
                    collision |= 16;
                }
            }
        }
        
        customCollision();
    }
}

const customCollision = () => {
    // Rumah, dinding atas / bawah
    if (boxman.getX() >= 448 && boxman.getX() <= 576) {
        if (boxman.getY() === 64) {
            collision |= 1;
        } else if (boxman.getY() === 192) {
            if (boxman.getX() !== 512)
                collision |= 1;
        } else if (boxman.getY() === 96) {
            collision |= 2;
        } else if (boxman.getY() === 224) {
            if (boxman.getX() !== 512)
                collision |= 2;
        }

        // crate
        if (crate.can_interact) {
            if (boxman.getY() === 32 && crate.getY() === 64) {
                collision |= 16;
            } else if (boxman.getY() === 160 && crate.getY() === 192) {
                if (boxman.getX() !== 512)
                    collision |= 16;
            } else if (boxman.getY() === 128 && crate.getY() === 96) {
                collision |= 32;
            } else if (boxman.getY() === 256 && crate.getY() === 224) {
                if (boxman.getX() !== 512)
                    collision |= 32;
            }
        }
    }
    
    // Rumah, dinding tepi
    if (boxman.getY() >= 96 && boxman.getY() <= 192) {
        if (boxman.getX() === 416 || boxman.getX() === 576) {
            collision |= 4;
        } else if (boxman.getX() === 448 || boxman.getX() === 608) {
            collision |= 8;
        }

        // crate
        if (crate.can_interact) {
            if ((boxman.getX() === 384 && crate.getX() === 416)
                || (boxman.getX() === 544 && crate.getX() === 576)) {
                collision |= 4;
            } else if ((boxman.getX() === 480 && crate.getX() === 448)
                       || (boxman.getX() === 640 && crate.getX() === 608)) {
                collision |= 8;
            }
        }
    }
    
    // Kolam dari tepi
    if (boxman.getY() >= 256 && boxman.getY() <= 384) {
        if (boxman.getX() === 32) {
            collision |= 4;
        } else if (boxman.getX() === 224) {
            collision |= 8;
        }

        // crate
        if (crate.can_interact) {
            if (boxman.getX() === 0 && crate.getX() === 32) {
                collision |= 4;
            } else if (boxman.getX() === 256 && crate.getX() === 224) {
                collision |= 8;
            }
        }
    }
    
    // Kolam dari atas/bawah
    if (boxman.getX() >= 64 && boxman.getX() <= 192) {
        if (boxman.getY() === 224) {
            collision |= 1;
        } else if (boxman.getY() === 416) {
            collision |= 2;
        }

        // crate
        if (crate.can_interact) {
            if (boxman.getY() === 192 && crate.getY() === 224) {
                collision |= 1;
            } else if (boxman.getY() === 448 && crate.getY() === 416) {
                collision |= 2;
            }
        }
    }
}

const drawTextbox = (player, NPC, ygbercakap_x, ygbercakap_y, text_width) => {
    var x1, y1, x2, y2;
    var extrabaris = text[NPC.textID][NPC.text][NPC.tukar].length > 21 ? 0 : 11;
    var bubbleheight = 44 - extrabaris;
    
    if (player.getX() !== NPC.getX()) {
        if (NPC.tukar !== -1) {
            x1 = ygbercakap_x - vx + 16 - (text_width / 2 + 10);
            y1 = ygbercakap_y - vy - 57 + extrabaris;
            x2 = ygbercakap_x - vx + 16 + (text_width / 2 + 10);
            y2 = ygbercakap_y - vy - 13;
            
            x1 += 10;
            x2 -= 10;

            //drawImage(image,sx,sy,sw,sh,dx,dy,dw,dh)
            ctx.drawImage(bubble, 4, 0, 1, 44, x1, y1, x2 - x1, bubbleheight); // latar
            ctx.drawImage(bubble, 0, 0, 10, 44, x1 - 10, y1, 10, bubbleheight);
            ctx.drawImage(bubble, 40, 0, 10, 44, x2, y1, 10, bubbleheight);
            ctx.drawImage(bubble, 20, 42, 10, 7, ygbercakap_x - vx + 11, y2 - 2, 10, 7); // segi tiga
        }
    } else { // player.getX() === NPC.getX()
        if (NPC.tukar !== -1) {
            if ((ygbercakap_y === NPC.getY() && NPC.getY() < player.getY())
                || (ygbercakap_y === player.getY() && NPC.getY() > player.getY())) {
                x1 = ygbercakap_x - vx + 16 - (text_width / 2 + 10);
                y1 = ygbercakap_y - vy - 57 + extrabaris;
                x2 = ygbercakap_x - vx + 16 + (text_width / 2 + 10);
                y2 = ygbercakap_y - vy - 13;

                x1 += 10;
                x2 -= 10;

                //drawImage(image,sx,sy,sw,sh,dx,dy,dw,dh)
                ctx.drawImage(bubble, 4, 0, 1, 44, x1, y1, x2 - x1, bubbleheight); // latar
                ctx.drawImage(bubble, 0, 0, 10, 44, x1 - 10, y1, 10, bubbleheight);
                ctx.drawImage(bubble, 40, 0, 10, 44, x2, y1, 10, bubbleheight);
                ctx.drawImage(bubble, 20, 42, 10, 7, ygbercakap_x - vx + 11, y2 - 2, 10, 7); // segi tiga
            } else {
                x1 = ygbercakap_x - vx + 16 - (text_width / 2 + 10);
                y1 = ygbercakap_y - vy + 45;
                x2 = ygbercakap_x - vx + 16 + (text_width / 2 + 10);
                y2 = ygbercakap_y - vy + 89;

                x1 += 10;
                x2 -= 10;

                //drawImage(image,sx,sy,sw,sh,dx,dy,dw,dh)
                ctx.drawImage(bubble, 4, 0, 1, 44, x1, y1, x2 - x1, bubbleheight); // latar
                ctx.drawImage(bubble, 0, 0, 10, 44, x1 - 10, y1, 10, bubbleheight);
                ctx.drawImage(bubble, 40, 0, 10, 44, x2, y1, 10, bubbleheight);
                ctx.drawImage(bubble, 20, 15, 10, 7, ygbercakap_x - vx + 11, y1 - 5, 10, 7); // segi tiga
            }
        }
    }
}

// Simpan koordinat X pada source image
const textToBekas = (bekasIndex, text) => {
    'use strict';
    var text_length = text.length;
    
    for (var i = 0; i < text_length; i++) {
        bekas[bekasIndex].push((text.charCodeAt(i) - 32) * char_width);
    }
}

// LUKIS TEXTBOX + 'TULIS' ////////////////
const tulis = (text, player, NPC) => {
    'use strict';
    sdgcakap = (NPC.tukar !== -1);
    
    //NPC.legap += 0.1;
    //if (NPC.legap > 1) NPC.legap = 1; // hadkan nilai legap
    
    if (sdgcakap) {
        var ygbercakap = (text[NPC.tukar][0] === '#') ? NPC : player;
        
        var text_width; //lebar dalam pixel
        text_width = ((var_panjang[0] > var_panjang[1]) ? var_panjang[0] : var_panjang[1]) * char_width;
        
        ctx.fillStyle = '#FFF';
        
        drawTextbox(player, NPC, ygbercakap.getX(), ygbercakap.getY(), text_width);

        // 'TULIS' //////////////////
        // baris pertama
        
        var string_reg_x = ygbercakap.getX() - vx + 16 - var_panjang[0] * char_width / 2;
        var string_reg_y;
        
        if (player.getX() === NPC.getX()
            && ((ygbercakap === player && NPC.getY() < player.getY())
                || (ygbercakap === NPC && NPC.getY() > player.getY()))) {
            string_reg_y = ygbercakap.getY() + 56; //46+32-char_height*2= 56
        } else {
            string_reg_y = ygbercakap.getY() - 46 + (text[NPC.tukar].length > 21 ? 0 : 11); //13 + char_height*3 = 46
        }

        var i;
        var tengah = 21;

        // panjang_teks untuk simpan bil aksara
        if (text[NPC.tukar][tengah] !== undefined) {
            while (text[NPC.tukar][tengah] !== ' ')
                tengah--;
        }

        panjang_teks = text[NPC.tukar].substring(1, tengah).length;

        // kosongkan bekas sebelum isi nombor baru
        bekas[0] = [];

        // Untuk simpan bilangan aksara semasa yang dipaparkan
        var_panjang[0] += (var_panjang[0] < panjang_teks) ? 1 : 0;
        textToBekas(0, text[NPC.tukar].substring(1, var_panjang[0] + 1));
        
        // Tulis!
        for (i = 0; i < var_panjang[0]; i++) {
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

        // baris kedua ///////////////////////////////////
        
        // kalau line yg pertama dah habis tulis
        if (var_panjang[0] === panjang_teks) {
            panjang_teks = text[NPC.tukar].substring(tengah + 1).length; //bil aksara
            
            // kosongkan bekas sebelum isi nombor baru
            bekas[1] = [];
            
            var_panjang[1] += (var_panjang[1] < panjang_teks) ? 1 : 0;
            
            textToBekas(1, text[NPC.tukar].substring(tengah + 1, tengah + 1 + var_panjang[1]));

            string_reg_x = ygbercakap.getX() - vx + 16 - var_panjang[1] * char_width / 2;

            string_reg_y += 11;
            for (i = 0; i < var_panjang[1]; i++) {
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
        }
        
        // ketengahkan kamera ke character yang bercakap
        if (initWidth / 2 !== ygbercakap.getX() - vx + 16 || initHeight / 2 !== ygbercakap.getY() - vy + 16) {
            cameraCounter = (cameraCounter + 1) % sineTblBerubah_length;
            if (ygbercakap.getX() - vx + 16 > initWidth / 2) {
                if (vx + sineTblBerubah[cameraCounter] <= 416)
                    vx += sineTblBerubah[cameraCounter];
            } else if (ygbercakap.getX() - vx + 16 < initWidth / 2) {
                if (vx - sineTblBerubah[cameraCounter] >= 0)
                    vx -= sineTblBerubah[cameraCounter];
            } else if (ygbercakap.getY() - vy + 16 > initHeight / 2) {
                if (vy + sineTblBerubah[cameraCounter] <= 384)
                    vy += sineTblBerubah[cameraCounter];
            } else if (ygbercakap.getY() - vy + 16 < initHeight / 2) {
                if (vy - sineTblBerubah[cameraCounter] >= 0)
                    vy -= sineTblBerubah[cameraCounter];
            }
        } else {
            cameraCounter = 0;
        }
        
        /*if (ygbercakap.getX() - vx + 16 > initWidth / 2) {
            if (ygbercakap.getX() - vx + 20 > initWidth / 2) { //16 + 4 = 20
                if (vx + 4 <= 416) vx += 4; // 24tiles * 32px = 768
            } else {
                if (vx + 1 <= 416) vx += 1; // 768 - initWidth
            }
        } else if (ygbercakap.getX() - vx + 16 < initWidth / 2) {
            if (ygbercakap.getX() - vx + 12 < initWidth / 2) { //16 - 4 = 12
                if (vx - 4 >= 0) vx -= 4;
            } else {
                if (vx - 1 >= 0) vx -= 1;
            }
        } else if (ygbercakap.getY() - vy + 16 > initHeight / 2) {
            if (ygbercakap.getY() - vy + 20 > initHeight / 2) { //16 + 4 = 20
                if (vy + 4 <= 384) vy += 4; // 19tiles * 32px = 608
            } else {
                if (vy + 1 <= 384) vy += 1; // 608 - initHeight
            }
        } else if (ygbercakap.getY() - vy + 16 < initHeight / 2) {
            if (ygbercakap.getY() - vy + 12 < initHeight / 2) { //16 - 4 = 12
                if (vy - 4 >= 0) vy -= 4;
            } else {
                if (vy - 1 >= 0) vy -= 1;
            }
        }*/
    } /*else if (aligned) {
        ctx.fillStyle = 'rgba(255, 255, 255, ' + NPC.legap + ')';

        ctx.save();
        ctx.globalAlpha = NPC.legap;
        ctx.fillStyle = 'rgb(255, 255, 255)';
        ctx.restore();

        text_width = 24;
        drawTextbox(player, NPC, text_width);
    }*/
}

const gameLoop = () => {
    setTimeout(function() {
        window.requestAnimationFrame(gameLoop);
    }, interval);
    ctx.clearRect(0, 0, initWidth, initHeight);

    // Scenes
    switch (currentScene) {
        case 0:
            scene0();
            break;
        case 5:
            inventory();
            break;
    }
}

const scene0 = () => {
    collision &= 0;
    
    drawTiles(0, 0, currentScene, 0, tile);
    
    // Tetapkan depth
    boxman.depth = -boxman.getY();
    monstak.depth = -monstak.getY();
    boxbiru.depth = -boxbiru.getY();
    kk.depth = -kk.getY();
    crate.depth = -crate.getY();

    // Draw watak ikut depth
    drawCharacters();
    
    // Draw tiles for second layer
    drawTiles(1, 14, currentScene, 1, tile2);
    
    ///////////////////////////
    
    // Tukar frame index monstak berdasarkan
    // kedudukan boxman
    monstak.frame_row = (boxman.getX() > monstak.getX()) ? 0 : 4;
    
    // Tukar frame index kk berdasarkan
    // kedudukan boxman
    kk.frame_row = (boxman.getX() > kk.getX()) ? 0 : 1;
    
    if (!sdgcakap) {
        movements();
        
        // Simpan nilai x dan y
        box_x = boxman.getX();
        box_y = boxman.getY();
        
        // If aligned to grid
        if (aligned)
            collisionCheck(box_x, box_y);
        
        // Gerakkan boxman dan crate
        motion();
        
        boxmanAnimate(box_x, box_y);
        
        // KAMERA ////////////////////////////
        sceneWidth = tileNo[currentScene][0][0].length * tileWidth;
        sceneHeight = tileNo[currentScene][0].length * tileHeight;
        
        if (boxman.getX() >= leftside && boxman.getX() <= sceneWidth - initWidth / 2 - tileWidth / 2) {
            bezaX = boxman.getX()-vx - leftside;
            vx += bezaX;
        }
        
        if (boxman.getY() >= topside && boxman.getY() <= sceneHeight - initHeight / 2 - tileHeight / 2) {
            bezaY = boxman.getY()-vy - topside;
            vy += bezaY;
        }
    } else {
        //console.log(text[enpisi.textID][enpisi.text][enpisi.tukar]);
        
        tulis(
            text[enpisi.textID][enpisi.text],
            boxman,
            enpisi);
    }
} //scene0

const inventory = () => {
    // Nanti tukar guna unit relative supaya
    // jadi responsive
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 17, 176, 207);
    
    ctx.fillStyle = '#404040';
    ctx.fillRect(176, 17, 176, 207);
    
    ctx.fillStyle = '#515151';
    ctx.fillRect(0, 0, canvas.width, 17);
    
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
    
    navigate();
    
    var store_i;
    var itemrow;
    for (var i = 0; i < inv_arr.length; i++) {
        store_i = i;
        itemrow = 0;
        
        while (store_i > 3) {
            store_i -= 4;
            itemrow++;
        }
        
        // Draw the item's icon
        ctx.drawImage(inv_arr[i].sprite, 12 + 40 * (i % 4), 24 + 40 * itemrow);
        
        // If it is stackable, display its quantity
        if (inv_arr[i].stackable) {
            var numstr = inv_arrQty[i].toString();
            var numstr_length = numstr.length;
            
            for (var j = 0; j < numstr_length; j++) {
                ctx.drawImage(
                    typefacew,
                    (numstr.charCodeAt(j) - 32) * char_width,
                    0,
                    char_width,
                    char_height,
                    14 + 40 * (i % 4) + j * char_width,
                    24 + 40 * itemrow,
                    char_width,
                    char_height);
            }
        }
    }
    
    if (dahlepas_inv && inv) {
        currentScene = 0;
        dahlepas_inv = false;
        
        row = 0;
        col = 0;
    }
} //inventory

const converse = () => {
    if (currentScene !== 5 && enpisi !== undefined && enpisi.can_interact
        && dahlepas_space && var_panjang[1] === panjang_teks) {
        // Kosongkan var_panjang
        var_panjang = [0,0];

        if (enpisi.tukar < text[enpisi.textID][enpisi.text].length - 1) {
            enpisi.tukar += 1;
        } else {
            panjang_teks = 0;
            enpisi.tukar = -1;
            
            if (enpisi.text === 0) {
                switch (enpisi) {
                    case kk:
                        masuk(tangga);
                    case monstak:
                    case boxbiru:
                        enpisi.text = 1;
                }
            }
        }
        dahlepas_space = false;
    }
}

document.addEventListener('keydown', (event) => {
    switch (event.keyCode) {
        case 32:
            space = true;
            converse();
            break;
        case 37:
            arrowkey |= 8;
            dpad = 37;
            break;
        case 38:
            arrowkey |= 2;
            break;
        case 39:
            arrowkey |= 4;
            dpad = 39;
            break;
        case 40:
            arrowkey |= 1;
            break;
        case 73:
            inv = true;
            break;
    }
});

document.addEventListener('keyup', (event) => {
    switch (event.keyCode) {
        case 32:
            space = false;
            dahlepas_space = true;
            break;
        case 37:
            arrowkey &= -9;
            break;
        case 38:
            arrowkey &= -3;
            break;
        case 39:
            arrowkey &= -5;
            break;
        case 40:
            arrowkey &= -2;
            break;
        case 73:
            inv = false;
            dahlepas_inv = true;
            break;
    }
});

const resizeCanvas = () => {
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
}

window.addEventListener('resize', resizeCanvas, false);

initScene(0);
gameLoop();
resizeCanvas();
