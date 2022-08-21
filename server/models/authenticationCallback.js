const axios = require('axios');
const dotenv = require('dotenv').config();
const request = require('request');

var spotify_client_id = process.env.SPOTIFY_CLIENT_ID;
var spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET;



module.exports = (code, authCode, callback) => {
  // var authOptions = {
  //   url: 'https://accounts.spotify.com/api/token',
  // };
  // let newAxios = axios.create({
  //   headers : {
  //     'Authorization': 'Basic ' + (Buffer.from(spotify_client_id + ':' + spotify_client_secret).toString('base64')),
  //     'Content-Type' : 'application/x-www-form-urlencoded'
  //   },
  //   form: {
  //     code: code,
  //     redirect_uri: "http://localhost:3001/auth/callback",
  //     grant_type: 'authorization_code'
  //   },
  //   json: true
  // })

  // newAxios.post(authOptions.url)
  // .then((results)=>{
  //   console.log(results, 'authResults')
  //   global.access_token = results;
  //   callback(null, true);
  // })
  // .catch((err)=>{
  //   callback(err, false);
  // })
  // var code = req.query.code;

  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: "http://13.56.115.246:3001/auth/callback",
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (Buffer.from(spotify_client_id + ':' + spotify_client_secret).toString('base64')),
      'Content-Type' : 'application/x-www-form-urlencoded'
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    console.log(body)
    if (response.statusCode === 200) {
      //console.log(body.access_token, 'body access token')
      //console.log(global, 'global item');
      global[authCode] = {
        access_token : body.access_token,
        refresh_token: body.refresh_token
      }
      //global.refresh_token = body.refresh_token;
      //global.access_token = body.access_token;
      //console.log(global.access_token, 'global1')
      setTimeout(() => delete global[authCode], 10000);
      callback(null, response);
    } else {
      callback(error, null)
    }
  });
}