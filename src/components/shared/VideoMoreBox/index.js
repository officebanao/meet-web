import {
  Avatar,
  Box,
  makeStyles,
  Tooltip,
  Typography,
} from "@material-ui/core";
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import React, { useEffect, useState } from "react";
import { color } from "../../../assets/styles/_color";
import Video from "../Video";
import Audio from "../Audio";
import PanTool from "@material-ui/icons/PanTool";
import { useDispatch, useSelector } from "react-redux";
import MicIcon from "@material-ui/icons/Mic";
import MicOffIcon from "@material-ui/icons/MicOff";
import { setPinParticipant } from "../../../store/actions/layout";
import PinParticipant from "../PinParticipant";
import classnames from "classnames";
import { videoShadow, calculateSteamHeightAndExtraDiff } from "../../../utils";
import AudioLevelIndicator from "../AudioIndicator";
import SubTitle from "../SubTitle";
import { useDocumentSize } from "../../../hooks/useDocumentSize";
import { profile } from "../../../store/reducers/profile";

const VideoMoreBox = ({
  participantTracks,
  participantDetails,
  localUserId,
  width,
  height,
  isPresenter,
  isActiveSpeaker,
  isFilmstrip,
  isLargeVideo,
  isTranscription,
  numParticipants,
  others,
  participantsArray
}) => {
    
  const useStyles = makeStyles((theme) => ({
    root: {
      position: "relative",
      overflow: "hidden",
      borderRadius: "8px",
      background: color.secondary,
      display: "flex",
      flexDirection: "column",
      transform: "translateZ(0)",
      "& .largeVideo": {
        height: theme.spacing(20),
        width: theme.spacing(20),
        fontSize: "40pt",
      },
      [theme.breakpoints.down("sm")]: {
          background: numParticipants ? color.secondary : "transparent",
      },
    },
    audioBox: {
      background: numParticipants ? color.secondary : "transparent",
      position: "absolute",
      top: 0,
      display: "flex",
      justifyContent: "flex-end",
      padding: theme.spacing(1),
      color: color.white,
      "& svg": {
        background: color.secondaryDark,
        borderRadius: "50%",
        padding: "5px",
      },
      [theme.breakpoints.down("sm")]: {
        padding: theme.spacing(0.25, 1, 1, 0.25),
      },
    },
    controls: {
      cursor: "pointer",
      color: "white",
      height: "20px",
      width: "20px",
      position: "absolute",
      margin: "auto",
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      padding: "8px",
    },
    videoBorder: {
      boxSizing: "border-box",
      border: `3px solid ${color.primaryLight}`,
      borderRadius: "8px",
      position: "absolute",
      width: "100%",
      height: "100%",
      zIndex: "999",
    },
    textBox: {
      //bottom: 0,
      padding: theme.spacing(1),
      color: color.white,
      background: "transparent",
      "& p": {
        padding: "2px 4px",
      },
    },
    avatarBox: {
      height: "100%",
      width: "100%",
      borderRadius: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexGrow: 1,
      flexDirection: 'column',
    },
    avatar: {
      //borderRadius: "50%",
      //position: "absolute",
      transition: "box-shadow 0.3s ease",
      height: theme.spacing(5),
      width: theme.spacing(5),
    },
    rightControls: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "absolute",
      padding: theme.spacing(1),
      right: 0,
      zIndex: "9999",
    },
    handRaise: {
      marginLeft: "8px",
      color: color.primary,
      lineHeight: "0!important",
    },
    disable: {
      background: color.red,
      borderColor: `${color.red} !important`,
      "&:hover": {
        opacity: "0.8",
        background: `${color.red} !important`,
      },
    },
    subtitle: {
      position: "absolute",
      bottom: 0,
    },
    videoWrapper: {
      position: "absolute",
      right: 0,
      left: 0,
      top: 0,
      bottom: 0,
      margin: "auto",
    },
  }));
  const classes = useStyles();
  const { pinnedParticipant, raisedHandParticipantIds } = useSelector(
    (state) => state.layout
  );
  let videoTrack = isPresenter
    ? participantTracks?.find((track) => track.getVideoType() === "desktop")
    : participantTracks?.find((track) => track.getType() === "video");
  if (isLargeVideo && pinnedParticipant.isPresenter === false) {
    videoTrack = participantTracks?.find(
      (track) => track.getType() === "video"
    );
  }
  const audioTrack = participantTracks?.find((track) => track.isAudioTrack());
  const audioIndicator = useSelector((state) => state.audioIndicator);
  const dispatch = useDispatch();
  const [visiblePinParticipant, setVisiblePinPartcipant] = useState(true);
  let audioLevel = audioIndicator[participantDetails?.id];
  const subtitle = useSelector((state) => state.subtitle);
  const conference = useSelector((state) => state.conference);
  const { documentWidth, documentHeight } = useDocumentSize();

  const togglePinParticipant = (id) => {
    dispatch(setPinParticipant(id, isPresenter));
  };

  const audioIndicatorActiveClasses = classnames(classes.avatar, {
    largeVideo: isLargeVideo,
  });

  const avatarActiveClasses = classnames(classes.avatarBox);
  const { videoStreamHeight, videoStreamDiff } =
    calculateSteamHeightAndExtraDiff(
      width,
      height,
      documentWidth,
      documentHeight,
      isPresenter,
      isActiveSpeaker
    );
  let avatarColor = participantDetails?.avatar || profile?.color;
  let remainingParticipantsArray = participantsArray?.length>3 && participantsArray?.slice(3);
  

  return (
    <Box
      style={{ width: `${width}px`, height: `${height}px` }}
      className={classes.root}
    > 
        <Box className={avatarActiveClasses}>
        <AvatarGroup max={4}>
          {remainingParticipantsArray.map((avatar,index) => (
          <Avatar
          src={avatar?.name?.slice(0, 1)?.toUpperCase()}
          style={
            isFilmstrip
              ? {
                  // boxShadow: videoShadow(audioLevel),
                  background: avatarColor,
                }
              : { background: avatarColor }
          }
          className={audioIndicatorActiveClasses}
          key={index}
        >
          {avatar?.name?.slice(0, 1)?.toUpperCase()}
        </Avatar>
          ))}
          </AvatarGroup>
          <Typography style={{marginTop: '16px', color: color.white}}>
          {others}{"+ "}{" others"}
        </Typography>
        </Box>
    </Box>
  );
};

export default VideoMoreBox;
