const dimension = document.getElementById("MatDim");
const matrix = document.getElementById("input-matrix");

dimension.addEventListener("input", updateValue);

function InsertMatrixForm(d){
	matrix.textContent = '';
	
	matrix.textContent += '<form id="inputField" role="form">';
	
	
	matrix.textContent += 'a</form>';
	//matrix.textContent = d;
}





function updateValue(e) {
	let d = Number(e.target.value);
	if (Number.isInteger(d) && 0<d && d<6){ InsertMatrixForm(d) }
	else {matrix.textContent = '';}
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

