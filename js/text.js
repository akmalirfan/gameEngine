// TO-DO: Buang empty string. Guna splice()

// text[textID][no][tukar]
var text = [
    [ //monstak
        [
            "#Siapa kau?",
            "@Nama aku Irfan",
            "#Aku tak pernah nampak kau kat sini",
            "@Aku orang baru",
            "#Lebih baik kau berhati-hati",
            "#Tempat ni bahaya!",
            "@Ohh.. Baiklah"
        ],
        [
            "#Hati-hati tau",
            "@Baik. Terima kasih"
        ]
    ],
    [ //boxbiru
        [
            "@Kau buat apa?",
            "#Siram rumput",
            "@Okay. Teruskan"
        ],
        [
            "@Mana airnya?",
            "#Ada. Kau je tak nampak",
            "@...",
            "#...",
            "@..."
        ]
    ],
    [ //kk
        [ // 0
            "#Nah tangga",
            "@Kenapa bagi aku?",
            "#Saja je",
            "@Err.. Terima kasih"
        ],
        [ // 1
            "#Berguna tak tangga tu?",
            "@Aku tak guna pun lagi"
        ]
    ],
    [ //barang-barang
        [ // 0
            // tangga
            "Tangga boleh lipat.  #",
            
            // Roti
            "Roti gandum penuh.   #Pulihkan 50 HP",
            
            // Kelapa
            "Segar dari ladang.   #Pulihkan 80 HP",
            
            // Kelapa2
            "Segar dari ladang.222#Pulihkan 80 HP",
            
            // Kelapa3
            "Segar dari ladang.333#Pulihkan 80 HP",
            
            // Kelapa4
            "Segar dari ladang.444#Pulihkan 80 HP"
        ]
    ]
];



/*
function tukarText(char, no) {
text = ['']; // kosongkan

if (char === 1) { // yellow monster
	if (no == 0) {
		text = [
			'', // biarkan kosong
			
			'Kau                  #siapa?',
			'Aku                  @Irfan',
			'Aku tak pernah nampak#kau kat sini',
			'Aku orang            @baru',
			'Lebih baik kau       #berhati-hati',
			'Tempat ni            #bahaya!',
			'Ohh..                @Oke'
		];
	}
	if (no == 1) {
		text = [
			'',
			'Dah dah              #la weh..',
			'Pergi main           #jauh-jauh.'
		];
	}
	global.yellow_latest_text = no;
}

if (char === 2) { // jiran
	if (no == 0) {
		text = [
			'',
			
			'Woi,                 #pagi!',
			'Hoihoi,              @pagi!'
		];
	}
	global.jiran_latest_text = no;
}

if (char === 3) { // pokok
	if (no === 0) {
		text = [
			'',
			
			'Ni pokok             @nanas.',
			'Caye                 @dok?'
		];
	}
	global.pokok_latest_text = no;
}

if (char === 4) { // mat songkok
	if (no === 0) {
		text = [
			'',
			
			'Apa yang saya        #boleh bantu?'
		];
	}
	if (no === 1) {
		text = [
			'',
			
			'Terima kasih.        #Sila datang lagi.'
		];
	}
	global.matsongkoklatest_text = no;
	if (global.matsongkoklatest_text === 1) {
		global.matsongkoklatest_text = 0;
	}
}

if (char === 5) { // nelayan
	if (no == 0) {
		text = [
			'',
			
			'Aku nak pinjam bot,  @boleh tak?',
			'Boleh, tapi kalau    #rosak kau kena bayar.',
			'Okey, terima kasih.  @Terbaik la kau.',
			'Terbaik, terbaik     #jugak.',
			'Bayar, bayar         #jugak. Hehe.'
		];
	}
	if (no == 1) {
		text = [
			'',
			
			'Bot aku              #okey tak?',
			'Okey. Kau            @jangan risau.'
		];
	}
	global.nelayan_latest_text = no;
}

jumlahAyat = text.length - 1;
}*/
