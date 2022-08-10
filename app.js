// Create Game Board 
// Get board div
const boardDiv = document.getElementById("board");
// create cells on board
for (let i = 0; i < 9; i++) {
  // create a single cell
  const cell = document.createElement("div");
  cell.classList.add("game-cell")
  cell.setAttribute("data-value", i);
  // Append the created cell to body:
  boardDiv.appendChild(cell);
}

// array of arrayw whic are winning combination of cells according to "data-value",  i.e - "positions" 
const winningPositions = [
  // Winning sequences on  Diagonals
  ['0', '4', '8'],
  ['2', '4', '6'],

  //Winning sequences on Rows
  ['0', '1', '2'],
  ['3', '4', '5'],
  ['6', '7', '8'],

  //Winning sequences on Columns
  ['0', '3', '6'],
  ['1', '4', '7'],
  ['2', '5', '8'],

]

// creating bootstrap modal for desplaying win/lose/draw massage
const bootstrapModal = document.getElementById("bootstrapModal");
const theModal = document.createElement("span");
theModal.innerHTML = `
<!-- making a game over modal -->
<div class="container">

<!-- The Modal -->
<div class="modal" id="myModal">
  <div class="modal-dialog">
  <div class="modal-content">
  
  <!-- Modal Header -->
  <div class="modal-header">
  <h4 class="modal-title" id="modal-title"> <span></span>
  </h4>
  
  </div>
  
  <!-- Modal body -->
  <div class="modal-body" id="modal-body">
  Please press "Next Round" button to play another round,
  <br><br>
  Clicking outside this window returns you to current game
  </div>
  
  <!-- Modal footer -->
  <div class="modal-header" id="modal-footer">
  <button type="button" class="restart btn btn-danger" data-dismiss="modal">Next Round</button>
  </div>
  
  </div>
  </div>
  </div>
  
  </div>
  `
bootstrapModal.appendChild(theModal)

// creating the winning table
const scoreTable = document.createElement("span");
scoreTable.innerHTML = ` 
<table class="table disabled" id="resultTable">
<h6><u>Total Score</u></h6>
<thead>
  <tr>
    <th scope="col">X</th>
    <th scope="col">O</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td id="xResult"></td>
    <td id = "oResult"></td>
  </tr>
</tbody>
</table>
  `
document.body.appendChild(scoreTable)


//creatting "gameState" object with all necessary properties to mange the game
const gameState = {
  xTurn: true,
  xState: [],
  oState: [],
  xWinsCount: 0,
  oWinsCount: 0,
}

// setting the scores on DOM
const xResult = document.getElementById("xResult");
const oResult = document.getElementById("oResult");
xResult.innerText = gameState.xWinsCount;
oResult.innerText = gameState.oWinsCount;


// creating a restart option to the game
document.querySelector('.restart').addEventListener('click', () => {
  restartGame()
})

function restartGame() {
  document.querySelectorAll('.game-cell').forEach(cell => {
    cell.classList.remove('disabled', 'x', 'o')
  })
  gameState.xTurn = true
  gameState.xState = []
  gameState.oState = []
  $("#myModal").modal("toggle");
}


// the main game eventlistner
document.addEventListener('click', event => {
  const target = event.target
  console.log(target)
  //checking if we clicked on a game cell
  const isCell = target.classList.contains('game-cell')
  // checks if the cell was already clicked 
  const isDisabled = target.classList.contains('disabled')

  if (isCell && !isDisabled) {
    // getting the cell's value (number)
    const cellValue = target.dataset.value
    // updating the current player's array of choices
    gameState.xTurn === true ? gameState.xState.push(cellValue) : gameState.oState.push(cellValue)
    //disabling the cell that was clicked by adding a "disables" class
    target.classList.add('disabled')
    //adding the currend cell a class according to the player in turn , and actually updating the content via the css of that class
    target.classList.add(gameState.xTurn ? 'x' : 'o')
    // switching turns
    gameState.xTurn = !gameState.xTurn
    // check for winning positions

    winningPositions.forEach(winningState => {
      const xWins = winningState.every(state => gameState.xState.includes(state))
      const oWins = winningState.every(state => gameState.oState.includes(state))
      if (xWins || oWins) {
        xWins ? gameState.xWinsCount++ : gameState.oWinsCount++;
        console.log("xWinsCount", gameState.xWinsCount, "oWinsCount", gameState.oWinsCount);
        xResult.innerText = gameState.xWinsCount;
        oResult.innerText = gameState.oWinsCount;
        document.querySelectorAll('.game-cell').forEach(cell => cell.classList.add('disabled'))
        //updating content of, and popping modal
        $('#myModal').on('show.bs.modal	', function (e) {
          document.getElementById("modal-title").innerText = xWins ? 'X wins!' : 'O wins!'
        })
        $("#myModal").modal("toggle");
      }
    })

    // If all cells are disabled, then its draw
    if (!document.querySelectorAll('.game-cell:not(.disabled)').length) {
      //updating content of, and popping modal
      // console.log("draw")
      $('#myModal').on('show.bs.modal	', function (e) {
        document.getElementById("modal-title").innerText = 'Draw!'
      })
      $("#myModal").modal("show");
    }

  }
})

