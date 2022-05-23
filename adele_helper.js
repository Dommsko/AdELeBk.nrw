/*
AdeLeBK.nrw
Hilfsskript zur Manipulation von Elementen in Adobe Captivate

v0.1 - 23.05.2022
Dominik Schäfer - dominik.schaefer@upb.de
*/



$('div[id^="ACB_"].cp-frameset').on("click",      manageButtons);
$('div[id^="ARB_"].cp-frameset').on("mouseenter", manageButtons);
$('div[id^="ARB_"].cp-frameset').on("mouseleave", manageButtons);
$('div[id^="AFB_"].cp-frameset').on("click",      manageButtons);
$('div[id^="AGB_"].cp-frameset').on("click",      manageButtons);
$('div[id^="ABB_"].cp-frameset').on("click",      manageButtons);
$('div[id^="ACS"].cp-frameset').on("click",       manageButtons);




function manageButtons(e) {
	
	let n = e.target.id;
	var s = n.split("_");
	
	switch(s[0]) {
		
		case "ACB":
		case "ACR":
			let targetStatus = s[2];
			let targetElement = "ASE_" + s[1];
			break;
			
		
		
		/*
		ACB - Adele Click Button
		
		Syntax: ACB_ASE_x
		
		Mausklick setzt Status des entsprechenden Adele Statuselements (ASE) auf x
		*/
		
		case "ACB":
			
		    cp.changeState(t, cp.getDisplayObjByKeyOnAllLayers(cp.D[t].mdi).states[p].stn);
			break;

			
			
		/*
		ARB - Adele RollOver Button
		
		Syntax: ARB_ASE_X
		
        RollOver setzt Status des entsprechenden Adele Statuselements (ASE) auf x
		RollOut setzt Status auf 0 zurück gesetzt
		*/
		
		case "ARB":
			
			if (cp.D[n].currentState == 1) {
				
			    cp.changeState(t, cp.getDisplayObjByKeyOnAllLayers(cp.D[t].mdi).states[p].stn);
				
			} else {
				
				cp.changeState(t, cp.getDisplayObjByKeyOnAllLayers(cp.D[t].mdi).states[0].stn);
				
			}
			break;



        /*
		ACS - Adele Context Switch
		
		Syntax: ACS
		
        Mausklick schaltet eigenen Status um, wodurch AFB- und ABB-Schaltflächen kontextsensitiv werden
		*/
		
		case "ACS":
			
			console.log("ACS");
			
			if (cp.D[n].currentState == 1) {
				
			    cp.changeState(n, cp.getDisplayObjByKeyOnAllLayers(cp.D[n].mdi).states[0].stn);
				
			} else {
				
				cp.changeState(n, cp.getDisplayObjByKeyOnAllLayers(cp.D[n].mdi).states[1].stn);
				
			}
			break;



        /*
		AFB - Adele Forward Button
		
		Syntax: AFB oder AFB_to_X
		
		Springt auf nächste Folie und überspringt Kontext, wenn Status von ACS auf 1 gesetzt ist
		*/
		
		case "AFB":
			
			targetSlide = window.cpAPIInterface.getCurrentSlideIndex();
			if (cp.D["ACS"].currentState == 1) {
				while (contextSlides.includes(targetSlide + 1)) {
					targetSlide++;
				}
			}
			window.parent.cpAPIInterface.gotoSlide(targetSlide);
			window.parent.window.cpCmndResume = 1;
			break;



        /*
		AGB - Adele GoTo Button
		
		Syntax: AGB_X
		
		Springt auf Folie X und überspringt Kontext (auf nächste Folie), wenn Status von ACS auf 1 gesetzt ist
		*/
		
		case "AGB":
			
			console.log("AGB");
			targetSlide = parseInt(s[1]) - 1;
			console.log(targetSlide);
			if (cp.D["ACS"].currentState == 1) {
				while (contextSlides.includes(targetSlide + 1)) {
					targetSlide++;
				}
			}
			window.parent.cpAPIInterface.gotoSlide(targetSlide);
			window.parent.window.cpCmndResume = 1;
			break;



        /*
		ABB - Adele Backward Button
		
		Springt auf vorherige Folie und überspringt Kontext, wenn Status von ACS auf 1 gesetzt ist
		*/
		
		case "ABB":
			
			targetSlide = window.cpAPIInterface.getCurrentSlideIndex() - 1;
			if (cp.D["ACS"].currentState == 1) {
				while (contextSlides.includes(targetSlide)) {
					targetSlide--;
				}
			}
			window.parent.cpAPIInterface.gotoSlide(targetSlide - 1);
			window.parent.window.cpCmndResume = 1;
			break;
		
	}
	
	/*
	console.log('CLICK');
	console.log('Name:\t' + n);
	console.log('Group:\t' + g);
	console.log('ID:\t' + i);
	console.log('t:\t' + t);
	console.log('\n');
	*/
}



function updateTicks() {
	
	/*
	Aktualisiert den Status der Haken
	*/
	
	$('div[id^="ATB_"].cp-frameset').each(function(index) {
		
		let n = this.id;
		
		if (cp.D[n].currentState == 0) {
		
			let s = n.split("_");
			var from = parseInt(s[1]);
			var to = s[2];
			
			/*
			console.log("from:\t" + from);
			console.log("to:\t" + to);
			*/
			
			if (from == to) {
				cp.changeState(n, cp.getDisplayObjByKeyOnAllLayers(cp.D[n].mdi).states[1].stn);
			}
			
			else {
				
				while (from <= to) {
				
					/*
					console.log("visitedSlides:\t" + visitedSlides);
					console.log("contextSlides:\t" + contextSlides);
					console.log("visitedSlides.includes(from):\t" + visitedSlides.includes(from));
					console.log("contextSlides.includes(from):\t" + contextSlides.includes(from));
					*/

					if (visitedSlides.includes(from) || contextSlides.includes(from)) {
						
						if (from == to) {
							cp.changeState(n, cp.getDisplayObjByKeyOnAllLayers(cp.D[n].mdi).states[1].stn);
						}
						from++;
					}
					else { break; }
				}
			}
		}
	});

}