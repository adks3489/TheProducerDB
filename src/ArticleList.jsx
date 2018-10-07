import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable, action, computed } from 'mobx';
import { Table, Tag, Input } from 'antd';

@inject('appState')
@observer
class ArticleList extends Component {
  FILM_TYPES = ["科幻片","勵志片","現代片","奇幻片","古裝片","災難片","冒險片","諜戰片","犯罪片","戰爭片"];
  FILM_TAG = ["英雄","警匪","復仇","政治","怪獸","傳奇","浪漫","倫理","藝術","校園","神鬼","穿越","歷史","公路","飆車","機器人","末世","宮廷","槍戰","太空"];
  SHOT_TYPE = ["敘事", "動作", "懸疑", "愛情", "喜劇", "恐怖", "動畫", "歌舞"];
  CHARA_TAG = ["癡情","打鬥","搞笑","強壯","硬漢","高顏值","青春","天真","殘酷","反派","瘋狂","大亨","領導者","軍人","超能力","高智商","性感","槍手","忠誠","陰謀家","學生","花花公子","警察","長者","政客","口才好","機靈","醫生","賭徒","罪犯","學者","憂郁","童星","俠客","滄桑","失憶","神職人員","教師","拜金","功夫","記者","間諜","頹廢","藝術家","無常識","貴族","海盜","車手","傭兵","領導","強迫癥","歌手"];
  CHARA_ATTR = ["場面", "表演", "劇情", "藝術", "娛樂"];
  GENDER = ["男", "女"];
  CHARA_NATION = ["歐美", "日韓", "華人"];
  CHARA_FACTION = ["偶像派", "演技派"];
  CHARA_TYPE = ["青春型", "成熟型"];

  constructor(props){
    super(props);

    this.Columns = [
      { title: '電影名稱', dataIndex: 'Name', width: 150 },
      { title: '原名', dataIndex: 'OrigName', width: 150 },
      { title: '星級', dataIndex: 'Star', width: 85, sorter: (a, b) => a.Star - b.Star,
        filters: [1,2,3,4,5,6].map(o=>({text:o.toString(), value:o})),
        onFilter: (val, r) => r.Star == val },
      { title: '類型', dataIndex: 'Type', width: 85, sorter: (a, b) => a.Type - b.Type, render: (txt, r, i)=>this.FILM_TYPES[r.Type],
        filters: this.FILM_TYPES.map((o,i)=>({text:o, value:i})),
        onFilter: (val, r) => r.Type == val },
      { }
    ];
  }

  expandedRowRender = (record) => {
    return (
    <div>
      <img src={`images/art${record.key}.png`} style={{float:"left"}} />
      <div style={{float:"left", marginLeft: "5px"}}>
        {record.Tags.map(o=><Tag color="#108ee9">{this.FILM_TAG[o]}</Tag>)}<br/>
        {record.Match.map((o,i)=><Tag color="grey" key={i}>{this.SHOT_TYPE[i]}:{o}</Tag>)}<br/>
        {record.Characters.map(o=>
          <div>
            {o[0]}
            {o[2]?.map(tag=><Tag color="purple">{this.CHARA_TAG[tag]}</Tag>)}
            要求：
            {o[4]!=null ? this.GENDER[o[4]]: ""}
            {o[5]!=null ? this.CHARA_NATION[o[5]]: ""}
            {o[6]!=null ? this.CHARA_FACTION[o[6]]: ""}
            {o[7]!=null ? this.CHARA_TYPE[o[7]]: ""}
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