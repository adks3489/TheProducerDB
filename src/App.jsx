import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable, action, computed, autorunAsync, autorun } from 'mobx';
import { Tabs } from 'antd';
import ArticleList from './ArticleList';
import ActorList from './ActorList';
import CalcPage from './CalcPage';

@inject('appState')
@observer
class App extends Component {
  render() {
    return (
      <div style={{width:"100%", height:"100%"}}>
        <Tabs activeKey={this.props.appState.CurrentTabKey} onChange={this.props.appState.onTabChange} size="small" style={{width:"100%", height:"100%"}}>
          <Tabs.TabPane tab="電影" key="1">
            <ArticleList style={{height:"calc(100vh - 55px)"}}/>
          </Tabs.TabPane>
          <Tabs.TabPane tab="演員" key="2">
            <ActorList style={{height:"calc(100vh - 55px)"}}/>
          </Tabs.TabPane>
          <Tabs.TabPane tab="計算" key="3">
            <CalcPage style={{height:"calc(100vh - 55px)"}}/>
          </Tabs.TabPane>
        </Tabs>
      </div>
    );
  }
}
export default App;