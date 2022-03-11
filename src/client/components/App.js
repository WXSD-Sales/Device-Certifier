import react from 'react';
import axios from 'axios';
import queryString from 'querystring';
import moment from 'moment';
import {AUTHORIZATION_URL, CLIENT_ID, CLIENT_SECRET, REDIRECT_URL, WEBEX_AUTH_URL, GRANT_TYPE, REFRESH_GRANT_TYPE} from './constants';
import Content from './Content';
import './App.css';

class App extends react.Component {
  constructor() {
    super();
    this.token = JSON.parse(localStorage.getItem('token'));
    this.state = {
      isAuthenticated: true
    };
  }

  async componentDidMount() {
    // Authentication is not required
    // await this.authorize();
  }
  
  async authorize() {
    if(this.token) {
      if (moment(localStorage.getItem('expiration_date')).diff(moment.utc()) > 0) {
        this.setState({isAuthenticated: true});
      } else {
        this.requestForToken(this.token.refresh_token, true);
      }
    } else {
      const code = new URLSearchParams(window.location.search).get("code");
      if(code) {
        await this.requestForToken(code);
      } else {
        window.location.href = AUTHORIZATION_URL;
      }
    }
  }
 
  async requestForToken(code, isExpired=false) {
    const body = isExpired ? {
        refresh_token: code,
        grant_type: REFRESH_GRANT_TYPE,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET
    } : {
        code,
        redirect_uri: REDIRECT_URL,
        grant_type: GRANT_TYPE,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET
    };

    try {
      const {data} = await axios.post(WEBEX_AUTH_URL, queryString.stringify(body), 
      {
        headers: { 
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });
      const startDate = moment.utc();
      const expirationDate = startDate.add(Number(data.expires_in), 'seconds');
      
      this.token = data;
      localStorage.setItem('token', JSON.stringify(data));
      localStorage.setItem('expiration_date', expirationDate.format());
      this.setState({isAuthenticated: true});
    } catch (error) {
      console.log(error);
    }
  }
  
  render() {
    return  this.state.isAuthenticated && 
    <div className="flex justify-center items-center h-full">
      <Content />
    </div>
  }
}

export default App;
