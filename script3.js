// import { zeros } from './math.js'
//const { zeros } = require('./math.js');

const dimension = document.getElementById("MatDim");
const matrix = document.getElementById("input-matrix");
const VT = document.getElementById("verified-tags");
var real_d = 0;

dimension.addEventListener("input", updateValue);

function InsertMatrixForm(d){
	matrix.innerHTML = ''
	//matrix.innerHTML = '<form id="inputMatrix" role="form">';
	for (let i = 1; i < d+1; i++){
		matrix.innerHTML += '<br>';
		for (let j = 1; j < d+1; j++) matrix.innerHTML += ('<input type="text" name="entry' + i + j + '" size="1" />');
	}
	//matrix.innerHTML += '</form>';
}


function updateValue(e) {
	let d = Number(e.target.value);
	if (Number.isInteger(d) && 0<d && d<6){ InsertMatrixForm(d); real_d = d;}
	else {matrix.innerHTML = ''; real_d = 0;}
}


function Isdiagonal(M) {
	if (math.deepEqual(M,math.diag(math.diag(M)))) return true;
	else return false;
}


function Isbinary(M) {
	for (let i = 1; i < real_d+1; i++){
		for (let j = 1; j < real_d+1; j++) {
			let e = M.get([i-1,j-1]); let esq = math.multiply(e,e);
			if(math.Complex.compare(e,esq) != 0){return false;}
		}
	}
	return true;
}

function Issymmetric(M) {
	if (math.deepEqual(M,math.transpose(M))) return true;
	else return false;
}

function Ishermitian(M) {
	let N = math.conj(M);
	if (math.deepEqual(M,math.transpose(N))) return true;
	else return false;
}

function Isunitary(M) {
	let N = math.multiply(math.transpose(math.conj(M)),M);
	if (math.deepEqual(math.identity(real_d),N)) return true;
	else return false;
}

function Isnormal(M) {
	let N = math.transpose(math.conj(M));
	if (math.deepEqual(math.multiply(M,N), math.multiply(N,M))) return true;
	else return false;
}

function Isinvertible(M) {
	if (math.det(M) != 0) return true;
	else return false;
}

function Isskewhermitian(M) {
	let N = math.transpose(math.conj(M));
	N = math.add(math.identity(real_d),N);
	//console.table(math.add(N,M)._data);
	if (math.deepEqual(math.identity(real_d),math.add(N,M))) return true;
	// I know it doesn't make sense, but if I compare it with math.zeros it doesn't work...
	else return false;
}

function Isreal(M) {
	for (let i = 1; i < real_d+1; i++){
		for (let j = 1; j < real_d+1; j++) {
			let e = M.get([i-1,j-1]); 
			if(math.im(e) != 0){return false;}
		}
	}
	return true;
}


function TagVerification(){
	
	if (real_d == 0) {return;}
	let VTtext = '';
	let a = math.zeros(math.matrix([real_d, real_d]));
	for (let i = 1; i < real_d+1; i++){
		for (let j = 1; j < real_d+1; j++) {
			let aux_entry = document.getElementsByName(`entry${i}${j}`)[0].value;
			try {
				let e = math.complex(aux_entry);
			} catch (err) {continue;}
			let e = math.complex(aux_entry);
			//console.log(e);
			a.set([i-1,j-1], e);
		}
	}
	
	VTtext = `<br>Your selected matrix is <strong>\\( \\begin{bmatrix} `;
	for (let i = 1; i < real_d+1; i++){
		for (let j = 1; j < real_d+1; j++) {
			VTtext += `${a.get([i-1,j-1])}`;
			if (j != real_d) VTtext += ` & `;
		}
		if (i != real_d) VTtext += ` \\\\ `;
	}
	VTtext += ` \\end{bmatrix} \\)</strong>`;
	VT.innerHTML = VTtext;
	
	let inclusi = []; let esclusi = []; let missing = [];
	let numTags = window.__tagList.length;
	
	for (let couAux = 0; couAux < numTags; couAux++){
		funcName = `Is` + window.__tagList[couAux].replace(/[^a-zA-Z0-9\s]/g, '');
		//console.log(typeof window[funcName]);
		if (typeof window[funcName] != "function") {
			console.log("missing function to check the tag " +  window.__tagList[couAux]);
			missing.push(window.__tagList[couAux]);
			continue;
		}
		if ( window[funcName](a) ){ 
			inclusi.push(window.__tagList[couAux]);
		} else {
			esclusi.push(window.__tagList[couAux]);
		}
	}
	
	//if (typeof actions[task] === "function") {
    //actions[task]();
	//}
	
	
	VT.innerHTML += `<br><br><div> <b>Included:</b> ${inclusi.join(', ')}</div>
			<br><div><b>Excluded:</b> ${esclusi.join(', ')}</div>
			<br><div><b>Missing tool to check:</b> ${missing.join(', ')}</div>`;
	
	
	
	
	renderMathInElement(document.body);
	
}





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




init();

/*
 * <form id="inputField" role="form">
				<input type="text" name="field00" size="3">
				<input type="text" name="field01" size="3">
				<input type="text" name="field02" size="3">
				<input type="text" name="field03" size="3">
				<br>
				<input type="text" name="field10" size="3">
				<input type="text" name="field11" size="3">
				<input type="text" name="field12" size="3">
				<input type="text" name="field13" size="3">
				<br>
				<input type="text" name="field20" size="3">
				<input type="text" name="field21" size="3">
				<input type="text" name="field22" size="3">
				<input type="text" name="field23" size="3">
			</form>
			
			"\\( \\begin{bmatrix} 1 & 1 & 1 \\\\ 0 & 1 &  0 \\\\ 1 & 1 & 0 \\end{bmatrix}\\)"
 */

