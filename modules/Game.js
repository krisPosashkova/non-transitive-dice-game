import CryptoManager from "./CryptoManager.js";
import ProbabilityCalculator from "./ProbabilityCalculator.js";
import readline from "readline-sync";
import { log } from "../utils/utils.js";
import { MESSAGES } from "../messages.js";

export default class Game {
    constructor(dice) {
        this.dice = dice;
        this.cryptoManager = new CryptoManager();
        this.players = [
            {
                name: MESSAGES.I,
                message: MESSAGES.player1Message,
                selected: this.selectedComputerDice.bind(this),
                throw: this.throwComputer.bind(this)
            },
            {
                name: MESSAGES.you,
                message: MESSAGES.player2Message,
                selected: this.selectedPlayerDice.bind(this),
                throw: this.throwPlayer.bind(this)
            },
        ];
    }

    play() {
        log(MESSAGES.titleGame, "info");

        const firstMove = this.determineFirstMove();
        if (firstMove === null) return;

        if (!firstMove) {
            [this.players[0], this.players[1]] = [ this.players[1], this.players[0] ];
        }

        log(MESSAGES.firstMove(this.players[0].name), "warning");
        log(`\n${this.players[0].message}`, "success");

        const scores = this.playRound();
        if (!scores) return;

        this.determineWinner(scores.firstThrow, scores.secondThrow);
    }

    playRound() {
        const [firstPlayer, secondPlayer] = this.players;

        const diceResult = this.processSelectedDice(firstPlayer, secondPlayer);
        if (!diceResult) return null;

        const { firstDice, secondDice } = diceResult;

        const firstThrow = firstPlayer.throw(firstDice);
        const secondThrow = secondPlayer.throw(secondDice);

        return { firstThrow, secondThrow };
    }

    processSelectedDice(firstPlayer, secondPlayer){
        const firstSelectedDice = firstPlayer.selected();
        if (firstSelectedDice === null) return null;

        const secondSelectedDice = secondPlayer.selected();
        if (secondSelectedDice === null) return null;

        return { 
            firstDice: firstSelectedDice.dice, 
            secondDice: secondSelectedDice.dice
        }
    }

    processPlayerTurn(player) {
        const selected = player.selected();
        if (!selected) return null;
        return player.throw(selected.dice);
    }    

    getUserChoice(options, promptMessage, validRange) {
        while (true) {
            log(options);
            const choice = readline.question(promptMessage).toLowerCase();
    
            if (choice === "x") return null;
            if (choice === "?") {
                this.showHelp();
                continue;
            }
    
            const parsedChoice = parseInt(choice);
            if (!this.isValidChoice(parsedChoice, validRange)) {
                log(MESSAGES.invalidChoice(validRange[0], validRange[1]), "error");
                continue;
            }
    
            return parsedChoice;
        }
    }
    
    isValidChoice(choice, range) {
        return !isNaN(choice) && choice >= range[0] && choice <= range[1];
    }

    getThrowResult({ computerChoice, playerChoice, selectedDice }) {
        const result = (computerChoice + playerChoice) % 6;
        const throwResult = selectedDice.getFaceValue(result);
        log(MESSAGES.result(computerChoice, playerChoice, result));

        return throwResult;
    }

    showList(title, items) {
        log(`\n${title}`);
        items.forEach((item, i) => {
            log(`${i} - ${item}`);
        });
    }

    determineFirstMove() {
        const { key, computerChoice, hmac } = this.cryptoManager.generateCryptoBundle({
            range: 2,
        });

        log(MESSAGES.determineFirstMove, "info");
        log( MESSAGES.randomValue(hmac));
        log(MESSAGES.guessSelection);

        const playerChoice = this.getUserChoice(
            `\n0 - 0\n1 - 1${MESSAGES.exitPrompt}${MESSAGES.helpPrompt}`,
            MESSAGES.yourSelection,
            [0, 1]
        );
        if (playerChoice === null) return null;

        log(MESSAGES.computerChoiceKey(computerChoice, key));

        return (computerChoice + playerChoice) % 2 === 1;
    }

    determineWinner(score1, score2) {
        log(MESSAGES.subtitleResult, "info");
        if (score1 > score2) {
            log(MESSAGES.player1Wins(score1, score2), "success");
        } else if (score2 > score1) {
            log(MESSAGES.player2Wins(score1, score2), "success");
        } else {
            log(MESSAGES.tie, "warning");
        }
    }

    selectedComputerDice() {
        const { computerChoice: selectedComputerDiceIndex } = this.chooseComputerDice({range: this.dice.length});
        const selectedComputerDice = this.dice[selectedComputerDiceIndex];

        if (selectedComputerDice === null) return null;

        log(MESSAGES.chooseDice(selectedComputerDiceIndex, selectedComputerDice, "I"));

        return {
            index: selectedComputerDiceIndex,
            dice: selectedComputerDice,
        }
    }

    selectedPlayerDice() {
        this.showList(MESSAGES.availableDice, this.dice);

        const selectedPlayerDiceIndex = this.getUserChoice(
            `${MESSAGES.exitPrompt}${MESSAGES.helpPrompt}`,
            MESSAGES.playerChooseDice,
            [0, this.dice.length - 1]
        );
        if (selectedPlayerDiceIndex === null) return null;

        const selectedPlayerDice = this.dice[selectedPlayerDiceIndex];

        log(MESSAGES.chooseDice(selectedPlayerDiceIndex, selectedPlayerDice, "You"));

        return {
            index: selectedPlayerDiceIndex,
            dice: selectedPlayerDice
        }
    }

    throw(key, selectedDice) {
        if(!selectedDice) return null;

        const data = {
            computer:{
                name: MESSAGES.my,
            },
            user: {
                name: MESSAGES.your,
            }
        }

        if (!data[key]) {
            throw new Error(MESSAGES.invalidKey(key));
        }

        const info = data[key];

        log(MESSAGES.throwDescription(info.name));
        
        const {  key: throwComputerKey, computerChoice: throwComputerChoice } = this.chooseComputerDice({message: MESSAGES.selectedValue, range: 6});
        const throwPlayerChoice = this.getUserChoice(
            "",
            MESSAGES.invalidChoice(0, 5)+": ",
            [0, 5]
        );
        if (throwPlayerChoice === null) return null;

        log(`${MESSAGES.yourSelection} ${throwPlayerChoice}`);
        log(MESSAGES.computerChoiceKey(throwComputerChoice, throwComputerKey));

        const throwResult = this.getThrowResult({ computerChoice: throwComputerChoice, playerChoice: throwPlayerChoice, selectedDice });
        log(MESSAGES.throwResult(throwResult, info.name), "warning");

        return throwResult; 

    }
    throwComputer(selectedComputerDice) {
        return this.throw("computer", selectedComputerDice);
    }

    throwPlayer(selectedPlayerDice) {
        return this.throw("user", selectedPlayerDice);
    }

    chooseComputerDice({message, range}) {
        const { key, computerChoice, hmac } = this.cryptoManager.generateCryptoBundle({
            range,
        });
    
        if(message) log(`${message} (HMAC=${hmac})...`);
        return {key, computerChoice, hmac};
    }

    showHelp() {
        log("\n=== Win Probabilities ===\n", "info");
        const calculator = new ProbabilityCalculator();
        log(calculator.generateProbabilityTable(this.dice));
    }
};
