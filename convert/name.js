const fs = require("fs");

const ARTICLE_NAMES = JSON.parse(fs.readFileSync(`${__dirname}/../article_names.json`));

let articles = JSON.parse(fs.readFileSync(`${__dirname}/../articles.json`));

for(let article of articles){
  let names = ARTICLE_NAMES[article.key-1];
  if(!names){
    continue;
  }
  article.Name = names[0];
  article.OrigName = names[1];
  let idx = 0;
  for(let chara of article.Characters){
    if(!names[2]){
      continue;
    }
    chara[0] = names[2][idx++];
  }
}

fs.writeFileSync(`${__dirname}/../articles.json`, JSON.stringify(articles));