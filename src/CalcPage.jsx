import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Select } from 'antd';

@inject('appState')
@observer
class CalcPage extends Component {
  render() {
    let {appState} = this.props;
    let article = appState.CalcArticle;
    return (
      <div style={{width:"100%", height:"100%"}}>
        <Select showSearch>
        </Select><br/>
        {
          article != null ? (
            <div>
              <img src={`images/art${article.key}.png`} style={{float:"left"}} />
              <div style={{float:"left", marginLeft: "5px"}}>
              </div>
            </div>
          ): "未選擇電影"
        }
      </div>
    );
  }
}
export default CalcPage;