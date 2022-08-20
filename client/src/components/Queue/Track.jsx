import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";

export default function Track({ track, username, token }) {
  const [likeCount, setLikeCount] = useState("");
  const [dislikeCount, setDislikeCount] = useState("");
  const [likeStatus, setLikeStatus] = useState(false);
  const [dislikeStatus, setDislikeStatus] = useState(false);


  useEffect(() => {
    axios.get("/findLikes", { params: { uri: track.uri } })
      .then((response) => {
        console.log("response for get likes: ", response.data);
        setLikeCount(response.data.likes);
        setDislikeCount(response.data.dislikes);
      })
      .catch((err) => {
        console.log('error geting likes', err);
      });
    console.log("testing useEffect change");
  }, []);

  const handleLike = (button) => {
    const params = {
      user: username,
      action: button,
      uri: track.uri,
    };
    axios.put(`/action/${track.uri}`, params)
      .then((response) => {
        console.log('put axios response.data', response.data);
        setLikeCount(response.data.likes);
        setDislikeCount(response.data.dislikes);
      })
      .catch((err) => {
        console.log("error liking track", err);
      });
    if (button === "like") {
      setLikeStatus(true);
      console.log("changed like status");
    } else {
      setDislikeStatus(true);
    }
  };

  return (
    <div>
      <SongContainer>
        <SongImage src={track.songImg} />
        <InnerContainer>
          <SongName>{track.songName}</SongName>
          <ArtistName>{track.artist}</ArtistName>
          <BottomContainer>
          <AddedBy>Added By: {username}</AddedBy>
          <ThumbsContainer>
            <LikesContainer>
              <ThumbsUp onClick={() => handleLike("like")} />
              <Count>{likeCount}</Count>
            </LikesContainer>
            <LikesContainer>
              <ThumbsDown onClick={() => handleLike("dislike")} />
              <Count>{dislikeCount}</Count>
            </LikesContainer>
          </ThumbsContainer>
          </BottomContainer>
        </InnerContainer>
      </SongContainer>
    </div>
  );
}

const AddedBy = styled.div`
margin-top: 5px;
font-size: 10px;
color: white;
`

const BottomContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 160px;
`;

const ThumbsContainer = styled.div`
  display: flex;
`;

const LikesContainer = styled.div`
  display: flex;
  margin: 2px;
`;

const Count = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 11px;
  height: 10px;
  width: 10px;
  // border: 1px solid black;
  // border-radius: 50%;
  color: black;
`;

const SongContainer = styled.div`
  border: 1px solid black;
  border-radius: 10px;
  display: flex;
  margin: 10px 10px 0px 10px;
  background-color: #1F7A8C;

`;

const InnerContainer = styled.div`
  margin-top: 10px;
`;
const SongName = styled.div`
color: white;
font-size: 20px;
`;

const ArtistName = styled.div`
font-size: 14px;
color: #b1a7a796;
`;

const SongImage = styled.img`
  height: 60px;
  width: 60px;
  margin: 10px;
  border-radius: 10px;
  border: 2px solid black
`;

const ThumbsUp = styled(FaThumbsUp)`
  height: 15px;
  width: 15px;
  color: black;
  cursor: pointer;
  &:hover {
    color: #b1a7a796;
  };
`;

const ThumbsDown = styled(FaThumbsDown)`
  height: 15px;
  width: 15px;
  color: black;
  cursor: pointer;
  &:hover {
    color: #b1a7a796;
  };
`;
