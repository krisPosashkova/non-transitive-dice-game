import chalk from "chalk";
import DiceParser from "./modules/DiceParser.js";
import Game from "./modules/Game.js";
import { log } from "./utils/utils.js";
import { MESSAGES } from "./messages.js";

class App {
     getArgs() {
        const args = process.argv.slice(2);
        
        if (!args.length) {
            throw new Error(MESSAGES.errors.noArguments);
        }

        if (args.length < 3) {
            throw new Error(MESSAGES.errors.insufficientArguments);
        }

        args.forEach((arg, index) => {
            this.validateDiceConfiguration(arg, index + 1);
        });

        return args;
    }

    validateDiceConfiguration(config, diceNumber) {
        if (/[^0-9,]/.test(config)) {
            throw new Error(MESSAGES.errors.invalidCharacters(diceNumber, config));
        }

        const sides = config.split(',').map(Number);

        if (sides.length !== 6) {
            throw new Error(MESSAGES.errors.invalidDiceLength(diceNumber, sides));
        }

        if (sides.some(side => !Number.isInteger(side))) {
            throw new Error(MESSAGES.errors.nonIntegerValues(diceNumber, sides));
        }
    }

    init() {
        const args = this.getArgs();
        this.dice = DiceParser.parse(args);
        this.game = new Game(this.dice);
    }

    showUsageExample() {
        log(MESSAGES.usageExample.title, "success");
        log(MESSAGES.usageExample.subtitle, "warning");
        log(MESSAGES.usageExample.configuration, "info");
        log(MESSAGES.usageExample.description, "highlight");
    }

    run() {
        try {
            this.init();
            this.game.play();
        } catch (error) {
            console.error(chalk.red(`\nError: ${error.message}`));
            this.showUsageExample();
            process.exit(1);
        }
    }
}

new App().run();
