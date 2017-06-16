tokens = [
  {
    name: "date",
    re: /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/
  },
  {
    name: "expr",
    re: /^[a-zA-Z][\w_]*/
  },
  {
    name: "digits",
    re: /^\d+/
  },
  {
    name: "binOp",
    re: /^[-+*/^]/
  },
  {
    name: "lParen",
    re: /^\(/
  },
  {
    name: "lParen",
    re: /^\(/
  },
  {
    name: "whitespace",
    re: /^\s+/
  }
];

const matchSome = str => {
  tokens.some(token => {
    const match = token.re.exec(str);
    result = match ? { token: token.name, match: match[0] } : null;
    console.log(
      `   str: ${str}\n token: ${token.name}\n match: ${match && match[0]}\n`
    );
    return result;
  });
};

const reducer = (acc, char) => {
  const newStr = acc.str + char;
  const match = matchSome(newStr);
  if (!match) {
    console.log(`acc: ${acc}, str: ${str}, `);
  }
};

const tokenize = str => {
  const state = "";
  [...str].reduce(reducer);
};

const testStr = "22 + x*(4 -Y_11/var_3)";

matchSome("2017-06-14");
