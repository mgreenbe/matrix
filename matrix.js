const { print } = require("./print.js");
const { Q } = require("./rational.js");

const mult = (a, b) => {
  return (aa = Q.isRational(a)) && (bb = Q.isRational(b))
    ? aa.times(bb)
    : a * b;
};

const add = (a, b) => {
  return (aa = Q.isRational(a)) && (bb = Q.isRational(b)) ? aa.plus(bb) : a + b;
};

const pad = (n, s) => {
  return n === 0 ? s : Array(n).fill(" ").join("") + s;
};

class Matrix extends Array {
  constructor() {
    super(...arguments);
  }

  swap(i, j) {
    // swap rows i and j
    const { [i]: Ri, [j]: Rj } = this;
    return Object.assign(new Matrix(...this), { [i]: this[j], [j]: this[i] });
  }

  scale(k, i) {
    // multiply row i by k
    return Object.assign(new Matrix(...this), {
      [i]: this[i].map(A_ip => mult(k, A_ip))
    });
  }

  transvect(k, i, j) {
    // add k times row i to row j

    return Object.assign(new Matrix(...this), {
      [j]: this[i].map((A_ip, p) => add(mult(k, A_ip), this[j][p]))
    });
  }

  toString() {
    const stringed = this.map(row => row.map(x => x.toString()));
    const columnWidths = stringed
      .slice(1)
      .reduce(
        (acc, row) => acc.map((x, j) => Math.max(x, row[j].length)),
        stringed[0].map(x => x.length)
      );
    return stringed
      .map(
        row =>
          "[  " +
          row
            .map((x, j) => {
              return pad(columnWidths[j] - x.length, x);
            })
            .join("  ") +
          "  ]"
      )
      .join("\n");
  }
}

exports.Matrix = Matrix;

/*
print(
  (A = new Matrix(
    [0, 0, -2, 0, 7, 12],
    [2, 4, -10, 6, 12, 28],
    [2, 4, -5, 6, -5, -1]
  ))
);
console.log("\n");
print((B = A.swap(0, 1)));
console.log("\n");
print((C = B.scale(new Q(1, 2), 0)));
console.log("\n");
print((D = C.transvect(-2, 0, 2)));
console.log("\n");
print((E = D.scale(new Q(-1, 2), 1)));
console.log("\n");
print((F = E.transvect(-5, 1, 2)));
console.log("\n");
print((G = F.scale(2, 2)));
console.log("\n");
print(
  (H = G.transvect(new Q(7, 2), 2, 1).transvect(-6, 2, 0).transvect(5, 1, 0))
);
*/

const stringToNumber = str => {
return Q.parse(str) || Number(str);
};

const stringToMatrix = str => {
  const strArr = str.split(/\s*;\s*/).map(rowString => rowString.split(/\s+/));
  const numArr = strArr.map(row => row.map(entry => stringToNumber(entry)));
  return new Matrix(...numArr);
};

print(stringToMatrix("1.5 2; 3.0 4/3"));
print(stringToMatrix("-1/2 -0.0 3/4; -4/5 1 -999"));
