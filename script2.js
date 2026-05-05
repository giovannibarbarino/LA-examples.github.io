 // ✅ Cancella ogni versione locale salvata al caricamento
  localStorage.removeItem("obj");
  localStorage.removeItem("__tagList");
  localStorage.removeItem("__objList");
  localStorage.removeItem("__rulList");


function populate_tags(){
	 var options = "";
	 const set = new Set();
	 // aggiungi tag da matrici
	 for (let Matrix of window.__objList){
		 for (let tag of Matrix.tags){
			 set.add(String(tag).toLowerCase()) 
		} 
	} 
	 // aggiungi tag da regole
	 for (let Regola of window.__rulList){
		 for (let tagpn of Regola.se){
			 set.add(String(tagpn.tag).toLowerCase()) 
		}  
		 for (let tagpn of Regola.allora){
			 set.add(String(tagpn.tag).toLowerCase()) 
		} 
	}
	
     
     const tags = Array.from(set).sort();
     // keep a global tag list 
     window.__tagList = tags;
}




async function init() {
	let requestURL = "https://giovannibarbarino.github.io/LA-examples.github.io/objects.json";
	let request = new Request(requestURL);
	let response = await fetch(request);
	const obj = await response.json();
	
	requestURL = "https://giovannibarbarino.github.io/LA-examples.github.io/regole.json";
	request = new Request(requestURL);
	response = await fetch(request);
	const rul = await response.json();
	
	//console.log(obj);
	window.__objList = obj;
	window.__rulList = rul;
	populate_tags();
	
	
	
}

// Verifica che una regola si applichi ad un oggetto definito dai suoi tag
// inclusi-esclusi
function CheckHypRule(inclusi,esclusi,rule){
	let flag = true;
	let Hyp = rule.se;
	let Hyp_inc = Hyp.filter(t => t.positivo);
	let Hyp_tag_inc = Hyp_inc.map(t => t.tag);
	let Hyp_exc = Hyp.filter(t => !t.positivo);
	let Hyp_tag_exc = Hyp_exc.map(t => t.tag);
	
	return Hyp_tag_inc.every(t => inclusi.includes(t)) && Hyp_tag_exc.every(t => esclusi.includes(t));
}

// Verifica che lo stesso tag non compaia sia tra gli inclusi che gli esclusi
// ritorna TRUE se ce ne sono in comune
function CheckConsistency(inclusi,esclusi){return inclusi.some(t => esclusi.includes(t));}

// Verifica che una coppia di set di tag inclusi-esclusi non violi il
// set di regole. Ritorna -1 se non è violata alcuna regola, altrimenti
// ritorna un array di regole id che hanno portato alla violazione. 
function RuleViolation(inclusi,esclusi){
	
	let rul = window.__rulList;
	let flag = true; let c = 1; let aux_c = c;
	let aux_inc = inclusi;
	let aux_esc = esclusi;
	let broken_rule_list_id = [];
	
	while (c > 0){
		c = 0; aux_c = 0;
		for (let Rule of rul){
			if (CheckHypRule(aux_inc,aux_esc,Rule)){
				aux_c = c;
				let Thes = Rule.allora;
				let ThesRul_inc = Thes.filter(t => t.positivo);
				let ThesRul_tag_inc = ThesRul_inc.map(t => t.tag);
				
				let ThesRul_esc = Thes.filter(t => !t.positivo);
				let ThesRul_tag_esc = ThesRul_esc.map(t => t.tag);
				
				if (ThesRul_tag_inc.some(t => !aux_inc.includes(t))){
					c += 1; 
					aux_inc = [... new Set([...aux_inc, ...ThesRul_tag_inc])];
				}
				if (ThesRul_tag_esc.some(t => !aux_esc.includes(t))){
					c += 1; 
					aux_esc = [... new Set([...aux_esc, ...ThesRul_tag_esc])];
				}
				if (aux_c < c) {broken_rule_list_id.push(Rule.id); aux_c = c;}
				if (CheckConsistency(aux_inc,aux_esc)) {return broken_rule_list_id;}
			}
			
		}
	} 
	
	
	return -1;
}


// Ricerca
function cercaOggetti() {
	const risultatiDiv = document.getElementById("risultati");
	risultatiDiv.innerHTML = ``;
	
	// Normalizza input a lowercase
	const inclusi = document.getElementById("tagInput").value
    .split(',').map(t => t.trim().toLowerCase()).filter(t => t);
    const esclusi = document.getElementById("tagExcludedInput").value
    .split(',').map(t => t.trim().toLowerCase()).filter(t => t);
    
    // the 'filter(t => t)' is useful only if the list is empty. 
    // without it, it does not find any object when 'inclusi' is empty
    
    // sanity check: non ci devono essere tag sia inclusi che esclusi
    if ( CheckConsistency(inclusi,esclusi) ){
		risultatiDiv.innerHTML += '<br>Bro. Hai messo lo stesso tag in entrambi i campi.';
		return;
	}
	
	let vio = RuleViolation(inclusi,esclusi);
	if (vio !== -1){
		let viol_text = '<br>❌ <strong>Ricerca non valida</strong>: la combinazione viola le regole';
		for (let v of vio){
			let Rule = window.__rulList.find(r => r.id == v);
			viol_text += `<br><br><div><strong>${Rule.nome}</strong>:
			 ${Rule.se.filter(t => t.positivo).map(t => t.tag).join(', ')} 
			 ${Rule.se.filter(t => !t.positivo).map(t => 'non-' + t.tag).join(', ')} 
			 <b>implies</b> 
			 ${Rule.allora.filter(t => t.positivo).map(t => t.tag).join(', ')} 
			 ${Rule.allora.filter(t => !t.positivo).map(t => 'non-' + t.tag).join(', ')}
			  </div>`
			
		}
		
		risultatiDiv.innerHTML = viol_text;
		return;
	}
    
    // confronto con tags di oggetti case-insensitive
	let flag = 0;
	for (let Matrix of window.__objList){
		let mat_tags = Matrix.tags.map(t => t.toLowerCase());
		if (  inclusi.every(t => mat_tags.includes(t))  &&  esclusi.every(t => !mat_tags.includes(t)) ){
			risultatiDiv.innerHTML += `<br><div><strong>${Matrix.nome}</strong>: ${Matrix.tags.join(', ')}</div>`;
			flag = 1;
		} 
	} 
	if (!flag){risultatiDiv.innerHTML += `<br>🔍 Nessun oggetto trovato. <br><br> 
		Suggeriscimi una regola che confuta questa combinazione di tag o un oggetto con queste proprietà!`;}
	
	renderMathInElement(document.body);
}






// Ricerca le combinazioni di tag valide per cui non esiste un oggetto
function cercaMissing() {
	const risultatiDiv = document.getElementById("missing");
	risultatiDiv.innerHTML = ``;
	
	let numTags = window.__tagList.length;
	//console.log(numTags); 
	if (numTags > 31) { risultatiDiv.innerHTML = `WARNING: 
		The number of tags is 32 or more, so the number of combinations to check are over
		10^9. To prevent any lawsuit for pc destruction, I'm calling it quit here.`;  return;}
	for (let BinComb = 0; BinComb < 2**numTags; BinComb++){
		let inclusi = []; let esclusi = []; 
		for (let couAux = 0; couAux < numTags; couAux++){
			if (((BinComb >> couAux) % 2) == 1){ 
				inclusi.push(window.__tagList[couAux]);
			} else {
				esclusi.push(window.__tagList[couAux]);
			}
		}
		if (RuleViolation(inclusi,esclusi) == -1){
			let flag = 0;
			for (let Matrix of window.__objList){
				let mat_tags = Matrix.tags.map(t => t.toLowerCase());
				if (  inclusi.every(t => mat_tags.includes(t))  &&  mat_tags.every(t => inclusi.includes(t))  ){
					 flag = 1; break;  
				} 
			} 
			if (flag == 0){risultatiDiv.innerHTML += `<br><br><div> <b>Included:</b> ${inclusi.join(', ')}</div>
				<br><div><b>Excluded:</b> ${esclusi.join(', ')}</div>`;}
		}
	}
}









init();
