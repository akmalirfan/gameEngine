var interval = 1000 / 60,
    tile = new Image(),
    tileWidth = 32,
    tileHeight = 32,
    tileNo,
    vx = 0,
    vy = 0,
    left = false,
    right = false,
    up = false,
    down = false,
    space = false,
    inv = false,
    inv_arr = [],
    
    // Barang-barang dalam inventory
    tangga = new Image(),
    
    currentScene = 1,
    dah_init = false,
    
    dahlepas_L = true,
    dahlepas_R = true,
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

/* Constructor */
function Character(img_src, textID) {
    'use strict';
    this.sprite = new Image();
    this.sprite.src = img_src;
    this.x;
    this.y;
    this.hspeed = 0;
    this.vspeed = 0;
    this.arah = 0; // 0(kanan) 1(kiri) nak guna tribool?
    this.frame_index = 0;
    this.limiter = 0;
    this.depth = 0;
    this.textID = textID;
    this.text = 0;
    
    this.inView = false;
    
    this.draw = function() {
        //drawImage(image,sx,sy,sw,sh,dx,dy,dw,dh)
        ctx.drawImage(
                this.sprite,
                this.frame_index * 32,
                0,
                32,
                32,
                this.x - vx,
                this.y - vy,
                32,
                32
            );
    };
    
    /// BERKAITAN CHAT ENGINE ///
    this.legap = 0;
    //this.bekas = ['', '']; // variable untuk simpan ayat yg dah dibahagi
    
    this.can_interact = false;
    //this.var_panjang = 0;
    //this.var_panjang2 = 0;
    this.tukar = 0;
    //player = obj_char;
    //this.kiri = x - 80;
    //this.kanan = x + 112;
}

var entArray = [
    // Main character
    boxman = new Character("./images/mainChar.png", null),
    
    // Invisible walls
    invWalls1 = new Character(null, null),
    invWalls2 = new Character(null, null),
    invWalls3 = new Character(null, null),
    invWalls4 = new Character(null, null),
    invWalls5 = new Character(null, null),
    invWalls6 = new Character(null, null),
    invWalls7 = new Character(null, null),
    invWalls8 = new Character(null, null),
    invWalls9 = new Character(null, null),
    invWalls10 = new Character(null, null),
    invWalls11 = new Character(null, null),
    invWalls12 = new Character(null, null),
    invWalls13 = new Character(null, null),
    invWalls14 = new Character(null, null),
    invWalls15 = new Character(null, null),
    invWalls16 = new Character(null, null),
    
    // NPC
    monstak = new Character("./images/monsta.png", 0),
    boxbiru = new Character("./images/npc_biru.png", 1),
    kk = new Character("./images/kk.png", 2),
    
    // Objects
    crate = new Character("./images/crate.png", null)
];

// Sama macam entArray cuma takde boxman
var entArray2 = entArray.slice(1);

tile.src = "./images/tile_gmc6.png";
typeface.src = "./images/gohufont_sprite.png";

tangga.src = "./images/tangga.png";

// Insert polyfill here

tileNo = [
    [2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2],
    [2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,12,12,12,12,12, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,12,12,12,12,12, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,12,12,12,12,12, 2, 2, 2, 2, 2],
    [2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2,12,12,12,12,12, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 1, 2, 2],
    [2, 2, 3, 4, 4, 4, 5, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 6, 7, 7, 7, 8, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 6, 7, 7, 7, 8, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 6, 7, 7, 7, 8, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 9,10,10,10,11, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
];

// Function untuk draw watak ikut depth
function drawCharacters() {
    'use strict';
    var entArray_length = entArray.length;
    
    /* Susun entities ikut depth */
    entArray.sort(function(a, b) {
        return b.depth - a.depth;
    });
    
    /* Lukis ikut turutan */
    for (var i = 0; i < entArray_length; i++) {
        if (entArray[i].x-vx >= -32
            && entArray[i].x-vx < game_canvas.width
            && entArray[i].y-vy >= -32
            && entArray[i].y-vy < game_canvas.height) {
            entArray[i].inView = true;
            entArray[i].draw();
        } else {
            entArray[i].inView = false;
        }
    }
}

function drawTextbox(x1, y1, x2, y2, char_x) {
    'use strict';
    // boleh buat lagi efficient ni kot...
    
    //ctx.fillStyle = '#FFF';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y1);
    ctx.lineTo(x2, y2);
    
    /* Mungkin boleh tukar segi tiga ni jadi image 
     * supaya nampak pixelated tanpa anti-alias */
    ctx.lineTo(char_x + 21, y2);
    ctx.lineTo(char_x + 16, y2 + 5);
    ctx.lineTo(char_x + 11, y2);
    
    ctx.lineTo(x1, y2);
    ctx.closePath();
    ctx.fill();
}

// Textbox kat tepi
function drawTextbox2(x1, y1, x2, y2) {
    'use strict';
    // boleh buat lagi efficient ni kot...
    
    //ctx.fillStyle = '#FFF';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x1, y2);
    
    /* Mungkin boleh tukar segi tiga ni jadi image 
     * supaya nampak pixelated tanpa anti-alias */
    ctx.lineTo(x1, y2 - 11);
    //ctx.lineTo(x1 - 5, y2 - 9);
    ctx.lineTo(x1 - 5, y2 - 4);
    ctx.lineTo(x1, y2 - 4);
    
    ctx.closePath();
    ctx.fill();
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
    if (NPC.tukar === 0) {
        sdgcakap = false;
    } else {
        sdgcakap = true;
    }
    
    NPC.legap += 0.1;
	if (NPC.legap > 1) NPC.legap = 1; // hadkan nilai legap
    
    if (!sdgcakap) {
        //if (dahlepas_L && dahlepas_R) {
        if (player.x === player_x && player.y === player_y) { // Kalau kedudukan tak berubah
            ctx.fillStyle = 'rgba(255, 255, 255, ' + NPC.legap + ')';
            if (player.x === NPC.x) {
                drawTextbox2(
                    NPC.x + 42 - vx,
                    NPC.y - vy,
                    NPC.x + 62 - vx,
                    NPC.y + 19 - vy);
            } else {
                drawTextbox(
                    NPC.x + 6 - vx,
                    NPC.y - 28 - vy,
                    NPC.x + 26 - vx,
                    NPC.y - 13 - vy,
                    NPC.x - vx);
            }
        }
    } else {
        //Tukar sprite player berdasarkan kedudukan NPC
        if (player.x > NPC.x) {
            player.arah = 1;
        } else if (player.x < NPC.x) {
            player.arah = 0;
        }
        boxman.frame_index = 4 * boxman.arah;
        
        if (text[NPC.tukar][21] === '#') {
            var ygbercakap = NPC;
        } else {
            var ygbercakap = player;
        }
        
        var text_width; //lebar dalam pixel
        if (var_panjang[0] > var_panjang[1]) {
            text_width = var_panjang[0] * char_width;
        } else {
            text_width = var_panjang[1] * char_width;
        }
        
        ctx.fillStyle = '#FFF';
        if (player.x === NPC.x) {
            drawTextbox2(
                ygbercakap.x - vx + 42,
                ygbercakap.y - vy - 22,
                ygbercakap.x - vx + 42 + (text_width + 20),
                ygbercakap.y - vy + 22);
        } else {
            drawTextbox(
                ygbercakap.x - vx + 16 - (text_width / 2 + 10),
                ygbercakap.y - vy - 57,
                ygbercakap.x - vx + 16 + (text_width / 2 + 10),
                ygbercakap.y - vy - 13,
                ygbercakap.x - vx);
        }

        // 'TULIS' //////////////////
        // bekas[0] (baris pertama)
        
        if (player.x === NPC.x) {
            var string_reg_x = ygbercakap.x - vx + 52;
            var string_reg_y = ygbercakap.y - 11;
        } else {
            // sebelum ni 'var_panjang[0] * char_width;' guna text_width //
            var string_reg_x = ygbercakap.x - vx + 16 - var_panjang[0] * char_width / 2;
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
        
        if (player.x !== NPC.x) {
            //text_width = var_panjang[1] * char_width;
            //string_reg_x = ygbercakap.x - vx + 16 - text_width / 2;
            string_reg_x = ygbercakap.x - vx + 16 - var_panjang[1] * char_width / 2;
        }
        
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
        if (ygbercakap.x - vx + 16 > game_canvas.width / 2) {
            if (ygbercakap.x - vx + 20 > game_canvas.width / 2) { //16 + 4 = 20
                if (vx + 4 <= 416) vx += 4; // 24tiles * 32px = 768
            } else {
                if (vx + 1 <= 416) vx += 1; // 768 - game_canvas.width
            }
        } else if (ygbercakap.x - vx + 16 < game_canvas.width / 2) {
            if (ygbercakap.x - vx + 12 < game_canvas.width / 2) { //16 - 4 = 12
                if (vx - 4 >= 0) vx -= 4;
            } else {
                if (vx - 1 >= 0) vx -= 1;
            }
        }
    }
}

function gameLoop() {
    'use strict';
    
    setTimeout(function() {
        window.requestAnimationFrame(gameLoop);
    }, interval);
    ctx.clearRect(0, 0, 352, 224);

    // Scenes
    switch (currentScene) {
        case 1:
            scene1();
            break;
        case 5:
            inventory();
            break;
    }
};

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
    
    if (!dah_init) {
        // Initialization
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
        
        dah_init = true;
    }
    
    /* TILES */
    for (var i = 0, tileNo0_l = tileNo[0].length; i < tileNo0_l; i++) {
        for (var j = 0, tileNo_l = tileNo.length; j < tileNo_l; j++) {
            ctx.drawImage(
                tile,
                0,
                tileNo[j][i] * tileHeight,
                tileWidth,
                tileHeight,
                i * tileWidth - vx,
                j * tileHeight - vy,
                tileWidth,
                tileHeight);
        }
    }

    /* Tetapkan depth */
    boxman.depth = -boxman.y;
    monstak.depth = -monstak.y;
    boxbiru.depth = -boxbiru.y;
    kk.depth = -kk.y;
    crate.depth = -crate.y;

    // Draw watak ikut depth
    drawCharacters();
    
    ///////////////////////////
    
    // Tukar frame index monstak berdasarkan
    // kedudukan boxman
    monstak.frame_index = (boxman.x > monstak.x) ? 0 : 4;
    
    // Tukar frame index kk berdasarkan
    // kedudukan boxman
    kk.frame_index = (boxman.x > kk.x) ? 0 : 1;
    
    if (!sdgcakap) {
        //Allign to grid
        if (boxman.x % 32 === 0 && boxman.y % 32 === 0) {
            alligned = true;
            
            if (!up && !down) { // disable diagonal movements
                if (left) {
                    boxman.hspeed = -2;
                    boxman.arah = 1;
                }
                if (right) {
                    boxman.hspeed = 2;
                    boxman.arah = 0;
                }
            }
            
            if (!left && !right) { // disable diagonal movements
                if (up) boxman.vspeed = -2;
                if (down) boxman.vspeed = 2;
            }
            
            if (!left && !right) boxman.hspeed = 0;
            if (!up && !down) boxman.vspeed = 0;
            
            if (dahlepas_inv && inv) {
                currentScene = 5;
                dahlepas_inv = false;
            }
        } else {
            alligned = false;
        }
        
        // Simpan nilai x dan y
        var box_x = boxman.x;
        var box_y = boxman.y;
        
        // If alligned to grid
        if (alligned) {
            //Uji jarak boleh bercakap
            for (var ent in entArray2) {
                if (((boxman.x === entArray2[ent].x-32 || boxman.x === entArray2[ent].x+32)
                    && (boxman.y === entArray2[ent].y))
                    || ((boxman.x === entArray2[ent].x)
                    && (boxman.y === entArray2[ent].y-32 || boxman.y === entArray2[ent].y+32))) {
                    entArray2[ent].can_interact = true;
                    enpisi = entArray2[ent];
                    if (enpisi.textID !== null) {
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
            }
            
            // Uji collision
            var entArray2_length = entArray2.length;
            for (var i = 0; i < entArray2_length; i++) {
                if (entArray2[i].inView && entArray2[i] !== crate) {
                    if (entArray2[i].y === boxman.y) {
                        if (entArray2[i].x === boxman.x - 32) {
                            collisionL = true;
                        } else if (entArray2[i].x === boxman.x - 64) {
                            collisionL2 = true;
                        } else if (entArray2[i].x === boxman.x + 32) {
                            collisionR = true;
                        } else if (entArray2[i].x === boxman.x + 64) {
                            collisionR2 = true;
                        }
                    } else if (entArray2[i].x === boxman.x) {
                        if (entArray2[i].y === boxman.y - 32) {
                            collisionU = true;
                        } else if (entArray2[i].y === boxman.y - 64) {
                            collisionU2 = true;
                        } else if (entArray2[i].y === boxman.y + 32) {
                            collisionD = true;
                        } else if (entArray2[i].y === boxman.y + 64) {
                            collisionD2 = true;
                        }
                    }
                }
            }
        }
        
        // Gerakkan boxman dan crate
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
        
        //Animasi untuk boxman
        if (box_x !== boxman.x || box_y !== boxman.y) { // Kalau kedudukan berubah
            if (boxman.limiter === 0) {
                boxman.frame_index = 4 * boxman.arah + (boxman.frame_index + 1) % 4;
            }
            boxman.limiter = (boxman.limiter + 1) % 4;
        } else {
            boxman.frame_index = 0 + 4 * boxman.arah;
        }
        
        // CAMERA ////////////////////////////
        if (boxman.x > 160 && boxman.x <= 576) { // 160 = 352/2 - 16
            if (boxman.x-vx !== 160) {
                var bezaX = boxman.x-vx - 160;
                vx += bezaX;
            }
        }
        
        if (boxman.y > 96 && boxman.y <= 480) {
            if (boxman.y-vy !== 96) {
                var bezaY = boxman.y-vy - 96;
                vy += bezaY;
            }
        }
        ///////////////////////////////////////
    } else if (enpisi.textID !== null) {
        tulis(
            text[enpisi.textID][enpisi.text],
            boxman,
            box_x,
            box_y,
            enpisi);
    }
} //scene1

function inventory() {
    'use strict';
    
    ctx.fillStyle = '#404040';
    ctx.fillRect(0, 0, 115, game_canvas.height);
    
    ctx.fillStyle = '#515151';
    ctx.fillRect(115, 0, game_canvas.width - 115, game_canvas.height);
    
    // Tak fleksibel
    if (inv_arr[0] === "tangga") {
        ctx.drawImage(tangga, 135, 30);
    }
    
    if (dahlepas_inv && inv) {
        currentScene = 1;
        dahlepas_inv = false;
    }
} //inventory

document.addEventListener('keydown', function (event) {
    switch (event.keyCode) {
        case 32:
            space = true;
            
            // If allined to grid
            if (alligned) {
                if (enpisi !== null && enpisi.can_interact && dahlepas_space) {
                    if (var_panjang[1] === panjang_teks) {
                        // Kosongkan var_panjang
                        var_panjang = [0,0];
                        if (enpisi.tukar < text[enpisi.textID][enpisi.text].length - 1) {
                            enpisi.tukar += 1;
                        } else {
                            panjang_teks = 0;
                            enpisi.tukar = 0;
                            if (enpisi === kk) {
                                inv_arr.push("tangga");
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
            dahlepas_L = false;
            break;
        case 38:
            up = true;
            break;
        case 39:
            right = true;
            dahlepas_R = false;
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
            
            //if (!sdgcakap) enpisi = null;
            
            break;
        case 37:
            left = false;
            dahlepas_L = true;
            break;
        case 38:
            up = false;
            break;
        case 39:
            right = false;
            dahlepas_R = true;
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

currentScene = 1;
gameLoop();