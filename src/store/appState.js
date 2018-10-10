import {observable, computed, action} from 'mobx';

class AppState {
  @observable CurrentTabKey = "1";
  @observable.shallow Articles = [];
  @observable Actors = [];

  @observable ArticleFilter = null;
  @observable ActorFilter = null;

  @observable OwnedActors = new Set();
  @observable.ref CalcArticle = null;

  constructor(){
    this.LoadUserData();
    this.LoadData();
  }

  LoadData = () => {
    fetch('articles.json').then(resp=>{
      if(resp.ok){
        return resp.json();
      }
    }).then(resp=>{
      this.Articles = resp;
      this.CalcArticle = this.Articles[0];
    });

    fetch('actors.json').then(resp=>{
      if(resp.ok){
        return resp.json();
      }
    }).then(resp=>{
      for(let actor of resp){
        actor.Owned = this.OwnedActors.has(actor.key);
      }
      this.Actors = resp;
    });
  }

  @action
  LoadUserData = () => {
    let ownedActors = window.localStorage.getItem("OwnedActors");
    if(ownedActors){
      this.OwnedActors = new Set(JSON.parse(ownedActors));
    }
  }

  @action
  onTabChange = (key) => {
    this.CurrentTabKey = key;
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
      list = list.filter(o=>{
        if(o.OrigName?.includes(this.ArticleFilter)){
          return true;
        }
        if(Array.isArray(o.Name)){
          for(let name of o.Name){
            if(name.includes(this.ArticleFilter)){
              return true;
            }
          }
          return false;
        }
        else{
          return o.Name?.includes(this.ArticleFilter);
        }
      });
    }
    return list;
  }

  @computed
  get ActorList(){
    let list = this.Actors.slice()
    if(this.ActorFilter){
      list = list.filter(o=>o.Name?.includes(this.ActorFilter)||o.OrigName?.includes(this.ActorFilter));
    }
    return list;
  }

  @action
  onOwnActorChange = (key, own) => {
    let actor = this.Actors.find(o=>o.key == key);
    actor.Owned = own;
    if(own){
      this.OwnedActors.add(key);
    }
    else{
      this.OwnedActors.delete(key);
    }
    window.localStorage.setItem("OwnedActors", JSON.stringify(Array.from(this.OwnedActors)));
  }

  @action
  CalcMatch = (script) => {
    this.CalcArticle = script;
    this.CurrentTabKey = "3";
  }
}

export default AppState