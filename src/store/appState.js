import {observable, computed, action} from 'mobx';

class AppState {
  @observable Articles = [];
  @observable Actors = [];

  @observable ArticleFilter = null;
  @observable ActorFilter = null;

  constructor(){
    this.LoadData();
  }

  LoadData = () => {
    fetch('articles.json').then(resp=>{
      if(resp.ok){
        return resp.json();
      }
    }).then(resp=>{
      this.Articles = resp;
    });

    fetch('actors.json').then(resp=>{
      if(resp.ok){
        return resp.json();
      }
    }).then(resp=>{
      this.Actors = resp;
    });
  }

  @action
  onArticleFilterChange = (e) => {
    this.ArticleFilter = e.target.value;
  }

  @action
  onActorFilterChange = (e) => {
    this.ActorFilter = e.target.value;
  }

  @computed
  get ArticleList(){
    let list = this.Articles.slice()
    if(this.ArticleFilter){
      list = list.filter(o=>o.Name.includes(this.ArticleFilter)||o.OrigName.includes(this.ArticleFilter));
    }
    return list;
  }

  @computed
  get ActorList(){
    return this.Actors.slice();
  }
}

export default AppState