import { Helper } from "./JSModules/helper.js"

const g_Helper = new Helper()

var rpsDatabase =
{
    'Rock':
    {
        'scissors' : 1,
        'rock': 0.5,
        'paper': 0
    },

    'Paper':
    {
        'rock' : 1,
        'paper': 0.5,
        'scissors': 0
    },

    'Scissors':
    {
        'paper' : 1,
        'scissors': 0.5,
        'rock': 0
    }
};

var scores =
{
    user: 0,

    computer: 0,

    tie: 0,

    roundCount: 1,

    increaseUserScore: function()
    {
        this.user++
    },

    increaseComputerScore: function()
    {
        this.computer++
    },

    increaseTieScore: function()
    {
        this.tie++
    },

    increaseRoundCount: function()
    {
        this.roundCount++
    }
}

var computerMoves = ['rock', 'paper', 'scissors'];
var computerMove, userMove, clickedButton, userWin;

/**
 * Disables the user buttons
 */
function disableUserButtons()
{
    const userButtons = document.querySelectorAll("#user button")

	if (!userButtons) return

    for(const btn of userButtons)
        btn.disabled = true;
}

/**
 * Removes the outline on the button corresponding to the user-selected option
 * Enables all the user buttons for next round
 */
function enableUserButtons()
{
	if (!clickedButton) return

    clickedButton.classList.remove("selected")

    const userButtons = document.querySelectorAll("#user button")

	if (!userButtons) return

    for(const btn of userButtons)
        btn.disabled = false;
}

/**
 * Randomly generates the computer option and adds an outline around the corresponding button
 */
function setComputerMove()
{
    computerMove = Math.floor(3 * Math.random());

    const btn = document.getElementById(String(computerMove))

	if (!btn) return

    btn.classList.add("selected")
}

/**
 *	Removes the outline on the button corresponding to the computer-selected option
 */
function resetComputerButtons()
{
    const btn = document.getElementById(String(computerMove))

	if (!btn) return

    btn.classList.remove("selected")
}

/**
 * Determines which option the user chose and outlines the clicked button
 * @param {*} event
 */
function setUserMove(event)
{
	clickedButton = event.target

	userMove = clickedButton.innerHTML

	clickedButton.classList.add("selected")
}

/**
 *	Runs every time the user chooses an option
 *	@param {*} event
 */
const executeRound = (event) =>
{
	if (!event || !event.target) return

	setUserMove(event)

	disableUserButtons() // disable all the user buttons to prevent user from choosing
	setComputerMove()

	checkWin()
	updateScoreBoard()

	setTimeout(enableUserButtons, 500)
	setTimeout(resetComputerButtons, 500)
}

/**
 *	Updates the scores on the scoreboard
 */
function updateScoreBoard()
{
	const userPara = document.getElementsByTagName('p')[0];
	userPara.innerHTML = "You - " + scores.user

	const computerPara = document.getElementsByTagName('p')[1]
	computerPara.innerHTML = "Computer - " + scores.computer

	const tiePara = document.getElementsByTagName('p')[2]
	tiePara.innerHTML = `Tie - ${scores.tie}`
}

/**
*	Updates the text in the System textarea for each round
*	@param {int} value corresponding value of user's choice to computer's choice in the database
*/
function updateSystem(value)
{
	const textarea = document.querySelector("#system_text")

	if (!textarea) return

	let text = "Round: " + scores.roundCount + "\nYou - " + userMove.toLowerCase() + "\nComputer - " + computerMoves[computerMove].toLowerCase()

	textarea.value += text;

	//user wins
	if(value == 1)
		textarea.value += "\nYOU WIN!\n\n"
	//tie
	else if(value == 0.5)
		textarea.value += "\nYOU TIE!\n\n"
	//user loses
	else
		textarea.value += "\nYOU LOSE!\n\n"

	textarea.value += "-------------------------------\n";

	scores.increaseRoundCount()

	//automatically scroll down when textarea filled
	textarea.scrollTop = textarea.scrollHeight
}

/**
 *	Increments winner's score or the tie score
 */
function checkWin()
{
	const value = rpsDatabase[userMove][computerMoves[computerMove]]

	//user wins
	if(value == 1)
	{
		scores.increaseUserScore()
		updateSystem(value)
	}

	//tie
	else if(value == 0.5)
	{
		scores.increaseTieScore()
		updateSystem(value)
	}

	//user loses
	else
	{
		scores.increaseComputerScore()
		updateSystem(value)
	}
}

//-------------------------------------------------------------
g_Helper.hookEvent(window, "load", false, () =>
{
	// disabling computer buttons
	const computerButtons = document.querySelectorAll("#computer button")

	if (!computerButtons) return

	for (const btn of computerButtons)
		btn.disabled = true


	// setting onclick for user buttons
	const userButtons = document.querySelectorAll("#user button")

	if (!userButtons) return

	for (const btn of userButtons)
		btn.onclick = executeRound
})
