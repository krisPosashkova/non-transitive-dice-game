export default class Dice {
    constructor(faces) {
        this.faces = new Uint32Array(faces);
    }

    getFaceValue(index) {
        return this.faces[index];
    }

    toString() {
        return `[${Array.from(this.faces).join(',')}]`;
    }
}