import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Table, Tag, Input, Switch, Icon } from 'antd';
import { FILM_TYPES, FILM_TAG, SHOT_TYPE, CHARA_TAG, CHARA_ATTR, GENDER, CHARA_NATION, CHARA_FACTION, CHARA_TYPE } from './Types';

@inject('appState')
@observer
class ActorList extends Component {
  constructor(props){
    super(props);
  }

  expandedRowRender = (record) => {
    return (
    <div>
      <img src={`images/actor${record.key}.jpg`} style={{float:"left"}} />
      <div style={{float:"left", marginLeft: "5px"}}>
        擅長劇本：{record.FilmTypes.map(o=><Tag color="#108ee9" key={o}>{FILM_TYPES[o]}</Tag>)}{record.FilmTags.map(o=><Tag color="#108ee9" key={o}>{FILM_TAG[o]}</Tag>)}<br/>
        擅長角色：{record.Tags.map(o=><Tag color="purple" key={o}>{CHARA_TAG[o]}</Tag>)}<br/>
        {/* //TODO: 屬性 record.Attrs*/}
        技能
        {record.Skills.map((o,i)=>
          <div key={i}>
            {o[0]} : {o[1]}
          </div>)}
      </div>
    </div>)
  }

  onFilterClear = (e) => {
    this.props.appState.onActorFilterClear(e);
    this.Filter.focus();
  }

  render() {
    let {appState} = this.props;
    let columns = [
      { title: '名稱', dataIndex: 'Name', width: 150 },
      { title: '原名', dataIndex: 'OrigName', width: 150 },
      { title: '星級', dataIndex: 'Star', width: 85, sorter: (a, b) => a.Star - b.Star,
        filters: [1,2,3,4,5,6].map(o=>({text:o.toString(), value:o})),
        onFilter: (val, r) => r.Star == val },
      { title: '區域', dataIndex: 'Nation', width: 85, sorter: (a, b) => a.Nation - b.Nation,
        filters: CHARA_NATION.map((o,i)=>({text:o, value:i})),
        onFilter: (val, r) => r.Nation == val,
        render: (txt, r, i)=>(r.Nation != -1 ? CHARA_NATION[r.Nation] : "")},
      { title: '性別', dataIndex: 'Gender', width: 85, sorter: (a, b) => a.Gender - b.Gender,
        filters: GENDER.map((o,i)=>({text:o, value:i})),
        onFilter: (val, r) => r.Gender == val,
        render: (txt, r, i)=>(r.Gender != -1 ? GENDER[r.Gender] : "")},
      { title: '派別', dataIndex: 'Faction', width: 85, sorter: (a, b) => a.Faction - b.Faction,
        filters: CHARA_FACTION.map((o,i)=>({text:o, value:i})),
        onFilter: (val, r) => r.Faction == val,
        render: (txt, r, i)=>(r.Faction != -1 ? CHARA_FACTION[r.Faction] : "")},
      { title: '類型', dataIndex: 'Type', width: 85, sorter: (a, b) => a.Type - b.Type,
        filters: CHARA_TYPE.map((o,i)=>({text:o, value:i})),
        onFilter: (val, r) => r.Type == val,
        render: (txt, r, i)=>(r.Type != -1 ? CHARA_TYPE[r.Type] : "")},
      //TODO: fix Switch checked not responding
      { title: '旗下', dataIndex: 'Owned', width: 80, sorter: (a, b) => a.Owned - b.Owned,
        render: (txt, r, i)=>(<Switch size="small" defaultChecked={r.Owned} onChange={this.props.appState.onOwnActorChange.bind(null, r.key)} />),
        filters: [{text:"ON", value: true}, {text:"OFF", value: false}],
        onFilter: (val, r) => r.Owned == val },
      { }
    ];
    return (
      <div style={{...this.props.style}}>
        <Input value={appState.ActorFilter} onChange={appState.onActorFilterChange} placeholder="過濾" style={{width: "140px", float: "left", zIndex: "1"}}
          ref={o=>{this.Filter=o}} suffix={<Icon type="close-circle" onClick={this.onFilterClear} />} />
        <Table
          scroll={{y: "calc(100vh - 185px)"}}
          pagination={{pageSize: 10, position: "top"}}
          size="small"
          columns={columns}
          dataSource={appState.ActorList}
          expandedRowRender={this.expandedRowRender}
        />
      </div>
    );
  }
}
export default ActorList;