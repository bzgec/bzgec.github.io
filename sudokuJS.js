$(document).ready(function(){
	var sudokuLive;
	var randomSudoku;	// number of selecte/playing sudoku
	var pickedX, pickedY; // needed if number is pressed not clicked from table below sudoku


	$(':button').click(	// if any button is clicked...
		function(){
			var id = $(this).attr('id');	// in var id is saved information about id of this button 
			if (id == null) return;			// if RestartESP button (dropdown) is pressed, button is clicked, and it does not have a value, so console logs as undefined
			else if (id == "drawSudoku") {	// if id=refreshButton...
				sudokuLive = [[0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0]];
				pickNumberOfSudoku();	// picks one of the sudokus
				//var x = document.getElementsByClassName("showWhenSudoku");
				//x[x.length - 1].style.display = "block";		
				$('.showWhenSudoku').css("display","block");	
				copySudoku();
				drawSudoku();
				document.getElementById("hintsDiv").innerHTML = "";	// clears hints 
			}
			else if (id == "resetSudoku") {
				sudokuLive = [[0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0]];
				copySudoku();
				drawSudoku();
				document.getElementById("hintsDiv").innerHTML = "";
			}
			else if (id == 'helpMode') {
				$('.toggle').toggle();
			}
			else if (id == 'checkSudoku') {
				document.getElementById('result').innerHTML = "You made " + checkSudoku() + " mistakes";
			}
		}
	);
	

	//da zrise sudoku
	function drawSudoku(){
		var v, s, vDiv="";	// v == row, s == column (stolpec)
		
		vDiv += "<table border>";
		for(v=0; v<9; v++){
			vDiv += "<tr class='sudoku'>";
			for(s=0; s<9; s++){
				if(sudokuSolve[randomSudoku][v][s] == 0){	// if there is no numver in sudokuNumber
					/*if(sudokuLive[v][s] == 0) {	// if number is added in sudokuLive
						vDiv += "<td id='number" + v.toString()  + s.toString() + "')>";
					}
					else{
						vDiv += "<td id='number" + v.toString()  + s.toString() + "')>";
						vDiv += sudokuLive[v][s];
					}*/
					if(sudokuLive[v][s] == 0) {	// if number is not added in sudokuLive
						vDiv += "<td class='sudoku cursor-pointer' onclick=clicked(" + v + "," + s + ") id='" + v.toString()  + s.toString() + "'>";
					}
					else{
						vDiv += "<td class='sudoku cursor-pointer' style='background-color:#444;' onclick=clicked(" + v + "," + s + ") id='" + v.toString()  + s.toString() + "'>";
						vDiv += sudokuLive[v][s];
					}
				}
				else{
					vDiv += "<td class='sudoku barvi cursor-default'>";
					vDiv += sudokuSolve[randomSudoku][v][s];
				}
				vDiv += "</td>";
			}
			vDiv += "</tr>";
		}
		vDiv += "</table><br>";

		// it dislpay numbers for beauty, it is later updated to correct pickedY and pickedX
		var defaultHintsDiv = "<table><tr>";
		for(var i = 1; i <= 9; i++){
			defaultHintsDiv += "<td class='hint cursor-pointer' onclick=vstavi(" +pickedY+ "," +pickedX+ "," + i + ")>" + i + "</td>";
		}
		defaultHintsDiv += "<td class='hint cursor-pointer' onclick=vstavi(" +pickedY+ "," +pickedX+ "," + 0 + ")>DEL</td></tr></table>";
		document.getElementById("defaultHintsDiv").innerHTML = defaultHintsDiv;

		return document.getElementById("sudokuTable").innerHTML = vDiv;
	}

	//zbirka kaj se nahaja v tisti vrstici, stolpcu, kvadratu
	window.clicked = function(y, x){	// global function
		drawSudoku();	// it is needed because the backgroundColor of previously clicked td would not change when another one is clicked
		document.getElementById(y.toString() + x.toString()).style.backgroundColor = "#666";
		var najdenaStevila = [];
		pickedY = y;
		pickedX = x;

		//vrstica
		for(var j = 0; j<9; j++){	// checks numbers in a row
			if(sudokuLive[y][j] != 0){
				najdenaStevila.push(sudokuLive[y][j]);
			}
		}

		//stoplec
		for(var j = 0; j<9; j++){	// checks numbers in a column (stolpcu)
			if(sudokuLive[j][x] != 0){
				najdenaStevila.push(sudokuLive[j][x]);
			}
		}

		//po podani kodi za kvadrat // checks numbers in square 3x3
		var sektorX = Math.floor((x) / 3);
		var sektorY = Math.floor((y) / 3);
		for(var i = sektorX * 3; i < sektorX * 3 + 3; i++){
			for(var j = sektorY * 3; j < sektorY * 3 + 3; j++){
				if(sudokuLive[j][i] != 0){
					najdenaStevila.push(sudokuLive[j][i]);
				}
			}
		} 

		// display numbers that you can click
		var defaultHintsDiv = "<table><tr>";
		for(var i = 1; i <= 9; i++){
			defaultHintsDiv += "<td class='hint cursor-pointer' onclick=vstavi(" +pickedY+ "," +pickedX+ "," + i + ")>" + i + "</td>";
		}
		defaultHintsDiv += "<td class='hint cursor-pointer' onclick=vstavi(" +pickedY+ "," +pickedX+ "," + 0 + ")>DEL</td></tr></table>";
		document.getElementById("defaultHintsDiv").innerHTML = defaultHintsDiv;

		//napise stevila ki so lahko v tem kvadratku
		var hintsDiv = "<table><tr>";
		for(var i = 1; i <= 9; i++){
			if(najdenaStevila.indexOf(i) == -1) hintsDiv += "<td class='hint cursor-pointer' onclick=vstavi(" +y+ "," +x+ "," + i + ")>" + i + "</td>";
		}
		hintsDiv += "<td class='hint cursor-pointer' onclick=vstavi(" +y+ "," +x+ "," + 0 + ")>DEL</td></tr></table>";
		return document.getElementById("hintsDiv").innerHTML = hintsDiv;
	}

	function checkSudoku () {
		var mistake = 0;
		for(v=0; v<9; v++){
			for(s=0; s<9; s++){
				if(sudokuFull[randomSudoku][v][s] != sudokuLive[v][s]) mistake++;
			}
		}
		return mistake;	
	}


	//vstavi stevilko v sudoku
	window.vstavi = function(y, x, z){	// global function
	    //this.style.backgroundColor = "#111";
		sudokuLive[y][x] = z;
		drawSudoku();
		if (!checkSudoku()) {
			document.getElementById('result').innerHTML = "Success";
		}
	}

	window.addEventListener("keyup", function(event) {	
		if (event.keyCode >= 48 && event.keyCode <= 57) {
			sudokuLive[pickedY][pickedX] = event.keyCode - 48;
		}	
		else if (event.keyCode >= 96 && event.keyCode <= 107) {
			sudokuLive[pickedY][pickedX] = event.keyCode - 96;
		}		
		drawSudoku();
		if (!checkSudoku()) {
			document.getElementById('result').innerHTML = "Success";
		}
	});


	//kopira iz sudokuSolve v sudokuLive
	function copySudoku(){
		var j, i;
		for(j=0; j<9; j++){
			for(i=0; i<9; i++){
				if(sudokuSolve[randomSudoku][j][i] != 0) sudokuLive[j][i] = sudokuSolve[randomSudoku][j][i];
			}
		}
		return sudokuLive;
	}

	function pickNumberOfSudoku() {
		var oldNumber = randomSudoku;
		while (oldNumber == randomSudoku) {	// it pick new randomSudoku number which has to be different from previous 
			randomSudoku = Math.floor(Math.random()*sudokuSolve.length)	// picks one of the sudokus
		}
	}
})