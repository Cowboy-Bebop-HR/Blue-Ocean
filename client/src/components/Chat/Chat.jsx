/* eslint-disable no-console */
// Import stuff
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { BsFillArrowUpCircleFill } from 'react-icons/bs';
import io from 'socket.io-client';

const socket = io();

export default function Chat({ username }) {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [lastPong, setLastPong] = useState(null);
  const [message, setMessage] = useState('');
  const [listOfMessages, setListOfMessages] = useState([]);
  const [name, setName] = useState('');
  //const [group, setGroup] = useState([]);

  // need something to get userName from token data
  useEffect(() => {
    if (username !== null) {
      console.log("this is the name to set", username);
      setName(username);
    }
  }, [username]);

  useEffect( () => {
    socket.emit('new-user', name);
  }, [name])

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
      console.log('CONNECTED');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('pong', () => {
      setLastPong(new Date().toISOString());
    });

    socket.on('chat message', (msg) => {
      const newMessage = `${msg.name}: ${msg.msg}`;
      const timeStamp = new Date().toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
      setListOfMessages([...listOfMessages, {message: newMessage, timeStamp}]);
    });

    socket.on('user-connected', (name) => {
      if (name !== '') {
        const msg = `${name} is connected`;
        const timeStamp = new Date().toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
        setListOfMessages([...listOfMessages, {message: msg, timeStamp}]);
      }
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('pong');
    };
  }, [listOfMessages]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (message === '') {
      return;
    }
    socket.emit('chat message', message);
    console.log(username, name);
    setMessage('');
  };

  function onKeyDown(event) {
    if (event.keyCode === 13) {
      handleSubmit(event);
    }
  };

  return (
    <ChatContainer>
      {/* <UserFace id="face">
        <div>{group.map((pic, index) => {
          if (pic !== '') {
            return <Face>{pic}</Face>
          }

        })}</div>
      </UserFace>
      <Bar></Bar> */}
      <Messages id="messages">
        <div>
          {listOfMessages.map((msg, index) => {
            return (
              <div style={{display: 'flex', alignItems: 'center'}}>
                <Message key={index}>{msg.message}</Message>
                <TimeStamp>{msg.timeStamp}</TimeStamp>
              </div>
            )
            })}
        </div>
      </Messages>
      <MessageForm id="form" onSubmit={(event) => { handleSubmit(event); }}>
        <MessageInput id="input" type="text" value={message} placeholder="Send a message" autoComplete="off" onChange={(event) => { setMessage(event.target.value); }} onKeyDown={(event) => onKeyDown(event)}/>
        <SendButtonWrapper>
          <BsFillArrowUpCircleFill size={40} onClick={(event) => { handleSubmit(event); }} />
        </SendButtonWrapper>
      </MessageForm>
    </ChatContainer>
  );
}

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 16vw;
  height: 90vh;
  margin-right: 55px;
  margin-top: 40px;
  background: #0D1317;
  border: 2px solid #000000;
  border-radius: 20px;
  box-shadow: 0px -1px 10px #738984;
`;
const Messages = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
  flex-grow: 1;
  max-height: 80vh;
  display: flex;
  flex-direction: column-reverse;
  overflow: auto;
`;
const Message = styled.div`
  background: #D9D9D9;
  border-radius: 10px;
  color: black;
  font-size: 20px;
  margin: 4px 8px 4px 8px;
  overflow-wrap: break-word;
  padding: 4px;
`;
const TimeStamp = styled.li`
  font-size: 14px;
`;
const MessageForm = styled.form`
  display: flex;
  flex-direction: row;
  margin: 16px 8px 8px 8px;
  position: relative;
  max-width: 70vw;
`;
const MessageInput = styled.textarea`
  background: #D9D9D9;
  border-radius: 10px;
  color: black;
  font-size: 24px;
  resize: none;
  flex-grow: 1;
  overflow: auto;
`;

const SendButtonWrapper = styled.div`
  color: #70CAD1;
  margin-top: 8px;
  cursor: pointer;
`;

const UserFace = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  overflow: auto;
  min-height: 15vh;
  background: #333;
  border: 2px solid #000000;
  border-radius: 20px;
  margin-top: 5px;
  margin-left: 2px;
  margin-right:2px
`;

const Bar = styled.div `
  display: flex;
  overflow: auto;
  min-height: 1vh;
  background: #333;
  border: 2px solid #000000;
  border-radius: 20px;
  margin-top: 5px;
  margin-left: 2px;
  margin-right:2px
`

const Face = styled.span `
  display: inline-block;
  width: 80px;
  height: 80px;
  background: #333;
  border: 2px solid #000000;
  border-radius: 50%;
  text-align: center;
  margin: 5px 5px 5px 5px;
`