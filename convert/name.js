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


const ACTOR_NAMES = JSON.parse(fs.readFileSync(`${__dirname}/../actor_names.json`));

let actors = JSON.parse(fs.readFileSync(`${__dirname}/../actors.json`));
for(let actor of actors){
  let names = ACTOR_NAMES[actor.key-1];
  if(!names){
    continue;
  }
  actor.Name = names[0];
  actor.OrigName = names[1];
  actor.Skills = names[2];
}
fs.writeFileSync(`${__dirname}/../actors.json`, JSON.stringify(actors));