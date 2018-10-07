import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable, action, computed, autorunAsync, autorun } from 'mobx';
import { Tabs } from 'antd';
import ArticleList from './ArticleList';

@inject('appState')
@observer
class App extends Component {
  render() {
    return (
      <div style={{width:"100%", height:"100%"}}>
        <Tabs defaultActiveKey="1" size="small" style={{width:"100%", height:"100%"}}>
          <Tabs.TabPane tab="影片" key="1">
            <ArticleList style={{height:"calc(100vh - 55px)", fontSize:"16pt", fontFamily:"monospace"}}/>
          </Tabs.TabPane>
          <Tabs.TabPane tab="演員" key="2">
          </Tabs.TabPane>
          <Tabs.TabPane tab="計算" key="3">
          </Tabs.TabPane>
        </Tabs>
      </div>
    );
  }
}
export default App;