var gameMain = function(game){
    notes = {
    	'Chromatic' : ['C4','C#4','D4','D#4','E4','F4','F#4','G4','G#4','A4','A#4','B4', 'C5'],
    	'Blues' : ['F3', 'Ab3', 'Bb3', 'B3', 'C4', 'Eb4', 'F4', 'Ab4', 'Bb4', 'B4'],
    	'Chopin' : ['B3','Bb3','B3','E4','B4','G4','E4','D#4','E4','G4','E5','B4', 'G4'],
    	'Debussy' : ['E3', 'G3', 'C4', 'E4', 'G4', 'A4', 'B4', 'F#4', 'D4', 'B3', 'F#3', 'D3', 'C3'],
    	'iLyich': ['C4', 'E4', 'G#4', 'B4', 'D#5', 'G5', 'F#5', 'D#5', 'B4', 'G4', 'F#4', 'E4', 'D#4']
    };
    
    prevHead = 0;
    prevNote = null;
    
    waves = ['sin', 'saw', 'tri'];
    scales = ['Chromatic', 'Blues', 'Chopin', 'Debussy', 'iLyich'];
	attacks = [20, 150, 400, 750];
	releases = [800, 1700, 2600, 3500];
	vibratos = [0, 3, 5, 8];
	divisions = [30, 36, 45, 60];
	
	division = 0;
	vibrato = 2;
    scale = 1;
    wave = 0;
    attack = 1;
    release = 2;

    var acceY, note;
};

gameMain.prototype = {
    create: function(){  
    	game.stage.backgroundColor = '#ffe1f0';
    	
        bg = this.add.image(0, 0, 'bg');
        bg.alpha = 0;
        game.add.tween(bg).to( { alpha: .8}, 1200, Phaser.Easing.Linear.None, true);
        
        headingText = game.add.text(100, 90, "Heading: N/A", {
			font: '42px ' + font, fill: 'darkred', fontWeight: 'bold', align: 'center'
		});
		
		headingText.x = game.world.centerX - headingText.width / 2;
        
        noteText = game.add.text(100, 900, "Note: N/A", {
			font: '42px ' + font, fill: 'darkgreen', fontWeight: 'bold', align: 'center'
		});
		
		noteText.x = game.world.centerX - noteText.width / 2;
        
        game.add.text(100, 150, "Scale", {
			font: '40px ' + font, fill: 'purple', fontWeight: 'bold', align: 'center', stroke:'white', strokeThickness: 1
		});
        game.add.text(380, 150, "Wave", {
        	 font: '40px ' + font, fill: 'purple', fontWeight: 'bold', align: 'center', stroke:'white', strokeThickness: 1
        });
        game.add.text(560, 150, "Division", {
        	 font: '40px ' + font, fill: 'purple', fontWeight: 'bold', align: 'center', stroke:'white', strokeThickness: 1
        });
        
        game.add.text(1270, 150, "Attack", {
        	 font: '40px ' + font, fill: 'purple', fontWeight: 'bold', align: 'center', stroke:'white', strokeThickness: 1
        });
        game.add.text(1460, 150, "Release", {
        	 font: '40px ' + font, fill: 'purple', fontWeight: 'bold', align: 'center', stroke:'white', strokeThickness: 1
        });
        game.add.text(1660, 150, "Vibrato", {
        	 font: '40px ' + font, fill: 'purple', fontWeight: 'bold', align: 'center', stroke:'white', strokeThickness: 1
        });

        addOptions();
        
        compass = this.add.sprite(970, 525, 'compass');
        compass.x = game.world.centerX + 5;
        compass.y = game.world.centerY - 20;
        compass.angle = 46;
        compass.anchor.set(0.5, 0.5);

        setTimeout(function(){
            try{
                StatusBar.hide();
            } catch(e){}   
	        
	        try{
	            window.plugins.insomnia.keepAwake();
	        } catch(e){}
        }, 1000);
        
		try{
			window.addEventListener("deviceorientation", compassSuccess, true);
        } catch(e){ 
        	navigator.compass.watchHeading(compassSuccess, compassError); 
        }   
        
        initAd();
    }
};

function addOptions(){
	scaleTexts = [];
	wavesTexts = [];
	attacksTexts = [];
	vibratosTexts = [];
	releasesTexts = [];
	divisionsTexts = [];
	
	for (n = 0; n < 5; n++){
	    text = game.add.text(100, 275 + n * 150, scales[n], {
    		font: '42px ' + font, fill: 'grey', align: 'center', stroke:'orange', strokeThickness: 1
    	});
    	
    	if (n == scale) text.fill = 'purple';
    	
    	scaleTexts.push(text);
    	
    	text.inputEnabled = true;
    	text.events.onInputDown.add(changeScale, this);
	}
	
	for (n = 0; n < 3; n++){
	    text2 = game.add.text(380, 275 + n * 150, waves[n], {
    		font: '42px ' + font, fill: 'grey', align: 'center', stroke:'orange', strokeThickness: 1
    	});	
    	
    	if (n == wave) text2.fill = 'purple';
    	
    	wavesTexts.push(text2);
    	
    	text2.inputEnabled = true;
    	text2.events.onInputDown.add(changeWave, this);
	}
	
	for (n = 0; n < 4; n++){
	    text3 = game.add.text(1280, 275 + n * 150, attacks[n] + 'ms', {
    		font: '42px ' + font, fill: 'grey', align: 'center', stroke:'orange', strokeThickness: 1
    	});	
    	
    	if (n == attack) text3.fill = 'purple';
    	
    	attacksTexts.push(text3);
    	
    	text3.inputEnabled = true;
    	text3.events.onInputDown.add(changeAttack, this);
	}

	for (n = 0; n < 4; n++){
	    text5 = game.add.text(1460, 275 + n * 150, releases[n] / 1000 + "K ms", {
    		font: '42px ' + font, fill: 'grey', align: 'center', stroke:'orange', strokeThickness: 1
    	});	
    	
    	if (n == release) text5.fill = 'purple';
    	
    	releasesTexts.push(text5);
    	
    	text5.inputEnabled = true;
    	text5.events.onInputDown.add(changeRelease, this);
	}
	
	for (n = 0; n < 4; n++){
	    text4 = game.add.text(1660, 275 + n * 150, vibratos[n] + " pulses", {
    		font: '42px ' + font, fill: 'grey', align: 'center', stroke:'orange', strokeThickness: 1
    	});	
    	
    	if (n == vibrato) text4.fill = 'purple';
    	
    	vibratosTexts.push(text4);
    	
    	text4.inputEnabled = true;
    	text4.events.onInputDown.add(changeVibrato, this);
	}
	
	for (n = 0; n < 4; n++){
	    text4 = game.add.text(560, 275 + n * 150, divisions[n] + "°", {
    		font: '42px ' + font, fill: 'grey', align: 'center', stroke:'orange', strokeThickness: 1
    	});	
    	
    	if (n == division) text4.fill = 'purple';
    	
    	divisionsTexts.push(text4);
    	
    	text4.inputEnabled = true;
    	text4.events.onInputDown.add(changeDivision, this);
	}
}

function changeScale(_this){
	for (n = 0; n < 5; n++){
		scaleTexts[n].fill = 'grey';
	}
	
	_this.fill = 'purple';
	scale = scales.indexOf(_this.text);
	
	showIntersitital(50);
}

function changeWave(_this){
	for (n = 0; n < 3; n++){
		wavesTexts[n].fill = 'grey';
	}
	
	_this.fill = 'purple';
	wave = waves.indexOf(_this.text);
	
	showIntersitital(50);
}

function changeAttack(_this){
	for (n = 0; n < 4; n++){
		attacksTexts[n].fill = 'grey';
	}
		
	_this.fill = 'purple';
	var res = parseInt((_this.text).substring(0, _this.text.length - 2));
	attack = attacks.indexOf(res);
	
	showIntersitital(100);
}

function changeRelease(_this){
	for (n = 0; n < 4; n++){
		releasesTexts[n].fill = 'grey';
	}
		
	_this.fill = 'purple';
	var res = parseInt((_this.text).substring(0, _this.text.length - 2));
	release = releases.indexOf(res);	
	
	showIntersitital(100);
}

function changeVibrato(_this){
	for (n = 0; n < 4; n++){
		vibratosTexts[n].fill = 'grey';
	}	
	
	_this.fill = 'purple';
	var res = parseInt((_this.text).charAt(0));
	vibrato = vibratos.indexOf(res);
	
	showIntersitital(100);
}

function changeDivision(_this){
	for (n = 0; n < 4; n++){
		divisionsTexts[n].fill = 'grey';
	}	
	
	_this.fill = 'purple';
	var res = parseInt((_this.text).substring(0,2));
	division = divisions.indexOf(res);
	
	showIntersitital(50);
}

function showIntersitital(chance){
	var rnd = game.rnd.integerInRange(0, chance);
 	if (rnd == 25){ 	 	 	
		if(AdMob) AdMob.showInterstitial();
  	}	
}

function compassSuccess(heading) {
    var head = 360 - (Math.round(heading.alpha));
    if (head == 0) head = 360;
    var note = Math.round(head / divisions[division]);

    compass.angle = head + 46;

    var theScale = scales[scale];
    var theNotes = notes[theScale];
    var theOneNote = theNotes[note];
    
    headingText.text = 'Heading: ' + Math.round(head);
    noteText.text = 'Note: ' + theOneNote;
    
    if (note != prevNote){
        frequency = teoria.note(theOneNote).fq();
        osc = T("cosc", {wave:waves[wave], beats:vibratos[vibrato], mul:0.45});
        osc.set({freq: frequency});
        
        T("perc", {a: attacks[attack], d:3000, s:4800, r: releases[release]}, osc).on("ended", function() {
            this.pause();
        }).bang().play();
    }

    prevHead = head;
    prevNote = note;
}

function compassError(){
    alert('Compass Error!');
}

function initAd(){
    var admobid = {};

    admobid = {
        banner: 'ca-app-pub-9795366520625065/4806911302',
        interstitial: 'ca-app-pub-9795366520625065/7140794394'
    };

    if(AdMob) AdMob.createBanner({
       adId: admobid.banner,
       position: AdMob.AD_POSITION.BOTTOM_CENTER,
       autoShow: true
    }); 
	
	if(AdMob) AdMob.prepareInterstitial( {adId:admobid.interstitial, autoShow:false} );
}