const { RegExpTree } = require("./regexp-tree-runtime");

tokens = [
  {
    type: "e",
    re: /[a-zA-Z][\w_]*/
  },
  {
    type: "d",
    re: /\d+/,
    value: x => parseInt(x)
  },
  {
    type: "p",
    re: /\+/
  },
  {
    type: "m",
    re: /-/
  },
  {
    type: "t",
    re: /\*/
  },
{
    type: "o",
    re: /\//
  },

  {
    type: "l",
    re: /\(/
  },
  {
    type: "r",
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

let str = "2*(x + 3*y) - 4*z";
console.log(tokenize(str));
