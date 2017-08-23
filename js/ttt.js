window.addEventListener('load', function() {
  // player model
  class Player {
    constructor() {
      this.symbol = '../assets/x.png';
      this.theme = ['../assets/x.png', '../assets/o.png'];
      this.prevTheme = [];
    }

    changeTheme() {
      // change board themes by calling this method
      const themes = [
        ['../assets/x.png', '../assets/o.png'],
        ['../assets/javascript.png', '../assets/python.png'],
        ['../assets/rainbowdash.png', '../assets/twilight.png'],
        ['../assets/rdcutiemark.png', '../assets/tcutiemark.png']
      ];

      let currentThemeIndex;
      let currentSymbolIndex = this.theme.indexOf(this.symbol);

      // can't compare arrays directly so will use forEach()
      // should consider if using an object is more appropriate
      // for themes than an array
      themes.forEach((theme, ti) => {
        if (theme[0] === this.theme[0]) {
          currentThemeIndex = ti;
        }
      });

      // set prev theme to current theme
      this.prevTheme = this.theme;

      // now set current theme to next theme in themes array
      if(currentThemeIndex === themes.length-1) {
        this.theme = themes[0];
      } else {
        this.theme = themes[currentThemeIndex+1];
      }

      // set current symbol to new path
      this.symbol = this.theme[currentSymbolIndex];
    }

    changeSymbol() {
      // switch symbols on each turn by calling this method
      let currentSymbolIndex = this.theme.indexOf(this.symbol);
      let newSymbolIndex = (currentSymbolIndex === 0) ? 1 : 0;
      this.symbol = this.theme[newSymbolIndex];
    }
  }


  // these are like global vars for the game
  var player;
  var newBoard;
  const htmlBoard = document.getElementById('board');
  const clearBtn = document.createElement('div');
  const themeBtn = document.createElement('div');

  clearBtn.id = 'clear_btn'
  clearBtn.className = 'game_btn'
  clearBtn.innerText = 'Clear';
  themeBtn.id = 'theme_btn'
  themeBtn.className = 'game_btn'
  themeBtn.innerText = 'Theme';


  // board model
  class Board {
    constructor(size) {
      this.size = size;
      this.spacesArray = [];
      this.finished = false;
    }

    placeSpaces() {
      const board = document.getElementById('board');
      const rows = this.assignStyleClasses();

      // for each row append it to the board container
      rows.forEach((row, si) => {
        return board.appendChild(row);
      });
    }

    assignStyleClasses() {
      const spaces = [];

      // here we check space position and add appropriate class names
      // which is for border styling
      for(let ri = 0; ri < this.size; ri++) {
        const rowCont = document.createElement('div');
        rowCont.className = 'board_row';

        for(let ci = 0; ci < this.size; ci++) {
          const htmlClass = ['board_space'];

          if (ri === 0) {
      			htmlClass.push('first_row');
      		} else if (ri === this.size - 1) {
      			htmlClass.push('last_row');
      		}

      		if (ci === 0) {
      			htmlClass.push('first_col');
      		} else if (ci === this.size - 1) {
      			htmlClass.push('last_col');
      		}

          // create the space object
          const space = new Space();
          // push it to the space array so we can easily update
          // extant space objects later
          this.spacesArray.push(space);

          // create and append space elements to row container
          rowCont.appendChild(space.createSpace(htmlClass.join(' ')));
        };

        rowCont.className = 'board_row';
        spaces.push(rowCont);
      };

      // return an array of row elements
      return spaces;
    }

    checkForEmptySpaces() {
      // filter for empty spaces
      const emptySpaces = this.spacesArray.filter((space) => {
        if (!space.occupied) {
          return true;
        }
      });

      // if there are empty spaces then simply return true
      // else update UI with game over, update board object
      // with finished = true and return false
      if (emptySpaces.length > 0) {
        return true;
      } else {
        const board = document.getElementById('board');
        const gameOver = document.createElement('div');

        // add game over indicator
        gameOver.id = 'game_over';
        gameOver.innerText = 'Game over!'
        board.appendChild(gameOver);
        // set game to finished
        this.finished = true;
        return false;
      }
    }
  }


  // space model
  class Space {
    constructor() {
      this.occupied = false;
      this.symbol = '';
      this.element = '';
    }

    createSpace(htmlClass) {
      const spaceCont = document.createElement('div');
      let self = this;
      // add class for proper border style
      spaceCont.className = htmlClass;
      // add listener for this space
      spaceCont.addEventListener('click', (e) => {
        // check if already occupied
        if(!self.occupied) {
          // update the space, style, and player turn
          self.occupied = true;
          self.symbol = player.symbol;
          e.target.style.background = 'no-repeat center/80% url(' + player.symbol + ')';
          player.changeSymbol();
        }
      });

      this.element = spaceCont;
      return spaceCont;
    }

    changeTheme() {
      this.element.style.background = 'no-repeat center/80% url(' + this.symbol + ')';
    }
  }


  // create or re-create new game
  let createNewGame = () => {
    player = new Player();
    newBoard = new Board(3);

    newBoard.placeSpaces();
    htmlBoard.appendChild(clearBtn);
    htmlBoard.appendChild(themeBtn);
    htmlBoard.addEventListener('click', (e) => {
      // quick fix so button clicks don't cause space check
      if((e.target !== clearBtn) && (e.target !== themeBtn) && !newBoard.finished) {
        newBoard.checkForEmptySpaces();
      }
    });
  };


  // call the create new game function (on page load)
  createNewGame();


  // add clear board listener and button
  clearBtn.addEventListener('click', () => {
    // clear the board container
    while (htmlBoard.firstChild) {
      htmlBoard.removeChild(htmlBoard.firstChild);
    }

    // make new board and create new player object
    createNewGame();
  });


  // add change theme listener and button
  themeBtn.addEventListener('click', () => {
    // change the theme at player level
    player.changeTheme();

    newBoard.spacesArray.forEach((space) => {
      let prevSymbol = space.symbol;
      let prevSymbolIndex = player.prevTheme.indexOf(prevSymbol);

      // update space symbol
      space.symbol = player.theme[prevSymbolIndex];

      // change the space's background only if it's occupied
      if(space.occupied) {
        space.changeTheme();
      }
    });
  });

}, false);
