/* eslint-disable max-len */
import React, { useState } from 'react';
import styled from 'styled-components';
import Queue from '../Queue/Queue.jsx';
import SearchBar from '../SearchBar/SearchBar.jsx';
import Player from '../player.jsx';
import Chat from '../Chat/Chat.jsx';

const generateRandomString = (length) => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

export default function AdminRoom({ token, refreshToken, username, setUsername, device_id, setDevice_id }) {

  const [currentUri, setCurrentUri] = useState('');
  const [queue, setQueue] = useState([]);

  return (
    <RoomContainer className="roomContainer">
      <Queue queue={queue} token={token} username={username} />
      <div className="centerStuff">
        <SearchBar setQueue={setQueue} token={token} deviceID={device_id} />
        <Player token={token} refreshToken={refreshToken} setUsername={setUsername} setDevice_id={setDevice_id} setCurrentUri={setCurrentUri} />
        <RoomCodeLink>COPY ROOM LINK</RoomCodeLink>
      </div>
      <Chat username={username} />
    </RoomContainer>
  );
}

const RoomContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
const RoomCodeLink = styled.div`
  background-color: cyan;
`;
