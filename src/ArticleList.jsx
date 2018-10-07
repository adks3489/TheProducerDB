import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable, action, computed } from 'mobx';
import { Table, Tag, Input } from 'antd';
import { FILM_TYPES, FILM_TAG, SHOT_TYPE, CHARA_TAG, CHARA_ATTR, GENDER, CHARA_NATION, CHARA_FACTION, CHARA_TYPE } from './Types';

@inject('appState')
@observer
class ArticleList extends Component {
  constructor(props){
    super(props);

    this.Columns = [
      { title: '電影名稱', dataIndex: 'Name', width: 150 },
      { title: '原名', dataIndex: 'OrigName', width: 150 },
      { title: '星級', dataIndex: 'Star', width: 85, sorter: (a, b) => a.Star - b.Star,
        filters: [1,2,3,4,5,6].map(o=>({text:o.toString(), value:o})),
        onFilter: (val, r) => r.Star == val },
      { title: '類型', dataIndex: 'Type', width: 85, sorter: (a, b) => a.Type - b.Type, render: (txt, r, i)=>FILM_TYPES[r.Type],
        filters: FILM_TYPES.map((o,i)=>({text:o, value:i})),
        onFilter: (val, r) => r.Type == val },
      { }
    ];
  }

  expandedRowRender = (record) => {
    return (
    <div>
      <img src={`images/art${record.key}.png`} style={{float:"left"}} />
      <div style={{float:"left", marginLeft: "5px"}}>
        {record.Tags.map(o=><Tag color="#108ee9" key={o}>{FILM_TAG[o]}</Tag>)}<br/>
        {record.Match.map((o,i)=><Tag color="grey" key={i}>{SHOT_TYPE[i]}:{o}</Tag>)}<br/>
        {record.Characters.map(o=>
          <div>
            {o[0]}
            {o[2]?.map(tag=><Tag color="purple" key={tag}>{CHARA_TAG[tag]}</Tag>)}
            要求：
            {o[4]!=null ? GENDER[o[4]]: ""}
            {o[5]!=null ? CHARA_NATION[o[5]]: ""}
            {o[6]!=null ? CHARA_FACTION[o[6]]: ""}
            {o[7]!=null ? CHARA_TYPE[o[7]]: ""}
          </div>)}
      </div>
    </div>)
  }

  render() {
    let {appState} = this.props;
    return (
      <div style={{...this.props.style}}>
        <Input value={appState.ArticleFilter} onChange={appState.onArticleFilterChange} placeholder="過濾" style={{width: "180px"}}/>
        <Table
          scroll={{y: "calc(100vh - 132px)"}}
          pagination={false}
          size="small"
          columns={this.Columns}
          dataSource={appState.ArticleList}
          expandedRowRender={this.expandedRowRender}
        />
      </div>
    );
  }
}
export default ArticleList;