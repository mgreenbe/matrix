const gcd = (a, b) => (b ? gcd(b, a % b) : a);

class Q {
  constructor(a, b = 1) {
    if (Number.isInteger(a)) {
      if (b !== 0) {
        const g = Math.abs(gcd(a, b));
        const s = Math.sign(b);
        this.numerator = a === 0 ? 0 : s * a / g; // never give -0 as numerator
        this.denominator = s * b / g;
      } else {
        throw new RangeError("Denominator (second argument) must be nonzero.");
      }
    } else {
      throw new TypeError("Argument(s) must be integers.");
    }
  }

  static parse(str) {
    let match;
    const integerRe = /^\s*(\-?)\s*(\d+)\s*$/;
    const rationalRe = /^\s*(\-?)\s*(\d+)\s*\/\s*(\d+)\s*$/;
    if ((match = integerRe.exec(str))) {
      return new Q(match[1] ? -parseInt(match[2]) : parseInt(match[2]));
    } else if ((match = rationalRe.exec(str))) {
      const a = match[1] ? -parseInt(match[2]) : parseInt(match[2]);
      const b = match[3];
      return new Q(a, b);
    } else {
      return undefined;
    }
  }

  static isRational(x) {
    if (x && Object.getPrototypeOf(x) === Q.prototype) {
      return x;
    } else if (Number.isInteger(x)) {
      return new Q(x);
    } else {
      return false;
    }
  }

  isZero() {
    return this.numerator === 0;
  }

  isInteger() {
    return this.denominator === 1;
  }

  number() {
    return this.numerator / this.denominator;
  }

  neg() {
    const { numerator: a, denominator: b } = this;
    return new Q(-a, b);
  }

  inverse() {
    const { numerator: a, denominator: b } = this;
    return this.isZero() ? undefined : new Q(b, a);
  }

  binary(q, f) {
    const { numerator: c, denominator: d } = Q.isRational(q);
    const { numerator: a, denominator: b } = this;
    return d ? f(a, b, c, d) : undefined;
  }

  equals(q) {
    return this.binary(q, (a, b, c, d) => a === c && b === d);
  }

  _plus(q) {
    return this.binary(q, (a, b, c, d) => new Q(a * d + b * c, b * d));
  }

  plus(x) {
    let y = Q.isRational(x);
    if (y) {
      return this._plus(y);
    } else if (typeof x === "number") {
      return this.number() + x;
    } else {
      return NaN;
    }
  }

  times(q) {
    return this.binary(q, (a, b, c, d) => new Q(a * c, b * d));
  }

  minus(q) {
    return this.plus(q.neg());
  }
  div(q) {
    return this.times(q.inverse());
  }

  toString() {
    const { numerator: a, denominator: b } = this;
    return b === 1 ? a.toString() : `${a}/${b}`;
  }

  latex(detail = "frac") {
    const { numerator: a, denominator: b } = this;
    return b === 1
      ? a
      : detail === "folded" ? this.toString() : `\\${detail}{${a}}{${b}}`;
  }
}

exports.Q = Q;

let q = new Q(1, 2);
console.log(q.plus(3.14));
