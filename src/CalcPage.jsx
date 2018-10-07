import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Select, Tag, Row, Col, Badge } from 'antd';
import { FILM_TYPES, FILM_TAG, SHOT_TYPE, CHARA_TAG, CHARA_ATTR, GENDER, CHARA_NATION, CHARA_FACTION, CHARA_TYPE } from './Types';

@inject('appState')
@observer
class CalcPage extends Component {
  render() {
    let {appState} = this.props;
    let article = appState.CalcArticle;
    let charaResult = [];
    if(article != null){
      charaResult = article.Characters.map(o=>[]);
      for(let key of appState.OwnedActors){
        let actor = appState.Actors.find(o=>o.key == key);
        if(!actor)
          continue;
        let idx = 0;
        for( let chara of article.Characters){
          if((chara[4] != null && actor.Gender != null && chara[4] != actor.Gender) ||
             (chara[5] != null && actor.Nation != null && chara[5] != actor.Nation) ){
            ++idx;
            continue;
          }
          let result = {ScriptType: false, ScriptTag: [], CharaTag: []};
          result.ScriptType = actor.FilmTypes.includes(article.Type);
          result.ScriptTag = article.Tags.filter(tag=>actor.FilmTags.includes(tag));
          result.CharaTag = chara[2].filter(tag=>actor.Tags.includes(tag));
          charaResult[idx++].push({Actor: actor, Result: result});
        }
      }
    }

    return (
      <div style={{...this.props.style, overflowY:"auto"}}>>
        <Select showSearch>
        </Select><br/>
        {
          article != null ? (
            <div>
              <Row>
                <img src={`images/art${article.key}.png`} style={{float:"left"}} />
                <div style={{float:"left", marginLeft: "5px"}}>
                  <Tag color="#108ee9">{FILM_TYPES[article.Type]}</Tag>
                  {article.Tags.map(o=><Tag color="#108ee9" key={o}>{FILM_TAG[o]}</Tag>)}<br/>
                  {article.Match.map((o,i)=><Tag color="grey" key={i}>{SHOT_TYPE[i]}:{o}</Tag>)}<br/>
                </div>
              </Row>
              <Row gutter={5}>
                {article.Characters.map((o,i)=>(
                <Col key={i} span={4} style={{border:"solid 1px"}}>
                  {o[0]}<br/>
                  {o[2]?.map(tag=><Tag color="purple" key={tag}>{CHARA_TAG[tag]}</Tag>)}<br/>
                  要求：
                  {o[4]!=null ? GENDER[o[4]]: ""}
                  {o[5]!=null ? CHARA_NATION[o[5]]: ""}
                  {o[6]!=null ? CHARA_FACTION[o[6]]: ""}
                  {o[7]!=null ? CHARA_TYPE[o[7]]: ""}
                  {charaResult[i].map((result, i)=>(
                    <div key={i} style={{marginTop:"10px", display:"flex", flexDirection:"row", alignItems:"center"}}>
                      <img src={`images/actor${result.Actor.key}.jpg`} style={{float:"left", height:"75px"}} />
                      <div style={{flex:"1", float:"left", marginLeft: "5px"}}>
                        <b>{result.Actor.Name}</b>
                        <Badge style={{ backgroundColor: '#52c41a' }} count={result.Result.ScriptTag.length+(result.Result.ScriptType?1:0)}/>
                        <Badge style={{ backgroundColor: '#52c41a' }} count={result.Result.CharaTag.length}/><br/>
                        片型: {result.Result.ScriptType ? "符合" : "不符合"}<br/>
                        劇本: {result.Result.ScriptTag.map(o=><Tag color="#108ee9" key={o}>{FILM_TAG[o]}</Tag>)}<br/>
                        角色: {result.Result.CharaTag.map(o=><Tag color="purple" key={o}>{CHARA_TAG[o]}</Tag>)}
                      </div>
                    </div>
                  ))}
                </Col>))}
              </Row>
            </div>
          ): "未選擇電影"
        }
      </div>
    );
  }
}
export default CalcPage;