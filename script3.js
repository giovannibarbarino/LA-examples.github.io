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

function TagVerification(){
	
	if (real_d == 0) {return;}
	let VTtext = '';
	let a = math.zeros(math.matrix([real_d, real_d]));
	for (let i = 1; i < real_d+1; i++){
		for (let j = 1; j < real_d+1; j++) {
			let aux_entry = document.getElementsByName(`entry${i}${j}`)[0].value;
			if (!isNaN(aux_entry)) a.set([i-1,j-1], Number(aux_entry));
		}
	}
	
	VTtext = `<br>Your selected matrix is \\( \\begin{bmatrix}`;
	for (let i = 1; i < real_d+1; i++){
		for (let j = 1; j < real_d+1; j++) {
			VTtext += `${a.get([i-1,j-1])}`;
			if (j != real_d) VT.innerHTML += `&`;
		}
		if (i != real_d) VT.innerHTML += ` \\\\ `;
	}
	VTtext += `\\end{bmatrix}\\)`;
	VT.innerHTML = VTtext;
	console.log(a);
	
	
	
}



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

