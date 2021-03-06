import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Select, Tag, Row, Col, Badge } from 'antd';
import { FILM_TYPES, FILM_TAG, SHOT_TYPE, POSITION, CHARA_TAG, CHARA_ATTR, GENDER, CHARA_NATION, CHARA_FACTION, CHARA_TYPE } from './Types';

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
             (chara[5] != null && actor.Nation != null && chara[5] != actor.Nation) ||
             (chara[6] != null && actor.Faction != null && chara[6] != actor.Faction) ||
             (chara[7] != null && actor.Type != null && chara[7] != actor.Type) ){
            ++idx;
            continue;
          }
          let result = {ScriptType: false, ScriptTag: [], CharaTag: []};
          result.ScriptType = actor.FilmTypes.includes(article.Type);
          result.ScriptTag = article.Tags.filter(tag=>actor.FilmTags.includes(tag));
          result.CharaTag = chara[2].filter(tag=>actor.Tags.includes(tag));
          let score = (result.ScriptType? 1 : 0) + result.ScriptTag.length + result.CharaTag.length;
          charaResult[idx++].push({Actor: actor, Result: result, Score: score});
        }
      }

      for(let chara of charaResult){
        chara.sort((a,b)=>(b.Score-a.Score));
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

                  <Tag color="#108ee9">{FILM_TYPES[article.Type]}</Tag>
                  {article.Tags.map(o=><Tag color="#108ee9" key={o}>{FILM_TAG[o]}</Tag>)}<br/>
                  {article.Match.map((o,i)=><Tag color="grey" key={i}>{SHOT_TYPE[i]}:{o}</Tag>)}<br/>

              </Row>
              <Row gutter={5}>
                {article.Characters.map((o,i)=>(
                <Col key={i} span={6} xs={12} md={8} lg={6} style={{border:"solid 1px"}}>
                  <b>{o[0]} </b>{o[1]!=null ? POSITION[o[1]]: ""}<br/>
                  {o[2]?.map(tag=><Tag color="purple" key={tag}>{CHARA_TAG[tag]}</Tag>)}<br/>
                  ?????????
                  {o[4]!=null ? GENDER[o[4]]: ""}
                  {o[5]!=null ? CHARA_NATION[o[5]]: ""}
                  {o[6]!=null ? CHARA_FACTION[o[6]]: ""}
                  {o[7]!=null ? CHARA_TYPE[o[7]]: ""}
                  {charaResult[i].map((result, i)=>(
                    <div key={i} style={{marginTop:"10px", display:"flex", flexDirection:"row", alignItems:"center"}}>
                      <div style={{flex:"1"}}>
                        <b>{result.Actor.Name}</b>
                        <img src={`images/actor${result.Actor.key}.jpg`} style={{float:"left", height:"75px"}} />
                        <Badge style={{ backgroundColor: '#52c41a' }} count={result.Result.ScriptTag.length+(result.Result.ScriptType?1:0)}/>
                        <Badge style={{ backgroundColor: '#52c41a' }} count={result.Result.CharaTag.length}/><br/>
                        ??????: {result.Result.ScriptType ? "??????" : "??????"}<br/>
                        {result.Result.ScriptTag.map(o=><Tag color="#108ee9" key={o}>{FILM_TAG[o]}</Tag>)}<br/>
                        {result.Result.CharaTag.map(o=><Tag color="purple" key={o}>{CHARA_TAG[o]}</Tag>)}
                      </div>
                    </div>
                  ))}
                </Col>))}
              </Row>
            </div>
          ): "???????????????"
        }
      </div>
    );
  }
}
export default CalcPage;