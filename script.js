class SentenSnake {
    constructor() {
        this.grid = [];
        this.gridSize = 5;
        this.selectedCells = [];
        this.targetSentence = this.generateRandomSentence();
        this.guessCount = 0;
        
        this.init();
    }
    
    generateRandomSentence() {
        const sentences = [
            "smallbirdsflyovertheocean",  // small birds fly over the ocean
            "acatsleepsunderwarmsheets",  // a cat sleeps under warm sheets
            "windblowsthroughtalltrees",  // wind blows through tall trees
            "themorningdewcoverslawns",   // the morning dew covers lawns
            "brightlightningflashesnow",  // bright lightning flashes now
            "fourpuppiesplaywithballs",   // four puppies play with balls
            "snowyflakesdanceandtwirl",   // snowy flakes dance and twirl
            "theriverflowssoVeryquick",   // the river flows so very quick
            "happychildrenlaughoudly",    // happy children laugh loudly
            "sunsrisebringshopetoalls",   // suns rise brings hope to alls
            "oldtreesstandtallandproud",  // old trees stand tall and proud
            "busybeeshumwhileworkingon",  // busy bees hum while working on
            "whiterabbitshopandjumphigh", // white rabbits hop and jump high
            "horsegallopsthroughfields",  // horse gallops through fields
            "sweetmusicplaysverysoftly",  // sweet music plays very softly
            "goldfishswimsinglassbowls",  // goldfish swims in glass bowls
            "bigstoRmscomeandquicklygo",  // big storms come and quickly go
            "fullmoonbeamsshinebrights",  // full moon beams shine brights
            "hugeoceanwavesmeetatshore",  // huge ocean waves meet at shore
            "pinkspringflowersbloomnow"   // pink spring flowers bloom now
        ];
        
        const randomIndex = Math.floor(Math.random() * sentences.length);
        return sentences[randomIndex];
    }
    
    init() {
        this.generateGrid();
        this.renderGrid();
        this.setupEventListeners();
    }
    
    generateGrid() {
        // Generate a 25-letter sentence that wanders through the grid maze-like
        const sentence = this.targetSentence;
        
        // Take exactly 25 letters
        const letters = sentence.substring(0, 25);
        
        // Initialize empty grid
        this.grid = [];
        for (let row = 0; row < this.gridSize; row++) {
            this.grid[row] = [];
            for (let col = 0; col < this.gridSize; col++) {
                this.grid[row][col] = {
                    letter: '',
                    row: row,
                    col: col,
                    selected: false,
                    revealed: false,
                    position: -1,
                    arrow: ''
                };
            }
        }
        
        // Define multiple possible continuous maze-like paths
        const paths = [
            // Original path starting top-left
            [
                [0,0], [0,1], [0,2], [0,3], [0,4],
                [1,4], [1,3], [1,2], [1,1], [1,0],
                [2,0], [3,0], [4,0], [4,1], [3,1],
                [2,1], [2,2], [3,2], [4,2], [4,3],
                [4,4], [3,4], [3,3], [2,3], [2,4]
            ],
            // Path starting bottom-right
            [
                [4,4], [4,3], [4,2], [4,1], [4,0],
                [3,0], [3,1], [3,2], [3,3], [3,4],
                [2,4], [2,3], [2,2], [2,1], [2,0],
                [1,0], [1,1], [1,2], [1,3], [1,4],
                [0,4], [0,3], [0,2], [0,1], [0,0]
            ],
            // Path starting center
            [
                [2,2], [2,1], [2,0], [1,0], [0,0],
                [0,1], [0,2], [0,3], [0,4], [1,4],
                [2,4], [3,4], [4,4], [4,3], [4,2],
                [4,1], [4,0], [3,0], [3,1], [3,2],
                [3,3], [2,3], [1,3], [1,2], [1,1]
            ],
            // Path starting top-right
            [
                [0,4], [1,4], [2,4], [3,4], [4,4],
                [4,3], [3,3], [2,3], [1,3], [0,3],
                [0,2], [1,2], [2,2], [3,2], [4,2],
                [4,1], [3,1], [2,1], [1,1], [0,1],
                [0,0], [1,0], [2,0], [3,0], [4,0]
            ],
            // Path starting bottom-left
            [
                [4,0], [3,0], [2,0], [1,0], [0,0],
                [0,1], [1,1], [2,1], [3,1], [4,1],
                [4,2], [3,2], [2,2], [1,2], [0,2],
                [0,3], [1,3], [2,3], [3,3], [4,3],
                [4,4], [3,4], [2,4], [1,4], [0,4]
            ]
        ];
        
        // Randomly select a path
        const path = paths[Math.floor(Math.random() * paths.length)];
        
        // Place letters along the path
        for (let i = 0; i < letters.length && i < path.length; i++) {
            const [row, col] = path[i];
            
            // Calculate arrow direction to next letter
            let arrow = '';
            if (i < path.length - 1) {
                const [nextRow, nextCol] = path[i + 1];
                const deltaRow = nextRow - row;
                const deltaCol = nextCol - col;
                
                if (deltaRow === -1 && deltaCol === 0) arrow = '↑';      // up
                else if (deltaRow === 1 && deltaCol === 0) arrow = '↓';  // down
                else if (deltaRow === 0 && deltaCol === -1) arrow = '←'; // left
                else if (deltaRow === 0 && deltaCol === 1) arrow = '→';  // right
                else if (deltaRow === -1 && deltaCol === -1) arrow = '↖'; // up-left
                else if (deltaRow === -1 && deltaCol === 1) arrow = '↗';  // up-right
                else if (deltaRow === 1 && deltaCol === -1) arrow = '↙';  // down-left
                else if (deltaRow === 1 && deltaCol === 1) arrow = '↘';   // down-right
            }
            
            this.grid[row][col] = {
                letter: letters[i],
                row: row,
                col: col,
                selected: false,
                revealed: false,
                position: i,
                arrow: arrow
            };
        }
    }
    
    renderGrid() {
        const gridElement = document.getElementById('letter-grid');
        gridElement.innerHTML = '';
        
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                const cell = this.grid[row][col];
                const cellElement = document.createElement('div');
                
                cellElement.className = 'letter-cell';
                cellElement.dataset.row = row;
                cellElement.dataset.col = col;
                
                // Create letter and arrow elements
                if (cell.revealed && cell.letter !== '') {
                    const letterSpan = document.createElement('span');
                    letterSpan.className = 'letter';
                    letterSpan.textContent = cell.letter;
                    cellElement.appendChild(letterSpan);
                    
                    if (cell.arrow !== '') {
                        const arrowSpan = document.createElement('span');
                        arrowSpan.className = 'arrow';
                        arrowSpan.textContent = cell.arrow;
                        cellElement.appendChild(arrowSpan);
                    }
                }
                
                // Add different styling for empty cells
                if (cell.letter === '') {
                    cellElement.classList.add('empty');
                }
                
                if (cell.selected) {
                    cellElement.classList.add('selected');
                }
                
                gridElement.appendChild(cellElement);
            }
        }
    }
    
    setupEventListeners() {
        const gridElement = document.getElementById('letter-grid');
        const guessButton = document.getElementById('guess-button');
        const guessInput = document.getElementById('guess-input');
        
        gridElement.addEventListener('click', (e) => {
            if (e.target.classList.contains('letter-cell')) {
                this.handleCellClick(e.target);
            }
        });
        
        // Touch events for mobile
        gridElement.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (e.target.classList.contains('letter-cell')) {
                this.handleCellClick(e.target);
            }
        });
        
        // Guess button click
        guessButton.addEventListener('click', () => {
            this.handleGuess();
        });
        
        // Enter key in input field
        guessInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleGuess();
            }
        });
        
        // Character counter update
        guessInput.addEventListener('input', () => {
            this.updateCharCounter();
        });
        
        // Reveal answer button
        const revealButton = document.getElementById('reveal-answer');
        revealButton.addEventListener('click', () => {
            this.revealAnswer();
        });
    }
    
    handleCellClick(cellElement) {
        const row = parseInt(cellElement.dataset.row);
        const col = parseInt(cellElement.dataset.col);
        const cell = this.grid[row][col];
        
        // Reveal the letter when clicked (if it has one)
        if (cell.letter !== '') {
            cell.revealed = true;
            
            // Increment guess count for tile click
            this.incrementGuessCount();
            
            // Reveal adjacent tiles
            this.revealAdjacentTiles(row, col);
        }
        
        // Toggle cell selection
        cell.selected = !cell.selected;
        
        if (cell.selected) {
            cellElement.classList.add('selected');
            this.selectedCells.push(cell);
        } else {
            cellElement.classList.remove('selected');
            this.selectedCells = this.selectedCells.filter(c => c !== cell);
        }
        
        // Re-render grid to show newly revealed letters
        this.renderGrid();
        
        // Log selected letters for debugging
        const selectedLetters = this.selectedCells.map(c => c.letter).join('');
        console.log('Selected:', selectedLetters);
    }
    
    revealAdjacentTiles(centerRow, centerCol) {
        // Check only 4 cardinal directions (up, down, left, right)
        const directions = [
            [-1, 0], // up
            [0, -1], // left
            [0, 1],  // right
            [1, 0]   // down
        ];
        
        directions.forEach(([dRow, dCol]) => {
            const adjRow = centerRow + dRow;
            const adjCol = centerCol + dCol;
            
            // Check if adjacent position is within grid bounds
            if (adjRow >= 0 && adjRow < this.gridSize && 
                adjCol >= 0 && adjCol < this.gridSize) {
                
                const adjCell = this.grid[adjRow][adjCol];
                // Reveal adjacent cell if it has a letter
                if (adjCell.letter !== '') {
                    adjCell.revealed = true;
                }
            }
        });
    }
    
    handleGuess() {
        const guessInput = document.getElementById('guess-input');
        const guess = guessInput.value.toLowerCase().replace(/\s/g, ''); // Remove spaces and lowercase
        const target = this.targetSentence.toLowerCase();
        
        if (guess === target) {
            // Correct guess! Reveal all tiles and show success
            this.revealAllTiles();
            this.showSuccess();
        } else {
            // Wrong guess - increment guess count
            this.incrementGuessCount();
            console.log('Wrong guess:', guess, 'vs', target);
        }
    }
    
    revealAllTiles() {
        // Reveal all tiles with letters
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                const cell = this.grid[row][col];
                if (cell.letter !== '') {
                    cell.revealed = true;
                }
            }
        }
        this.renderGrid();
    }
    
    showSuccess() {
        const successOverlay = document.getElementById('success-overlay');
        successOverlay.classList.remove('hidden');
    }
    
    updateCharCounter() {
        const guessInput = document.getElementById('guess-input');
        const charCounter = document.getElementById('char-counter');
        const currentLength = guessInput.value.length;
        charCounter.textContent = `${currentLength}/25`;
    }
    
    incrementGuessCount() {
        this.guessCount++;
        const guessCounter = document.getElementById('guess-counter');
        guessCounter.textContent = `Guesses: ${this.guessCount}`;
    }
    
    revealAnswer() {
        const answerDisplay = document.getElementById('answer-display');
        const revealButton = document.getElementById('reveal-answer');
        
        if (answerDisplay.classList.contains('hidden')) {
            // Show answer
            answerDisplay.textContent = this.targetSentence.toUpperCase();
            answerDisplay.classList.remove('hidden');
            revealButton.innerText = 'Hide Answer';
        } else {
            // Hide answer
            answerDisplay.classList.add('hidden');
            revealButton.innerText = 'Reveal Answer';
        }
    }
}

// Initialize the game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new SentenSnake();
});