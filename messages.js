export const MESSAGES = {
    titleGame: "\n=== Nontransitive Dice Game ===\n",
    subtitleResult: "\n=== The result of the game ===\n",
    determineFirstMove: "Let's determine who makes the first move.",
    selectedValue: "I selected a random value in the range 0..5",
    tie: "\nIt's a tie!",
    exitPrompt: "\nX - exit",
    helpPrompt: "\n? - help",
    yourSelection: "Your selection: ",
    availableDice: "\nAvailable dice:",
    playerChooseDice: "\nPlease choose a dice by its index: ",
    player1Message: "I - Player 1, You - Player 2",
    player2Message: "You - Player 1, I - Player 2",
    guessSelection: "Try to guess my selection.",
    I: "I",
    you: "You",
    my: "MY",
    your: "YOUR",
    throwDescription: (name) => `\nIT's TIME FOR ${name} THROW.`,
    throwResult: (throwResult, name) => `${name} THROW IS ${throwResult}`,
    firstMove: (name) => `\n${name} makes the first move.`,
    chooseDice: (index, dice, name) => `${name} chose dice ${index}: ${dice}`,
    randomValue: (hmac) => `I selected a random value in the range 0..1 (HMAC=${hmac}).`,
    result: (computerChoice, playerChoice, result) => `Result: ${computerChoice} + ${playerChoice} = ${result} (mod 6)`,
    computerChoiceKey: (computerChoice, key) => `My selection: ${computerChoice} (KEY=${key.toString("hex").toUpperCase()})`,
    invalidChoice: (min, max) => `Please enter a number between ${min} and ${max} `,
    player1Wins: (score1, score2) => `Player 1 wins! - (${score1} > ${score2})\n`,
    player2Wins: (score1, score2) => `Player 2 wins! - (${score2} > ${score1})\n`,
    invalidKey: (key) => `Invalid key '${key}' passed to throw method.`,

    errors: {
        noArguments: "No arguments provided. Please provide at least 3 dice configurations.",
        insufficientArguments: "Please provide at least 3 dice configurations.",
        invalidCharacters: (diceNumber, config) => `Invalid dice configuration ${diceNumber} - [${config}]: Only numbers and commas are allowed. Please remove any non-numeric characters or decimals.`,
        invalidDiceLength: (diceNumber, sides) => `Dice configuration ${diceNumber} - [${sides}] contains invalid sides. Each side must have exactly 6 characters.`,
        nonIntegerValues: (diceNumber, sides) => `Dice configuration ${diceNumber} - [${sides}] contains non-integer values. Please use only whole numbers.`,
        generateSecureRandomNumber: "Parameter 'max' must be a positive integer."
    },
    usageExample: {
        title: "\n=== Dice Game Usage ===",
        subtitle: "Example: ",
        configuration: "node game.js 2,2,4,4,9,9 6,8,1,1,8,6 7,5,3,7,5,3",
        description: "\nEach set represents a dice configuration. Separate them with spaces. \n"
    }

};
