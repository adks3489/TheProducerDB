import React, { Component } from 'react';
import { Tag, Input, Button } from 'antd';
import { FILM_TYPES, FILM_TAG, SHOT_TYPE, CHARA_TAG, CHARA_ATTR, GENDER, CHARA_NATION, CHARA_FACTION, CHARA_TYPE } from './Types';


class ScriptInfo extends Component {
  render(){
    let {data} = this.props;
    return (
    <div>
      <img src={`images/art${data.key}.png`} style={{float:"left"}} />
      <div style={{float:"left", marginLeft: "5px"}}>
        {data.Tags.map(o=><Tag color="#108ee9" key={o}>{FILM_TAG[o]}</Tag>)}<br/>
        {data.Match.map((o,i)=><Tag color="grey" key={i}>{SHOT_TYPE[i]}:{o}</Tag>)}<br/>
        {data.Characters.map(o=>
          <div>
            {o[0]}
            {o[2]?.map(tag=><Tag color="purple" key={tag}>{CHARA_TAG[tag]}</Tag>)}
            要求：
            {o[4]!=null ? GENDER[o[4]]: ""}
            {o[5]!=null ? CHARA_NATION[o[5]]: ""}
            {o[6]!=null ? CHARA_FACTION[o[6]]: ""}
            {o[7]!=null ? CHARA_TYPE[o[7]]: ""}
          </div>)}
        {/* <Button type="primary" onClick={()=>this.props.appState.CalcMatch(data)}>計算</Button> */}
      </div>
    </div>
    );
  }
}

export default ScriptInfo;