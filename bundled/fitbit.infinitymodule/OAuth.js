const express = require('express');
const app = express();
const path = require('path');

const fiplab = require('fiplab');

class OAuth{
  constructor(clientID, secret, port){
    this.port = port;

    // Set the configuration settings
    let credentials = {
      client: {
        id: clientID,
        secret: secret
      },
      auth: {
        tokenHost: 'https://api.fitbit.com',
        tokenPath: '/oauth2/token',

        authorizeHost: 'https://www.fitbit.com/',
        authorizePath: '/oauth2/authorize',
      },
    };

    // Initialize the OAuth2 Library
    this.oauth2 = require('simple-oauth2').create(credentials);
  }

  requestToken(){    
    let promise = new Promise(this._actuallyRequestToken.bind(this));

    //Timeout after 60 seconds?
    let timeoutMS = (60 * 1000);

    let timeoutPromise = new Promise(function(resolve, reject){
      let id = setTimeout(() => {
        clearTimeout(id);
        reject('Authentication timed out, refresh to try again.');
      }, timeoutMS);
    });

    return Promise.race([promise, timeoutPromise]);
  }

  _actuallyRequestToken(resolve, reject){
    this.finalResolve = resolve;
    this.finalReject = reject;

    let port = this.port;
    let host = 'http://localhost:' + port;

    // Initial page redirecting to Github
    let that = this;
    app.get('/auth', (req, res) => {
      res.redirect(that.authorizationUri);
    });

    app.get('/callback', async (req, res) => {
      const code = req.query.code;
      const options = {
        code,
        redirect_uri: host + '/callback'

      };

      try {
        const result = await that.oauth2.authorizationCode.getToken(options);
        console.log('The resulting token: ', result);
        
        const token = that.oauth2.accessToken.create(result);

        setTimeout(function(){
          that.server.close();
          resolve(token);
        }, 500);
        return res.status(200).sendFile(path.join(__dirname+'/done.html'))
      } 
      catch(error) {
        console.log('e', error.toString());
        setTimeout(function(){
          that.server.close();
          reject(error.message);
        }, 500);

        return res.status(500).sendFile(path.join(__dirname+'/failed.html'))
      }
    });

    app.get('/success', (req, res) => {
      res.send('');
    });

    this.server = app.listen(this.port, this._handleServerStart.bind(this))
    .on('error', function(err){
      reject(err);
    });
  }

  isAccessTokenExpired(tokenObj){
    let accessToken = this.oauth2.accessToken.create(tokenObj);
    return accessToken.expired();
  }

  refreshToken(tokenObj){
    // Create the access token wrapper
    let accessToken = this.oauth2.accessToken.create(tokenObj);
    return accessToken.refresh();
  }

  _handleServerStart(){
    let port = this.port;
    let host = 'http://localhost:' + port;
    this.authorizationUri = this.oauth2.authorizationCode.authorizeURL({
      redirect_uri: host + '/callback',
      scope: 'activity weight',
      state: '3(#0/!~',
    });

    console.log('Express server started on port', port);

    //Alert the user
    fiplab.notify({
      'id': Math.random() + '',
      'message': 'Authentication required, click here to finish setup.',
      'url': host + '/auth',
      'actionButtonTitle': 'Continue'
    });
  }
}

module.exports = OAuth;