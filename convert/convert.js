const fs = require("fs");
const cheerio = require("cheerio");
var http = require('http'),
Stream = require('stream').Transform;

const FILM_TYPES = ["科幻片","励志片","现代片","奇幻片","古装片","灾难片","冒险片","谍战片","犯罪片","战争片"];
const FILM_TAG = ["英雄","警匪","復仇","政治","怪兽","传奇","浪漫","伦理","艺术","校园","神鬼","穿越","历史","公路","飙车","机器人","末世","宫廷","枪战","太空"];
const SHOT_TYPE = ["叙事", "动作", "悬疑", "爱情", "喜剧", "恐怖", "动画", "歌舞"];
const POSITION = ["主角", "男主角", "女主角", "配角", "男配角", "女配角", "反派"];
const CHARA_TAG = ["痴情","打斗","搞笑","强壮","硬汉","高颜值","青春","天真","残酷","反派","疯狂","大亨","领导者","军人","超能力","高智商","性感","枪手","忠诚","阴谋家","学生","花花公子","警察","长者","政客","口才好","机灵","医生","赌徒","罪犯","学者","忧郁","童星","侠客","沧桑","失忆","神职人员","教师","拜金","功夫","记者","间谍","颓废","艺术家","无常识","贵族","海盗","车手","佣兵","领导","强迫症","歌手"];
const CHARA_ATTR = ["场面", "表演", "剧情", "艺术", "娱乐"];
const GENDER = ["男", "女"];
const CHARA_NATION = ["欧美", "日韩", "中国"];
const CHARA_FACTION = ["偶像派", "演技派"];
const CHARA_TYPE = ["青春型", "成熟型"];
/*
const FILM_TYPES = ["科幻片","勵志片","現代片","奇幻片","古裝片","災難片","冒險片","諜戰片","犯罪片","戰爭片"];
const FILM_TAG = ["英雄","警匪","覆仇","政治","怪獸","傳奇","浪漫","倫理","藝術","校園","神鬼","穿越","歷史","公路","飆車","機器人","末世","宮廷","槍戰","太空"];
const SHOT_TYPE = ["敘事", "動作", "懸疑", "愛情", "喜劇", "恐怖", "動畫", "歌舞"];
const POSITION = ["主角", "男主角", "女主角", "配角", "男配角", "女配角", "反派"];
const CHARA_TAG = ["癡情","打鬥","搞笑","強壯","硬漢","高顏值","青春","天真","殘酷","反派","瘋狂","大亨","領導者","軍人","超能力","高智商","性感","槍手","忠誠","陰謀家","學生","花花公子","警察","長者","政客","口才好","機靈","醫生","賭徒","罪犯","學者","憂郁","童星","俠客","滄桑","失憶","神職人員","教師","拜金","功夫","記者","間諜","頹廢","藝術家","無常識","貴族","海盜","車手","傭兵","領導","強迫癥","歌手"];
const CHARA_ATTR = ["場面", "表演", "劇情", "藝術", "娛樂"];
const GENDER = ["男", "女"];
const CHARA_NATION = ["歐美", "日韓", "華人"];
const CHARA_FACTION = ["偶像派", "演技派"];
const CHARA_TYPE = ["青春型", "成熟型"];
*/

let download_image = (name, url) => {
  if(!name || !url)
    return;
  http.request(url, function(response) {
    var data = new Stream();

    response.on('data', function(chunk) {
      data.push(chunk);
    });

    response.on('end', function() {
      fs.writeFileSync(`images/${name}.png`, data.read());
    });
  }).end();
}

let chara_tags=[];
let convertArticle = (id) => {
  let article = {};
  let content = fs.readFileSync(`./otherdata/film_html/${id}`);
  let $ = cheerio.load(content);

  let imgUrl = $("body > div:nth-child(3) > div > div.media-left > img")[0].attribs.src;
  let names = $("body > div:nth-child(3) > div > div.media-body > div > h4").text().trim().split(/[ \n]+/);
  if(names.length != 2 || names[0] == "未知")
    return null;
  article.Name = names[0];
  article.OrigName = names[1];
  article.Star = parseInt($("body > div:nth-child(3) > div > div.media-body > ul > li:nth-child(1)").text().split("：")[1]);
  article.Type = $("body > div:nth-child(3) > div > div.media-body > ul > li:nth-child(2)").text().split("：")[1];
  article.Tags = $("body > div:nth-child(3) > div > div.media-body > ul > li:nth-child(3)").text().split("：")[1].split(',');
  if(!article.Type || !article.Tags){
    return null;
  }
  article.Type = FILM_TYPES.indexOf(article.Type);
  article.Tags = article.Tags.map(o=>FILM_TAG.indexOf(o));
  //download_image(`art${id}`, imgUrl);

  article.Match = [];
  let matches = $("body > div:nth-child(3) > ul:nth-child(3)").children().toArray();
  for(let node of matches){
    let text = node.children[0].data.split('：');
    // article.Match.push({Type: text[0], Val: parseInt(text[1])});
    article.Match.push(parseInt(text[1]));
  }

  article.Characters = [];
  let characters = $("body > div:nth-child(3) > .list-group").slice(1).toArray();
  for(let node of characters){
    let attrs = []
    $(node).find(".list-group-item").each((i,o)=>{
      let text = $(o).text().trim();
      if(i==0){
        let n = text.split(/[ \n]+/);
        attrs.push(n[0]);
        attrs.push(POSITION.indexOf(n[1]) == -1 ? n[1] : POSITION.indexOf(n[1]));
      }
      else{
        let n = text.split('：');
        attrs.push(n[1]=='无' ? null : n[1]);
      }
    });
    if(attrs[2]){
      attrs[2] = attrs[2].split(',').filter(o=>!!o);
      attrs[2] = attrs[2].map(o=>CHARA_TAG.indexOf(o));
    }
    else{
      attrs[2] = [];
    }
    if(attrs[3]){
      attrs[3] = attrs[3].split(',').filter(o=>!!o);
      attrs[3] = attrs[3].map(o=>CHARA_ATTR.indexOf(o));
    }
    else{
      attrs[3] = [];
    }
    attrs[4] = attrs[4] ? GENDER.indexOf(attrs[4]) : attrs[4];
    attrs[5] = attrs[5] ? CHARA_NATION.indexOf(attrs[5]) : attrs[5];
    attrs[6] = attrs[6] ? CHARA_FACTION.indexOf(attrs[6]) : attrs[6];
    attrs[7] = attrs[7] ? CHARA_TYPE.indexOf(attrs[7]) : attrs[7];
    article.Characters.push(attrs);
  }

  //console.log(JSON.stringify(article));
  return article;
}

let convertActor = (id) => {
  let actor = {};
  let content = fs.readFileSync(`./otherdata/actor_html/${id}`);
  let $ = cheerio.load(content);

  let imgUrl = $("body > div:nth-child(3) > div > div.media-left > img")[0].attribs.src;
  let names = $("body > div:nth-child(3) > div > div.media-body > div > h4").text().trim().split(/[ \n]+/);
  if(names.length != 2 || names[0] == "未知")
    return null;
  actor.Name = names[0];
  actor.OrigName = names[1];
  actor.Star = parseInt($("body > div:nth-child(3) > div > div.media-body > ul > li:nth-child(1)").text().split("：")[1]);
  actor.FilmTypes = [];
  actor.FilmTags = [];
  let filmInfo = $("body > div:nth-child(3) > div > div.media-body > ul > li:nth-child(2)").text().split("：")[1].split(',');
  for(let info of filmInfo){
    if(!info)
      continue;
    let i = FILM_TYPES.indexOf(info);
    if(i != -1){
      actor.FilmTypes.push(i);
    }
    else{
      actor.FilmTags.push(FILM_TAG.indexOf(info));
    }
  }
  //download_image(`actor${id}`, imgUrl);
  actor.Tags = $("body > div:nth-child(3) > div > div.media-body > ul > li:nth-child(3)").text().split("：")[1].split(',').filter(o=>!!o);
  actor.Tags = actor.Tags.map(o=>CHARA_TAG.indexOf(o));
  actor.Attrs = [];
  let attrs = $("body > div:nth-child(3) > ul:nth-child(3)").children().toArray();
  for(let node of attrs){
    let text = node.children[0].data.split('：');
    if(!text[1])
      continue;
    actor.Attrs.push(CHARA_ATTR.indexOf(text[1]));
  }

  actor.Skills = [];
  let skills = $("body > div:nth-child(3) > ul:nth-child(5)").children().toArray();
  for(let node of skills){
    let text = node.children[0].data.split('：');
    actor.Skills.push(text);
  }

  return actor;
}

let articles = [];
let tags = [];
let filmtypes = [];
//let articleNames = [];
for(let i=1; i<=351; ++i){
  let article = convertArticle(i);
  //articleNames.push(article ? [article.Name, article.OrigName, article.Characters.map(o=>o[0])] : [null, null, null]);
  if(!article){
    continue;
  }
  article.key = i.toString();
  articles.push(article);
  // tags.push(...article.Tags);
  // filmtypes.push(article.Type);
}
fs.writeFileSync('articles.json', JSON.stringify(articles));
//fs.writeFileSync('article_names.json', JSON.stringify(articleNames));
// // tags = Array.from(new Set(tags));
// // filmtypes = Array.from(new Set(filmtypes));
// // console.log(JSON.stringify(tags));
// // console.log(JSON.stringify(filmtypes));
// // chara_tags = Array.from(new Set(chara_tags));
// // console.log(JSON.stringify(chara_tags));


let actors = [];
//let actorNames = [];
for(let i=1; i<=132; ++i){
  let actor = convertActor(i);
  //actorNames.push(actor ? [actor.Name, actor.OrigName] : [null, null]);
  if(!actor)
    continue;
  actor.key = i.toString();
  actors.push(actor);
}
fs.writeFileSync('actors.json', JSON.stringify(actors));
//fs.writeFileSync('actor_names.json', JSON.stringify(actorNames));