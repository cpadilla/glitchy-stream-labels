/* VARIABLE ===================================== */
/* VARIABLE: CONSTANT -------------------------- */
//  , '• live a little •'
const _allRandomCharOption = "abcdefghijklmnopqrstuvwxyz*&@^+/#~;$.`";
const _allBlackListChar = ["_", "-"];
const _animationFPS = 24;
const _animationDuration = 2000;
const _refreshCycle = 10;
var _CYCLE = 0;

const _CSS = {
	ENABLE: 'glitch',
};

function Node(id){
    const _node = document.getElementById(id);
    _node.originalText = _node.textContent.replace(/\r?\n|\r/, '');
    _node.revert = false;
    _node.original = _node;
    _node.isAnimationActive = false;
    // start at -1 so when we increment for the
    // first time we start at index 0
    _node.textOptionSelect = -1;

    return _node;
}


/* FUNCTION ===================================== */

function raf(fps, node, callback) {
	node.isAnimationActive = true;
	const delay = 1000 / fps;                             // calc. time per frame
	let time = null;                                      // start time
	let frame = -1;                                       // frame count
	let tref = null;                                     // rAF time reference
	function loop(timestamp) {
		time = time || timestamp;         									// init start time
		var seg = Math.floor((timestamp - time) / delay); 	// calc frame no.
		if (seg > frame) {                                	// moved to next frame?
			frame = seg;                                  		// update
			callback({                                   			// callback function
				time: timestamp,
				frame: frame,
			});
		}
		if (node.isAnimationActive) {
			tref = window.requestAnimationFrame(loop);		
		}
	}
	loop();
}


/* FUNCTION: HELPER ---------------------------- */

function _getRandomLetter(){
	const index = Math.floor(Math.random() * _allRandomCharOption.length);
	return _allRandomCharOption[index];
}



function _setNodeText(node, text){
	text = (Array.isArray(text) ? text.join('') : String(text));
	node.innerText = text;
	node.dataset[node.id] = text;
}


/* FUNCTION: ACTION ---------------------------- */


function _startScrabbleNodeText(node){
    node.classList.add(_CSS.ENABLE);
    const textDesired = node.revert ? node.originalText : node.textOption[node.textOptionSelect];
	let text = node.textContent.trim().split('');
	const index = Math.round(Math.random() * textDesired.length);
	const isInvalidIndex = _allBlackListChar.some((char) => {
		return Boolean(char === text[index]);
	});
	if (!isInvalidIndex) {
		text[index] = _getRandomLetter();
		_setNodeText(node, text);			
	}
}

function _stopScrabbleNodeText(node){
	let textCurrent = node.textContent.trim().split('');
    const textDesired = node.revert ? node.originalText : node.textOption[node.textOptionSelect];
    const index = Math.round(Math.random() * textDesired.length);
	if (textCurrent[index] !== textDesired[index]) {
		textCurrent[index] = textDesired[index];
		_setNodeText(node, textCurrent);
	}
    
    // Text is unscrambled
	if (textCurrent.join('') === textDesired) {
        node.isAnimationActive = false;
		node.original.classList.remove(_CSS.ENABLE);
			window.setTimeout(() => {
                // toggle the revert to switch back to the label
                // from displaying one of the values
                node.original.revert = !node.original.revert;
                _CYCLE += 1;

                // TODO: need to debug this further, I don't
                // think it works...
                // if we've reached our cycle limit, check the
                // text file again for updates
                if (_CYCLE >= _refreshCycle) {
                    _CYCLE = 0;
                    console.log("Refreshing text...");
                    readTextFiles();
                }
				_scrabbleNodeText(node.original);
			}, 7000);
	}
}


function _scrabbleNodeText(node){
    console.log(node.textOption);
    // Set the next text to show
	node.textOptionSelect = (node.textOptionSelect + 1) % node.textOption.length;
	const totalFrame = Math.floor((_animationDuration / 1000) * _animationFPS);
	raf(_animationFPS, node, (response) => {
		if (response.frame < totalFrame) {
			_startScrabbleNodeText(node);
		} else {
			_stopScrabbleNodeText(node);
		}
	});
}

/* FUNCTION: INIT ---------------------------- */

function _init(){
    var loc = window.location.pathname;
    var dir = loc.substring(0, loc.lastIndexOf('/'));
    var path = "file://" + dir
	window.setTimeout(() => {
        //====================
        // Recent Followers
        //====================

        // Check the first option
        const _node1 = Node('newestFollower');
        var textFile = document.getElementById('sessionFollowersText');
        _node1.textOption = textFile.textContent.split(',').filter(function(el) {return el.length != 0});

        // Use the second option if there is nothing in the first
        if (_node1.textOption === [] || _node1.textOption.length === 0) {
            textFile = document.getElementById('newFollowerText');
            _node1.textOption = textFile.textContent.split(',').filter(function(el) {return el.length != 0});
        }

        if (_node1.textOption != null) {
            _scrabbleNodeText(_node1);
        }

        //====================
        // Recent Donation
        //====================
        const _node2 = Node('recentDonation');

        // Check the first option
        textFile = document.getElementById('sessionTopDonationsText');
        console.log(textFile.textContent);
        _node2.textOption = textFile.textContent.split(',').filter(function(el) {return el.length != 0});
        console.log(_node2.textOption);

        // Use the second option if there is nothing in the first
        if (_node2.textOption === [] || _node2.textOption.length === 0) {
            textFile = document.getElementById('allTimeTopDonationsText');
            _node2.textOption = textFile.textContent.split(',').filter(function(el) {return el.length != 0});
        }
        if (_node2.textOption != null) {
            _scrabbleNodeText(_node2);
        }

        //====================
        // Recent Cheer
        //====================

        // Check the first option
        const _node3 = Node('recentCheer');
        textFile = document.getElementById('sessionTopCheerersText');
        _node3.textOption = textFile.textContent.split(',').filter(function(el) {return el.length != 0});

        // Use the second option if there is nothing in the first
        if (_node3.textOption === [] || _node3.textOption.length === 0) {
            textFile = document.getElementById('allTimeTopCheerersText');
            _node3.textOption = textFile.textContent.split(',').filter(function(el) {return el.length != 0});
        }
        if (_node3.textOption != null) {
            _scrabbleNodeText(_node3);
        }
	}, 1000);
}

/* MODULE ======================================= */

_init();