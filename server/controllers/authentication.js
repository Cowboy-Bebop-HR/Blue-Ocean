const dotenv = require('dotenv').config();
var models = require ('./../models');

var spotify_client_id = process.env.SPOTIFY_CLIENT_ID;
var spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET;

var generateRandomString = function (length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var roomID = '';

module.exports = {
  get : (req, res) => {
    var scope = "streaming \
    user-library-modify \
    user-read-email \
    user-read-private \
    playlist-modify-private \
    playlist-modify-public"

    var state = generateRandomString(16);

    let redirectURI = 'http://13.56.115.246:3001/auth/callback';

    var auth_query_parameters = new URLSearchParams({
      response_type: "code",
      client_id: spotify_client_id,
      scope: scope,
      redirect_uri: redirectURI,
      state: state,
      roomID: req.query.roomID,
    });
    if (req.query.roomID) {
      roomID = req.query.roomID;
    }

    res.redirect('https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString());

  },

  callbackGet : (req, res ) => {
    console.log(req.query.state, 'state item IN BOOGALOO AUTH'); // user has state
    console.log(req.query);
    models.authenticationCallback(req.query.code, req.query.state, (err, results) => {
      if (err) {
        console.log(err, 'auth error');
      } else {
        if (roomID.length > 0) {
          res.redirect(`/?roomID=${roomID}&authCode=${req.query.state}`);
          roomID = '';
        } else {
          res.redirect(`/?authCode=${req.query.state}`);
        }
      }
    })
  }

}