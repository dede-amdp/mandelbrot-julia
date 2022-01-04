class Complex {
    constructor(real, imag) {
        this.r = real; // real part
        this.i = imag; // imaginary part
    }

    add(other) {
        // just add the real parts and the imaginary parts
        return new Complex(this.r + other.r, this.i + other.i)
    }

    mult(other) {
        // (a+bi)*(c+di) = a*c + a*di + c*bi - b*d
        return new Complex((this.r * other.r) - (this.i * other.i),
            (this.r * other.i) + (this.i * other.r));
    }

    modulo() {
        return Math.sqrt(this.r * this.r + this.i * this.i);
    }

    pow(e) {
        let toReturn = new Complex(this.r, this.i);
        let value = new Complex(this.r, this.i);
        for (let _ = 0; _ < e - 1; _++) {
            toReturn = toReturn.mult(value);
        }
        return toReturn;
    }

    toString() {
        return `${this.r}+${this.i}i`;
    }

}


// made by @dede.artbit (on instagram) 20220103
