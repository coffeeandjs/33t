window.addEventListener('load', function() {
  class Player {
    constructor() {
      this.symbol = '../assets/x.png';
      this.theme = ['../assets/x.png', '../assets/o.png'];
    }

    changeTheme() {
      const themes = [
        ['../assets/x.png', '../assets/o.png'],
        ['../assets/javascript.png', '../assets/python.png'],
        ['../assets/rainbowdash.png', '../assets/twilight.png'],
        ['../assets/rdcutiemark.png', '../assets/tcutiemark.png']
      ];
      let currentThemeIndex = themes.indexOf(this.theme);

      if(currentThemeIndex === themes.length-1) {
        this.theme = themes[0];
      } else {
        this.theme = themes[currentThemeIndex+1];
      }
      this.symbol = this.theme[0];
    }

    changeSymbol() {
      let currentSymbolIndex = this.theme.indexOf(this.symbol);
      let newSymbolIndex = (currentSymbolIndex === 0) ? 1 : 0;
      this.symbol = this.theme[newSymbolIndex];
    }
  }


  // player is like a global var for the game
  var player;


  class Board {
    constructor(size) {
      this.size = size;
      this.spacesArray = [];
    }

    placeSpaces() {
      const board = document.getElementById('board');
      const rows = this.assignStyleClasses();

      rows.forEach((row, si) => {
        return board.appendChild(row);
      });
    }

    assignStyleClasses() {
      const spaces = [];

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

          const space = new Space();
          this.spacesArray.push(space);

          rowCont.appendChild(space.createSpace(htmlClass.join(' ')));
        };

        rowCont.className = 'board_row';
        spaces.push(rowCont);
      };

      return spaces;
    }

    checkForEmptySpaces() {
      const emptySpaces = this.spacesArray.filter((space) => {
        if (!space.occupied) {
          return true;
        }
      });

      if (emptySpaces.length > 0) {
        return true;
      } else {
        return false;
      }
    }
  }


  class Space {
    constructor() {
      this.occupied = false;
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
          e.target.style.background = 'no-repeat center/93% url(' + player.symbol + ')';
          player.changeSymbol();
        }
      });

      return spaceCont;
    }
  }


  const htmlBoard = document.getElementById('board');
  const clearBtn = document.createElement('div');
  const themeBtn = document.createElement('div');

  clearBtn.id = 'clear_btn'
  clearBtn.className = 'game_btn'
  clearBtn.innerText = 'Clear';
  themeBtn.id = 'theme_btn'
  themeBtn.className = 'game_btn'
  themeBtn.innerText = 'Theme';

  let createNewGame = () => {
    player = new Player();
    const newBoard = new Board(3);

    newBoard.placeSpaces();
    htmlBoard.appendChild(clearBtn);
    htmlBoard.appendChild(themeBtn);
    htmlBoard.addEventListener('click', (e) => {
      newBoard.checkForEmptySpaces();
    });
  };

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
    
  });

}, false);
