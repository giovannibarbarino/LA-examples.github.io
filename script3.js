const dimension = document.getElementById("MatDim");
const matrix = document.getElementById("input-matrix");
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
 */

