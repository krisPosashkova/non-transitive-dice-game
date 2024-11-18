import chalk from "chalk";

export function log(message, color = null) {
    const colors = {
        success: "green",
        error: "red",
        warning: "yellow",
        info: "blue",
        highlight: "magenta",
        default: "white",
    };

    const chalkColor = colors[color] || colors.default;
    console.log(chalk[chalkColor]?.(message) || message);
}
