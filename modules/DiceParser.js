import chalk from "chalk";
import Dice from "./Dice.js";

export default class DiceParser {
    static parse(args) {
        if (args.length < 3) {
            throw new Error(chalk.red('At least 3 dice configurations are required.'));
        }

        return args.map((arg, index) => {
            const faces = arg.split(',').map(num => {
                const face = parseInt(num, 10);
                if (!Number.isInteger(face) || face < 0) {
                    throw new Error(chalk.red(
                        `Dice ${index + 1} contains invalid value: ${num}. Must be positive integer.`
                    ));
                }
                return face;
            });

            if (faces.length !== 6) {
                throw new Error(chalk.red(
                    `Dice ${index + 1} must have exactly 6 faces.`
                ));
            }

            return new Dice(faces);
        });
    }
}