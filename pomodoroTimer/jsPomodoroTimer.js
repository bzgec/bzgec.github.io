window.addEventListener('keydown', function(event) {
	if(event.keyCode == 32 && event.target == document.body) {	// 32 is SPACE
		event.preventDefault();	// to prevent SPACE bar from scrolling the page
	}
});
window.addEventListener("keyup", function(event) {
		var keyCode = event.keyCode;
		console.log(keyCode)
			if (keyCode == 82) {	// r
				reset();
			}
			else if (keyCode == 84 || keyCode == 27) {	// t, esc
				if (displayStatus == "visible") {
					hide();
				}
				else if (displayStatus == "hidden") {
					show();
				}			}
			else if (keyCode == 32) {	// space
				if (timer_is_on) {
					if (end == 'waiting') {
						end = 'proceed';
					}
					else if (end == 'counting') {
						stopCount();
						buttons();
					}
					event.preventDefault(); // to prevent from toggling selected checkbox
				}
				else {
					startCount();
				}
				//if ( event.target == document.body) {
					event.preventDefault();
					//}
				//toggle();
			}
			else if (keyCode == 67) {	// C
				toggleCheckbox();
			}
			else if (keyCode == 80) {	// P
				if (timer_is_on) {
					stopCount();
				}
				buttons();
			}
			else if ((keyCode <= 57 && keyCode >= 48) || (keyCode <= 105 && keyCode >= 96)) {	// if number is pressed (top line or numbers in box)
				if (!timer_is_on) {
					refreshTimes();
				}
			}
			else if (keyCode == 83) {	// S
				skipButtonFunction();
			}
});


		document.getElementById('resetButton').onclick = function() {
			//toggle();
			reset();
		};
		document.getElementById('toggleButton').onclick = function() {
			if (displayStatus == "visible") {
				hide();
			}
			else if (displayStatus == "hidden") {
				show();
			}
		};
		document.getElementById('multiButton').onclick = function() {
			if (timer_is_on) {
				if (end == 'waiting') {
					end = 'proceed';
				}
			}
			else {
				startCount();
			}
		};
		document.getElementById('pauseButton').onclick = function() {
			if (timer_is_on) {
				stopCount();
			}
			buttons();
		};
		document.getElementById('skipButton').onclick = function() {
			skipButtonFunction();
		};

		var end = 'counting';
		var c = 1;	// should start with 1 because otherwise timer would stop one second too late
		var s = 0;
		var sStudy = 0;
		var sBreak = 0;
		var t;
		var timer_is_on = 0;
		var study = 0;
		var Break = 0;
		var flagStudyBreak = 0;	// 0 = paused, 1 = studyTime, 2 = breakTime, (was used onec - 4 = pageLoadaed)
		var previousFlag = 0;
		var pomodoroCounter = 0;
		var durationBreak = 0;
		var durationStudy = 0;
		var previousSec = 0;
		var currentSec = 0;
		//var paused = 0;
		//getTimerNumbers();	// gives study and Break values	// needed here so the remainingSession is shown at the begining...
		refreshTimes(); // updates study and break values(getTimerNumber()) and refreshes displayed remaining time
		document.getElementById('remainingSession').innerHTML = 'study';
		var remainingTime = Math.floor( study );	// in case the value is like 0.08
		printRemainingTime();	
		var displayStatus = "visible";

		function timedCount() {
			//console.log(remainingTime)
			//console.log(c)
			currentSec = getSec();
			if (previousSec != currentSec) {
				c++;
				durations();
				previousSec = currentSec;
			}

			if (c >= study && flagStudyBreak == 1 && end == 'counting') {
				console.log('Waiting for space to start Break.');
				if (document.getElementById('blinkScreenCheckbox').checked == true) {
					show();setTimeout(hide, 300);setTimeout(show, 600);setTimeout(hide, 900);setTimeout(show, 1200);
				}
				setTimeout(show,1200);
				if (document.getElementById('soundCheckbox').checked == true) {
					beep1.play(); setTimeout(function(){beep1.play()},400); setTimeout(function(){beep1.play()},800); setTimeout(function(){beep1.play()},1200);
				}
				end = "waiting";
				console.log('end: ' + end);
			}
			else if (c >= study && flagStudyBreak == 1 && end == 'proceed') {
				console.log('Leaving study and entering break.');
				//toggle();
				c = 1;	// should start with 1 because otherwise timer would stop one second too late
				previousFlag = 1;
				flagStudyBreak = 2;
				document.getElementById('pomodoroCounter').innerHTML = ++pomodoroCounter;
				console.log('Study end: ' + getTime());
				end = 'counting';
				document.getElementById('remainingSession').innerHTML = 'break';
				getTimerNumbers();
				remainingTime = Math.floor(Break);
				printRemainingTime();
				console.log('end: ' + end);
			}
			else if (c >= Break && flagStudyBreak == 2 && end == 'counting') {
				console.log('Waiting for space to start study');
				if (document.getElementById('blinkScreenCheckbox').checked == true) {
					hide();setTimeout(show, 300);setTimeout(hide, 600);setTimeout(show, 900);//setTimeout(show, 1200);
				}
				if (document.getElementById('soundCheckbox').checked == true) {
					beep1.play(); setTimeout(function(){beep1.play()},400); setTimeout(function(){beep1.play()},800); setTimeout(function(){beep1.play()},1200);
				}
				end = 'waiting';
				console.log('end: ' + end);
			}
			else if (c >= Break && flagStudyBreak == 2 && end == 'proceed') {
				console.log('Leaving break entering study');
				if (document.getElementById('toggleCheckbox').checked == true) {
					hide();
				}
				c = 1;	// should start with 1 because otherwise timer would stop one second too late
				previousFlag = 2;
				flagStudyBreak = 1;
				console.log('Break end: ' + getTime());
				end = 'counting';
				document.getElementById('remainingSession').innerHTML = 'study';
				getTimerNumbers();
				remainingTime = Math.floor(study);
				printRemainingTime();
				console.log('end: ' + end);
			}

			buttons();

			t = setTimeout(function(){ timedCount() }, 200);
		}

		function startCount() {
			getTimerNumbers();	// gives study and Break values
			//document.getElementById('remainingSession').innerHTML = 'study';
			/*if (flagStudyBreak != 0) { // 0 = paused
				remainingTime = Math.floor( study );	// in case the value is like 0.08
			}*/
			//printRemainingTime();	// checks
			if (!timer_is_on) {
				if (document.getElementById('toggleCheckbox').checked == true) {
					hide();
				}
				else {
					show();
				}
				timer_is_on = 1;
				console.log('Start: ' + getTime());
				var helper = previousFlag;
				previousFlag = flagStudyBreak;
				if (flagStudyBreak == 0) { // if timer was paused, it is needed because the skipButtonFunction....
					if (helper == 2) flagStudyBreak = 2; // if before pause there was breakTime
					else flagStudyBreak = 1;	// if before pause there was studyTime
				}
				printRemainingTime();	// it is here so that when timer is started it show time on tab (title) immediately
				console.log('previousFlag: ' + previousFlag);
				console.log('currentFlag: ' + flagStudyBreak);
				//setTimeout(function(){ timedCount() }, 900);
				previousSec = getSec();
				timedCount();
			}
		}

		function stopCount() {
			show();
			clearTimeout(t);
			timer_is_on = 0;
			//paused = 1;
			console.log('Stop: ' + getTime());
			previousFlag = flagStudyBreak;
			flagStudyBreak = 0;
			console.log('previousFlag: ' + previousFlag);
			console.log('currentFlag: ' + flagStudyBreak);
		}

		function getSec () {
			var d = new Date();
			return d.getSeconds();
		}

		function refreshTimes (event) {
			//console.log(event.button)
			if (!timer_is_on) {
				getTimerNumbers();
				remainingTime = Math.floor( study );
				document.getElementById('remainingTime').innerHTML = convertToNormalTimeForm(remainingTime);
			}
		}

		function durations () {
			if (remainingTime > 0) {
				remainingTime--;
				printRemainingTime();
			}

			s++;
			document.getElementById("durationTotal").innerHTML = convertToNormalTimeForm(s);
			
			if (flagStudyBreak == 1) {
				sStudy++;
				document.getElementById("durationStudy").innerHTML = convertToNormalTimeForm(sStudy);
			}
			else if (flagStudyBreak == 2) {
				sBreak++;
				document.getElementById("durationBreak").innerHTML = convertToNormalTimeForm(sBreak);
			}
		}

		function printRemainingTime () {
			var remainingTimeLocalVar = convertToNormalTimeForm(remainingTime);
			document.getElementById('remainingTime').innerHTML = remainingTimeLocalVar;

			if (flagStudyBreak != 0) {
				remainingTimeLocalVar = remainingTimeLocalVar.substring(remainingTimeLocalVar.indexOf(':')+1, remainingTimeLocalVar.length);
				document.title = '(' + remainingTimeLocalVar + ') Pomodoro';
			}
			else {
				document.title = 'Pomodoro';
			}
		}

		function checkTime(i) {
			if (i < 10) {
				i = "0" + i;
			}
			return i;
		}

		function buttons () {
			if (timer_is_on) {
				if (end == 'waiting') {	// waiting to start break or study session
					//document.getElementById('pauseButton').disabled = false;
					document.getElementById('multiButton').disabled = false;
					document.getElementById('multiButton').value = 'NEXT';
					document.getElementById('skipButton').disabled = true;
				}
				else if (end == 'counting') {	// in middle of a session
					document.getElementById('pauseButton').disabled = false;
					document.getElementById('multiButton').disabled = true;
					document.getElementById('multiButton').value = 'CONTINUE';
					document.getElementById('skipButton').disabled = false;
				}
			}
			else {	// if timer is paused
				document.getElementById('pauseButton').disabled = true;
				document.getElementById('multiButton').disabled = false;
				document.getElementById('multiButton').value = 'CONTINUE';
				document.getElementById('skipButton').disabled = false;
			}
		}

		function skipButtonFunction () {
			getTimerNumbers();	
			if (flagStudyBreak == 1) {	// if it was studyTime
				flagStudyBreak = 2;	// now it is breakTime
				previousFlag = 1;
			}
			else if (flagStudyBreak == 2) {	// if it was breakTime
				flagStudyBreak = 1;	// now it is studyTime
				previousFlag = 2;
			}
			else {	// if it was paused, or if you just loaded the page (flagStudyBreak == 0)
				if (previousFlag == 2) {	// if before pause it was breakTime
					flagStudyBreak = 1;
					previousFlag = 1;	// i know it is weird but it works
					console.log('previousFlag was 2')
				}
				else {	// if before pause was studyTime or page just loaded
					flagStudyBreak = 2;
					console.log('previousFlag was 0/1')
					previousFlag = 2;	// i know it is weird but it works
				}
			}

			// new flagStudyBreak
			if (flagStudyBreak == 2) {
				remainingTime = Math.floor(Break);
				document.getElementById('remainingSession').innerHTML = 'break';
			}
			else {
				remainingTime = Math.floor(study);
				document.getElementById('remainingSession').innerHTML = 'study';
			}
			printRemainingTime();
			console.log('previous: ', previousFlag)
			console.log('current: ', flagStudyBreak)
		}

		function getTimerNumbers () {
			console.log('getTimerNumbers...')
			study = document.getElementById("study").value  * 60;
			Break = document.getElementById("break").value  * 60;
			console.log('timer study: ' + study + ', Break: ' + Break);
		}

		function reset () {
			document.getElementById("study").value = 25;
			document.getElementById("break").value = 5;
			end = 'counting';
			c = 1;	// should start with 1 because otherwise timer would stop one second too late
			s = 0;
			sStudy = 0;
			sBreak = 0;
			clearTimeout(t);
			document.title = 'Pomodoro';
			timer_is_on = 0;
			study = 0;
			Break = 0;
			durationBreak = 0;
			durationStudy = 0;
			flagStudyBreak = 0;	// 0 = paused, 1 = studyTime, 2 = BreakTime
			previousFlag = 0;
			pomodoroCounter = 0;
			//paused = 0;
			//getTimerNumbers();
			//remainingTime = Math.floor( study );
			//printRemainingTime();
			refreshTimes();
			document.getElementById('remainingSession').innerHTML = 'study';
			document.getElementById("durationTotal").innerHTML = "00:00:00";
			document.getElementById("durationStudy").innerHTML = "00:00:00";
			document.getElementById("durationBreak").innerHTML = "00:00:00";
			document.getElementById('multiButton').value = 'START';
			document.getElementById('pauseButton').disabled = true;
			document.getElementById('multiButton').disabled = false;
			document.getElementById('skipButton').disabled = false;
			show();
		}

		function convertToNormalTimeForm (sec) {
			var hr = 0;
			var min = 0;

			hr = Math.floor(sec/3600);
			sec %= 3600
			min = Math.floor(sec/60);
			sec = sec % 60;
			return checkTime(hr) + ":" + checkTime(min) + ':' + checkTime(sec);
		}

		function show () {
			//console.log('show')
			document.getElementsByTagName('BODY')[0].style.backgroundColor = "#36393e";
			$('.toggle').css("display","block");
			document.getElementsByTagName("html")[0].style.cursor = "auto";
			displayStatus = "visible";
		}

		function hide () {
			//console.log('hide')
			document.getElementsByTagName('BODY')[0].style.backgroundColor = "black";
			$('.toggle').css("display","none");
			if (document.getElementById("cursorCheckbox").checked == true) {
				document.getElementsByTagName("html")[0].style.cursor = "none";
			}
			displayStatus = "hidden";
		}

		function toggleCheckbox () {
			if (document.getElementById("cursorCheckbox").checked == true) {
				document.getElementById("cursorCheckbox").checked = false;
			}
			else {
				document.getElementById("cursorCheckbox").checked = true;
			}
		}

		function getTime() {
			var time = new Date().toString();
			return time.substring(time.indexOf(':') - 2, time.indexOf(':') + 6);
		}

		var beep1 = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
