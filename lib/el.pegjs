start
  = s:sexpr* {return {type:"Program", body:s}}

leftBracket
  = "("

rightBracket
  = ")"

identifier
  = [\uD83D][\uDC36-\uDE4F]
  / [\uD83D][\uDE80-\uDEC5]
  / [\uFE0F][\u20E3]
  / [\u2702-\u27B0]
  / [\u24C2]
  / [\uD83C][\uDC04-\uDFE2]
  / [\u20E3-\u3299]

number
  = [0-9]+

_ "whitespace"
  = [\t\v\f \n\u00A0\uFEFF]*

sexpr
  = a:atom { return a; }
  / list

list
  = leftBracket _ head:sexpr
    tail:(_ sexpr)* _ rightBracket _ {
      var result = [head];
      for (var i = 0; i < tail.length; i++) {
        result.push(tail[i][1]);
      }
      return {type: 'List', contents:result};
    }

atom
  = d:number _ { return {type: 'Literal', value: parseInt(d.join(""), 10)}}
  / '"' d:(!'"' [a-z])* '"' _ { return {type: 'Literal', value: d }}
  / s:identifier _ { return {type: 'Identifier', name: s[0]?s.join(""):s}}