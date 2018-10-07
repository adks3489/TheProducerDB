import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Table, Tag, Input, Switch } from 'antd';
import { FILM_TYPES, FILM_TAG, SHOT_TYPE, CHARA_TAG, CHARA_ATTR, GENDER, CHARA_NATION, CHARA_FACTION, CHARA_TYPE } from './Types';

@inject('appState')
@observer
class ActorList extends Component {
  constructor(props){
    super(props);

    this.Columns = [
      { title: '演員名稱', dataIndex: 'Name', width: 150 },
      { title: '原名', dataIndex: 'OrigName', width: 150 },
      { title: '星級', dataIndex: 'Star', width: 85, sorter: (a, b) => a.Star - b.Star,
        filters: [1,2,3,4,5,6].map(o=>({text:o.toString(), value:o})),
        onFilter: (val, r) => r.Star == val },
      //TODO: fix Switch checked not responding
      { title: '旗下', dataIndex: 'Owned', width: 50, render: (txt, r, i)=>(<Switch size="small" defaultChecked={r.Owned} onChange={this.props.appState.onOwnActorChange.bind(null, r.key)} />) },
      { }
    ];
  }

  expandedRowRender = (record) => {
    return (
    <div>
      <img src={`images/actor${record.key}.png`} style={{float:"left"}} />
      <div style={{float:"left", marginLeft: "5px"}}>
        擅長劇本：{record.FilmTypes.map(o=><Tag color="#108ee9">{FILM_TYPES[o]}</Tag>)}{record.FilmTags.map(o=><Tag color="#108ee9">{FILM_TAG[o]}</Tag>)}<br/>
        擅長角色：{record.Tags.map(o=><Tag color="purple">{CHARA_TAG[o]}</Tag>)}<br/>
        {/* //TODO: 屬性 record.Attrs*/}
        技能
        {record.Skills.map(o=>
          <div>
            {o[0]} : {o[1]}
          </div>)}
      </div>
    </div>)
  }

  render() {
    let {appState} = this.props;
    return (
      <div style={{...this.props.style}}>
        <Input value={appState.ActorFilter} onChange={appState.onActorFilterChange} placeholder="過濾" style={{width: "180px"}}/>
        <Table
          scroll={{y: "calc(100vh - 132px)"}}
          pagination={false}
          size="small"
          columns={this.Columns}
          dataSource={appState.ActorList}
          expandedRowRender={this.expandedRowRender}
        />
      </div>
    );
  }
}
export default ActorList;