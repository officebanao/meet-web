import React, { useState} from 'react';
import { Box, makeStyles, Grid } from '@material-ui/core'
import { useSelector } from "react-redux";
import VideoBox from "../VideoBox";
import { calculateRowsAndColumns, getLeftTop } from "../../../utils";
import { useWindowResize } from "../../../hooks/useWindowResize";
import { useChain, useSprings, animated, to as interpolate } from '@react-spring/web'
import { useDrag } from 'react-use-gesture'

const ParticipantGrid = ({ dominantSpeakerId }) => {
    const layout = useSelector(state => state.layout);
    const useStyles = makeStyles((theme) => ({
        root: {
            justifyContent: "center",
            display: "flex",
            flexDirection: "row",
            alignItems: "center"
        },
        container: {
            position: "relative"
        },
        containerItem: {
            position: "absolute",
            width: "100%",
            height: "100%"
        }
    }));

    let { viewportWidth, viewportHeight } = useWindowResize();
    const classes = useStyles();
    const conference = useSelector(state => state.conference);
    const localTracks = useSelector(state => state.localTrack);
    const remoteTracks = useSelector(state => state.remoteTrack);
    const localUser = conference.getLocalUser();
    //merge local and remote track
    const tracks = { ...remoteTracks, [localUser.id]: localTracks };
    // merge local and remote participant
    const participants = [...conference.getParticipantsWithoutHidden(), { _identity: { user: localUser }, _id: localUser.id }];

    const {
        rows,
        columns,
        gridItemWidth,
        gridItemHeight,
        offset,
        lastRowOffset,
        lastRowWidth
    } = calculateRowsAndColumns(conference.getParticipantCount() - 1 , viewportWidth, viewportHeight); // get grid item dimension
    // now render them as a grid
// These two are just helpers, they curate spring data, values that are later being interpolated into css
    const to = (i) => ({
        x: 0,
        y: i * -4,
        scale: 1,
        rot: 360,
        delay: i * 80,
    })
    
    const from = (_i) => ({ x: 0, rot: 0, scale: 1.5, x: 2000 })
    // This is being used down there in the view, it interpolates rotation and scale into a css transform
    const trans = (r, s) =>
    `rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(${s})`
    
    const [props, api] = useChain(conference.getParticipantCount(), i => ({
      ...to(i),
      from: from(i),
    })) // Create a bunch of springs using the helpers above
    return (
        <Box className={classes.root}>
            <animated.div className={classes.container} style={{ height: viewportHeight, width: viewportWidth }} container item>
                {[...Array(rows)].map((x, i) =>
                    <>
                        {[...Array(columns)].map((y, j) => {
                            return (tracks[participants[i * columns + j]?._id] || participants[i * columns + j]?._id) &&
                                <animated.div  key={ i * columns + j } style={{ 
                                    position: "absolute",
                                    x: props[i *columns + j].x, 
                                    y: props[ i *columns + j].y,
                                    left: getLeftTop(i, j, gridItemWidth, gridItemHeight, offset, lastRowOffset, rows, conference.getParticipantCount(), viewportHeight, lastRowWidth).left, 
                                    top: getLeftTop(i, j, gridItemWidth, gridItemHeight, offset, lastRowOffset, rows, conference.getParticipantCount(), viewportHeight, lastRowWidth).top, 
                                    width: rows === (i - 1) && lastRowWidth ? lastRowWidth : gridItemWidth,
                                    height: gridItemHeight
                                }}>
                                    <animated.div  
                                        className={classes.containerItem} style={{ 
                                            transform: interpolate([ props[ i *columns + j].rot, props[ i *columns + j].scale], trans),
                                        }}
                                        >
                                        <VideoBox key={i * columns + j}
                                            height={gridItemHeight}
                                            width={(rows - 1) === i && lastRowWidth ? lastRowWidth : gridItemWidth}
                                            isBorderSeparator={participants.length > 1}
                                            isFilmstrip={true}
                                            isPresenter={layout.presenterParticipantIds.find(item => item === participants[i * columns + j]._id)}
                                            isActiveSpeaker={dominantSpeakerId === participants[i * columns + j]._id}
                                            participantDetails={participants[i * columns + j]?._identity?.user}
                                            participantTracks={tracks[participants[i * columns + j]._id] || []}
                                            localUserId={conference.myUserId()}
                                        />
                                    </animated.div>
                                </animated.div>
                            }
                        )}
                    </>
                )}
            </animated.div>
        </Box>
    );
}

export default ParticipantGrid;
