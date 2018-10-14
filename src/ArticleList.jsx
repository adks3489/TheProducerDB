import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable, action, computed } from 'mobx';
import { Table, Tag, Input, Button, Icon } from 'antd';
import { FILM_TYPES, FILM_TAG, SHOT_TYPE, CHARA_TAG, CHARA_ATTR, GENDER, CHARA_NATION, CHARA_FACTION, CHARA_TYPE } from './Types';
import ScriptInfo from './ScriptInfo';

@inject('appState')
@observer
class ArticleList extends Component {
  constructor(props){
    super(props);

    this.Columns = [
      { title: '電影名稱', dataIndex: 'Name', width: 150, render: (txt, r, i)=>Array.isArray(r.Name) ? r.Name[0] : r.Name },
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
        <ScriptInfo data={record} />
        <Button type="primary" onClick={()=>this.props.appState.CalcMatch(record)} style={{marginTop:"80px"}}>計算</Button>
      </div>
    );
  }

  onFilterClear = (e) => {
    this.props.appState.onArticleFilterClear(e);
    this.Filter.focus();
  }

  render() {
    let {appState} = this.props;
    return (
      <div style={{...this.props.style}}>
        <Input value={appState.ArticleFilter} onChange={appState.onArticleFilterChange} placeholder="過濾" style={{width: "140px", float: "left", zIndex: "1"}}
          ref={o=>{this.Filter=o}} suffix={<Icon type="close-circle" onClick={this.onFilterClear} />}
        />
        <Table
          scroll={{y: "calc(100vh - 170px)"}}
          pagination={{pageSize: 10, position:"top"}}
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