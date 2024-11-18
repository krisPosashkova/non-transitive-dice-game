import Table from "cli-table3";
import chalk from "chalk";

export default class ProbabilityCalculator {
    calculateWinProbability(dice1, dice2) {
        const wins = dice1.faces.reduce((acc, face1) => 
            acc + dice2.faces.reduce((inner, face2) => 
                inner + (face1 > face2 ? 1 : 0), 0), 0);
        return wins / (dice1.faces.length * dice2.faces.length);
    }

    generateProbabilityTable(dice) {
        const table = new Table({
            head: [''].concat(dice.map((_, i) => `Dice ${i + 1}`)),
            style: {
                head: ['cyan'],
                border: ['gray']
            }
        });

        dice.forEach((dice1, i) => {
            const row = {};
            row[`Dice ${i + 1}`] = dice.map((dice2) => {
                if (dice1 === dice2) return '0.50';
                const prob = this.calculateWinProbability(dice1, dice2);
                const color = prob > 0.5 ? chalk.green : prob < 0.5 ? chalk.red : chalk.yellow;
                return color(prob.toFixed(2));
            });
            table.push(row);
        });

        return table.toString();
    }
}