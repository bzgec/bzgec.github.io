var selectedPlayer = 0;

window.addEventListener("keyup", function(event) {	
	console.log(event.keyCode)		
	/*if (event.keyCode == 32) {	// space 
		drawTable();
	}*/
	if (event.keyCode == 13) {	// enter 
		if ( changingNames == 1 ) {	// if you press enter to confirm changes made to player names
			editPlayerNames();
			drawTable();
			changingNames = 0;
		}
		else {	 
			addGameRow();
		}
	}
	if (event.keyCode == 67) {	// c
		if ( changingNames == 0 ) {
			document.getElementById('addingNames').style.display = "block";
			changingNames = 1;
		}
		else if ( changingNames == 1 ) {
			editPlayerNames();
			drawTable();
			changingNames = 0;
		}
	}
	if (event.keyCode == 9) {	// TAB
		selectedPlayer++;
		if (selectedPlayer == 1) {
			document.getElementById("addScoreToPlayer1").focus();
		}
		else if (selectedPlayer >= numberOfPlayers) {	// -1 because selectedPlayer starts with 0
			selectedPlayer = 0;
		}
	}
});

$(':button').click(	// if any button is clicked...
	function(){
		var id = $(this).attr('id');	// in var id is saved information about id of this button 
		if (id == null) return;			// if RestartESP button (dropdown) is pressed, button is clicked, and it does not have a value, so console logs as undefined
		else if (id == "drawTableBtn") {	// if id=refreshButton...
			if ( playedGames == 0 ) {
				editPlayerNames();
				drawTable();
			}
			/*else if (changingNames == 1) {
				editPlayerNames();
				drawTable();
			}*/
		}
		else if (id == "addNamesBtn") {	// if id=refreshButton...
			drawPlayerNamesTable();
		}
		else if (id == "changeNamesBtn") {	// if id=refreshButton...
			if ( changingNames == 0 ) {
				document.getElementById('addingNames').style.display = "block";
				changingNames = 1;
			}
			else if ( changingNames == 1 ) {
				editPlayerNames();
				drawTable();
				changingNames = 0;
			}
		}
	}
);

var playedGames = 0;
var gameScores = "";
var totalScores = "";
var numberOfPlayers = 0;	// it is set later when you input number of players in drawPlayerNamesTable()
var scores =[]; //= new Array(numberOfPlayers);	// set when you input number of players
var playerNames =[]; //= new Array(numberOfPlayers);	// set when you input number of players
var changingNames = 0;

/*for (var i = 0; i <= numberOfPlayers; i++) {
    scores[i] = 0;
}*/
function drawPlayerNamesTable () {
	// added here because if you add more than 4 players it would not work correctly
	numberOfPlayers = document.getElementById('numberOfPlayers').value;
	for (var i = 1; i <= numberOfPlayers; i++) scores.push(0);
	playerNames = new Array(numberOfPlayers);

	numberOfPlayers = document.getElementById('numberOfPlayers').value;
	document.getElementById('addingNames').style.display = "block";
	//var table = '<table class="table table-sm" id="gameTable"><tr class="top-border bottom-border">';	//<th scope="col">Name:</th>';
	var table = '<table class="table table-sm table-responsive" id="gameTable"><tr class="top-border bottom-border"><th scope="col">Input names:</th>';
	for (var i = 1; i <= numberOfPlayers; i++) {
		table += '<th scope="col"><input type="text" value="Player_' + i + '" id="player' + i + '" class="text-center"></th>';
	}
	table += '</tr>';
	document.getElementById('addingNames').innerHTML = table;
	document.getElementById('drawTableBtn').style.display = "inline";
}

function editPlayerNames () {
	for (var i = 1; i <= numberOfPlayers; i++) {
		playerNames[i-1] = document.getElementById('player' + i).value;
	}
}

function drawTable() {
	document.getElementById('addNamesBtn').style.display = "none";
	document.getElementById('addingNames').style.display = "none";
	document.getElementById('drawTableBtn').style.display = "none";
	document.getElementById('changeNamesBtn').style.display = "inline";
	
	var table = '<table class="table table-sm table-striped-myVersion table-hover table-responsive" id="gameTable"><tr><th scope="col">#</th>';
	for (var i = 1; i <= numberOfPlayers; i++) {
		//playerNames[i-1] = document.getElementById('player' + i).value;
		table += '<th scope="col" class="text-center">' + playerNames[i-1] + '</th>';
	}
	table += '</tr>';

	table += gameScores;

	if (totalScores == "") {
		table += '<tr class="top-border"><th scope="row">Total score</th>'
		for (i = 1; i <= numberOfPlayers; i++) {
			table += '<td id="scoreOfPlayer' + i + '" class="text-center">0</td>'
		}
		table += '</tr>'
	}
	else {
		table += totalScores;
	}
	
	table += '<tr class="top-border"><th scope="row"><button class="btn btn-sm btn-secondary cursor-pointer" id="addBtn" onclick="addGameRow()">Add results</button></th>'
	for (i = 1; i <= numberOfPlayers; i++) {
		table += '<td class="text-center"><input type="number" value="" id="addScoreToPlayer' + i + '" class="text-center"></td>';
	}
	table += '</tr>';

	table += '</table>';
	document.getElementById('gameTableSpan').innerHTML = table;
}

function countSum () {
	totalScores = '<tr class="top-border"><th scope="row">Total score</th>'
	for (var i = 0; i < numberOfPlayers; i++) {
		scores [i] += Number(document.getElementById('addScoreToPlayer' + (i+1)).value);
		totalScores += '<td id="scoreOfPlayer' + i + '" class="text-center">' + scores[i] + '</td>'
	}
	totalScores += '</tr>'
	drawTable();
}

function addGameRow () {
	playedGames++;
	gameScores += '<tr><th scope="row">' + playedGames + '</th>';
	for (var i = 1; i <= numberOfPlayers; i++) {
		gameScores += '<td class="text-center">' + document.getElementById('addScoreToPlayer' + i).value + '</td>';
	}
	gameScores += '</tr>';
	countSum();
	selectedPlayer = 0;
}
