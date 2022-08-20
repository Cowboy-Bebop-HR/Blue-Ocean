/* eslint-disable indent */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from "styled-components";
import { IoIosPause } from "react-icons/io";
import { BsPlayFill } from "react-icons/bs";
import { FaCopy }from'react-icons/fa';
import { RiDownloadLine } from 'react-icons/ri';
import { RiSkipForwardLine } from 'react-icons/ri';

const track = {
  name: '',
  album: {
    images: [
      { url: '' },
    ],
  },
  artists: [
    { name: '' },
  ],
};

function WebPlayback(props) {

    const [is_paused, setPaused] = useState(false);
    const [is_active, setActive] = useState(false);
    const [player, setPlayer] = useState(undefined);
    const [current_track, setTrack] = useState(track);
    const [device_id, setDevice_id] = useState('');
    const [playlist_uri, setPlaylist_uri] = useState('');
    const [user, setUser] = useState('');
    const [isCopied, setIsCopied] = useState(false);

    const setUri = (uri) => {
      props.setCurrentUri(uri);
    }

    useEffect(() => {
      setUri(current_track.uri);
      console.log('---track---', current_track)
    }, [current_track])


    useEffect(() => {

        var dev_id;

        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {

          const player = new window.Spotify.Player({
            name: 'Web Playback SDK',
            getOAuthToken: cb => { cb(props.token); },
            volume: 0.5
          });

          setPlayer(player);

          player.addListener('ready', ({ device_id }) => {
            console.log('Ready with Device ID', device_id);
            props.setDevice_id({ device_id })
            setDevice_id({ device_id })
            let wrapperFunction = () => {
            axios.put('https://api.spotify.com/v1/me/player', {'device_ids': [`${device_id}`], play: true},
            {headers: {Authorization: `Bearer ${props.token}`}})
            .catch((err) => {console.log(err)
            wrapperFunction()})
            }
            wrapperFunction();

            axios.get('https://api.spotify.com/v1/me',  {headers: {Authorization: `Bearer ${props.token}`}})
              .then((res) => {console.log(res.data); props.setUsername(res.data.display_name); setUser(res.data.display_name)
              })
              .catch((err) => console.log(err))
          });

          player.addListener('not_ready', ({ device_id }) => {
              console.log('Device ID has gone offline', device_id);
          });

          player.addListener('player_state_changed', ( state => {
            if (!state) {
              return;
            }
            console.log(state.track_window, 'track window');
            setTrack(state.track_window.current_track);
            setPaused(state.paused);

            player.getCurrentState().then( state => {
              (!state)? setActive(false) : setActive(true)
            });
          }));

          player.connect()
            .then(() => {
              console.log('bangbangbang');
            })
            .catch((error) => {
              console.log(error);
            })
        };
  }, []);

  if (!is_active) {
    return (
      <div className="container">
        <div className="main-wrapper">
          <div id="load">
            <div>G</div>
            <div>N</div>
            <div>I</div>
            <div>D</div>
            <div>A</div>
            <div>O</div>
            <div>L</div>
          </div>
        </div>
      </div>
    );
  }

  // setTimeout(() => {
  //   // Player connected and initialized; store room state in database using POST
  //   player.getCurrentState()
  //     .then((state) => {
  //       console.log('--->', state);
  //       let initialRoomData = {
  //         roomID: props.roomID,
  //         paused: state.paused,
  //         position: state.position,
  //         playingSong: state.track_window.current_track.uri
  //       };
  //       return initialRoomData;
  //     })
  //     .then((initialRoomData) => {
  //       return axios.post('/room', initialRoomData);
  //     })
  //     .catch((error) => {
  //       console.log('BANGBANGBANG', error);
  //     });
  // }, 500);

  // Handler functions to handle what happens when someone (preferably the host) interacts with the player
  // Host presses PLAY/PAUSE button on player
  const handleTogglePlay = (isPaused) => {
    player.togglePlay()
      // PUT request to update the state of the room (send WebPlaybackState Object's paused, position, and current_track (the uri))
      .then(() => { // Get the current state of the player
        console.log('Toggle play');
        return player.getCurrentState();
      })
      .then((state) => {
        let roomData = {
          roomID: props.roomID,
          paused: state.paused,
          position: state.position,
          playingSong: state.track_window.current_track.uri
        };
        return roomData;
      })
      .then((roomData) => {
        return axios.put('/room', roomData);
      })
      .catch((error) => {
        console.log('Error occurred when attempting to PUT room data to server:', error);
      });
  };

  // Host presses NEXT (or >>) button to skip to next song on player
  const handleSkip = () => {
    // Skip to the next track on the player
    player.nextTrack()
      // PUT request to update the state of the room (send WebPlaybackState Object's paused, position, current_track (the uri) and the queue data)
      .then(() => {
        console.log('Skipped to next track');
        return player.getCurrentState();
      })
      .then((state) => {
        let roomData = {
          roomID: props.roomID,
          paused: state.paused,
          position: state.position,
          playingSong: state.track_window.current_track.uri
        };
        return roomData;
      })
      .then((roomData) => {
        return axios.put('/room', roomData);
      })
      .catch((error) => {
        console.log('Error occurred when attempting to PUT room data to server:', error);
      });
  };

  // setInterval(() => {
  //   console.log('5 sec room state update!');
  //   player.getCurrentState()
  //     .then((state) => {
  //       let roomData = {
  //         roomID: props.roomID,
  //         paused: state.paused,
  //         position: state.position,
  //         playingSong: state.track_window.current_track.uri
  //       };
  //       return roomData;
  //     })
  //     .then((roomData) => {
  //       return axios.put('/room', roomData);
  //     })
  //     .catch((error) => {
  //       console.log('Error occurred when attempting to PUT room data to server:', error);
  //     });
  // }, 5000);

  const saveTrack = (uri) => {
    let songId = uri.slice(14)
    console.log('--song ID--: ', songId)
    console.log('--TOKEN--: ', props.token)
    axios.put(`https://api.spotify.com/v1/me/tracks?ids=${songId}`, null, { headers: { Authorization: `Bearer ${props.token}` } })
      .then((response) => {
        console.log('track saved! ', response)
      })
      .catch((err) => console.log('error saving track', err))
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`http://localhost:3001/?roomID=${props.roomID}`);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false)
    }, 2000);
  }

  return (
    <Container>
      <MainWrapper>
        <SongImg src={current_track.album.images[0].url} />
          <SongInfo>{current_track.artists[0].name} - {current_track.name}</SongInfo>
          <AddedBy>added by {user}</AddedBy>
          <ButtonsContainer>
          <Save onClick={() => {saveTrack(current_track.uri)}}>Save</Save>
          { is_paused ? <Play onClick={() => { handleTogglePlay(is_paused); }}/> : <Pause onClick={() => { handleTogglePlay(is_paused); }}/>}
          <Skip onClick={() => { handleSkip(); }}>Skip</Skip>
          </ButtonsContainer>
          <RoomCodeLink
            onClick={() => handleCopyLink()}
            style={{ backgroundColor: isCopied ? '#70CAD1' : '#D9D9D9'}}
          >
            <div style={{marginRight: '4px', marginTop: '1px'}}>
              <FaCopy size={15}/>
            </div>
            {isCopied ? 'COPIED!' : 'COPY ROOM LINK'}
          </RoomCodeLink>
      </MainWrapper>
    </Container>
  );
}

const RoomCodeLink = styled.div`
  background-color: #D9D9D9;
  color: black;
  font-size: 16px;
  cursor: pointer;
  display: inline-flex;
  border-radius: 5px;
  margin-top: 12px;
  margin-bottom: 35px;
  box-sizing: border-box;
  padding: 10px;

    &:hover {
      background-color: #70CAD1;
      opacity: 0.5;
    };
`

const ButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
`

const Skip = styled(RiSkipForwardLine)`
  height: 30;
  width: 30px;
  border-radius: 50%;
  border: 2px solid #D9D9D9;
  background-color: #D9D9D9;
  color: #0D1317;
  font-size: 25px;
  cursor: pointer;
  margin: 7px;

  &:hover {
    color: #D9D9D9;
    background-color: #0D1317;
    border: 2px solid #70CAD1;
    transform: scale(1.1);
  };
`
const Save = styled(RiDownloadLine)`
  height: 30;
  width: 30px;
  border-radius: 50%;
  border: 2px solid #D9D9D9;
  background-color: #D9D9D9;
  color: #0D1317;
  font-size: 25px;
  cursor: pointer;
  margin: 7px;

  &:hover {
    color: #D9D9D9;
    background-color: #0D1317;
    border: 2px solid #70CAD1;
    transform: scale(1.1);
  };
`

const Pause = styled(IoIosPause)`
  border: 2px solid #0D1317;
  border-radius: 50%;
  height: 50px;
  width: 50px;
  padding: 5px;
  color: #0D1317;
  background-color: #D9D9D9;
  margin: 10px;
  cursor: pointer;

  &:hover {
    color: #D9D9D9;
    background-color: #0D1317;
    border: 2px solid #70CAD1;
};
`

const Play = styled(BsPlayFill)`
  border: 2px solid #0D1317;
  border-radius: 50%;
  height: 50px;
  width: 50px;
  padding-left: 3px;
  color: #0D1317;
  background-color: #D9D9D9;
  margin: 10px;
  cursor: pointer;

  &:hover {
    color: #D9D9D9;
    background-color: #0D1317;
    border: 2px solid #70CAD1;
  };
`


const Container = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  height: 100%;
  position: fixed;
  top: 100px;
  left: 0;
  right: 0;
  margin-left: 430px;
  width: 50%;
`

const MainWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  margin: 0 auto;
  justify-content: center;
  width: 60%;
`

const SongImg = styled.img`
  border: 2px solid black;
  border-radius: 10px;
  width: 25vw;
  box-shadow: 0px -1px 10px #738984;
`

const SongInfo = styled.div`
  font-size: 30px;
  margin: 20px;
  text-align: center;
  text-shadow: 0 0 3px #ffffff, 0 0 5px #8181c6;
`

const AddedBy = styled.div`
  font-size: 20px;
  text-shadow: 0 0 3px #ffffff, 0 0 5px #8181c6;
`

export default WebPlayback;
