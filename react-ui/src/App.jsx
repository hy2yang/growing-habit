import React, { Component } from 'react';
import './App.css';
import AlertBanners from './AlertBanners';
import Login from './Login';
import AccountDetail from './AccountDetail';
import Navigation from './Navigation';
import BrowsePanel from './BrowsePanel';

const connection = require('./connection');

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      userId : null,
      username : null,
      jwtToken: null,
      error : null,
      alert : null,
      datasource : '/habits',
      habits :[]
    };
    this.fetchHabits();
  }

  componentDidMount() {
  }

  render() {

    const loading = require('./loading.gif');
    const accountPanel = () => {
      if (this.state.username) {
        return (<AccountDetail username={this.state.username} logoutSubmit={() => this.logoutSubmit()} />)
      }
      else return (<Login loginSubmit={(body) => this.loginSubmit(body)} />);
    }

    return (
      <div className='App'>
        {AlertBanners(this.state.alert, this.state.error, this.onCloseAlert.bind(this), this.onCloseError.bind(this))}        
        <div className='hidden' id='loading'><p className='img'><img src={loading} alt="loading gif" /></p></div>
        <div className='header'>
          <Navigation username={this.state.username} accountPanel={accountPanel()} setDatasource={this.setDatasource.bind(this)} 
          clearBanner={()=>{
            this.onCloseAlert();
            this.onCloseError();
            }}/>
        </div>
        <BrowsePanel array={this.state.habits}/>

      </div>
    );

  }

  onCloseError(){
    this.setState({error : null} , ()=>this.hideElement('.errorBanner'));
  }

  onCloseAlert(){
    this.setState({alert : null} , ()=>this.hideElement('.alertBanner'));
  }

  handleException(res){
    this.setState({error : res.error, alert : res.alert});
  }

  fetchHabits(){
    connection.fetchJsonFrom(this.state.datasource, 'get', this.state.jwtToken ,null)
      .then(res => {
        if (!res.error && !res.alert) {
          this.setState({habits : res})
        }
        else {
          this.handleException(res);
        };
      })
      .catch(e=>{
        this.handleException({error : e});
      });
  }

  setDatasource(path){    
    this.setState({datasource : path});
  }

  loginSubmit(body) {
    this.showElement('#loading');
    connection.fetchJsonFrom('./login', 'post', null, body)
      .then(res => {
        if (!res.error && !res.alert) {
          this.setState({ 
            userId : res.userId,
            username : res.username,
            jwtToken : res.token
          }, () => this.hideElement('#loading'))
        }
        else {
          this.handleException(res);
          this.hideElement('#loading')
        };
      })
      .catch(e=>{
        this.handleException({error : e});
        this.hideElement('#loading')
      });
  }

  logoutSubmit() {
    this.showElement('#loading');
    connection.fetchJsonFrom('./logout', 'post', this.state.jwtToken, null)
      .then(res => {
        if (!res.error && !res.alert) {
          this.setState({ 
            userId : null,
            username : null,
            jwtToken : null
           }, () => this.hideElement('#loading'));
        }
        else {
          this.handleException(res);
          this.hideElement('#loading')
        };
      })
      .catch(e=>{
        this.handleException({error : e});
        this.hideElement('#loading')
      });
  }

  hideElement(queryString) {
    document.querySelector(queryString).classList.add('hidden');
  }

  showElement(queryString) {
    document.querySelector(queryString).classList.remove('hidden');
  }

}

export default App;
