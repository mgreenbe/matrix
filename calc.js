const { RegExpTree } = require("./regexp-tree-runtime");

const tokens = [
  {
    type: "D",
    re: /\d+/,
    value: x => parseInt(x)
  },
  {
    type: "P",
    re: /\+/
  },
  {
    type: "M",
    re: /-/
  },
  {
    type: "T",
    re: /\*/
  },
  {
    type: "O",
    re: /\//
  },

  {
    type: "L",
    re: /\(/
  },
  {
    type: "R",
    re: /\)/
  },
  {
    re: /\s+/,
    ignore: true
  }
];

const RE = new RegExp(
  tokens.map(token => `(${token.re.source})`).join("|"),
  "gy"
);

const identity = x => x;

const tokenize = str => {
  const RE = new RegExp(
    tokens.map(token => `(${token.re.source})`).join("|"),
    "gy"
  );
  const ans = [];
  const tokenized = [];
  let match;
  do {
    match = RE.exec(str);
    if (!match) {
      return undefined;
    }
    const string = match[0];
    const group = match.slice(1).findIndex(identity);
    const { ignore, type, value } = tokens[group];
    if (!tokens[group].ignore) {
      ans.push({ type, string, value: (value || identity)(string) });
    }
  } while (match && RE.lastIndex !== str.length);
  return ans;
};

const multiply = tokens => {
  let tokenString, re, match, product;
  tokenString = tokens.map(({ type }) => type).join("");
  while ((match = /[DN](?:T[DN])+/.exec(tokenString))) {
    product = tokens
      .slice(match.index, match.index + match[0].length)
      .map(t => t.value)
      .filter(x => typeof x === "number")
      .reduce((acc, cur) => acc * cur);
    tokens.splice(match.index, match[0].length, { type: "N", value: product });
    tokenString = tokens.map(({ type }) => type).join("");
  }
  return tokens;
};

const negate = tokens => {
  let tokenString, match, value;
  tokenString = tokens.map(({ type }) => type).join("");
  while ((match = /(^M|[LR]M)D/.exec(tokenString))) {
    value = -tokens[match.index + match[1].length].value;
    console.log(match)
    tokens.splice(match.index, 2, { type: "N", value });
    tokenString = tokens.map(({ type }) => type).join("");
  }
  return tokens;
};

let str = "-6 - 2*3 + 4*(-5)";
let toks = tokenize(str);
toks = multiply(toks);
console.log(toks);
toks = negate(toks);
console.log(toks);
toks = multiply(toks);
console.log(toks);