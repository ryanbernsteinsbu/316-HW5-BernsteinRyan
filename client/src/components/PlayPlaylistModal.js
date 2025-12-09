import { useContext, useState, useEffect } from 'react'
import GlobalStoreContext from '../store';
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import ActionButton from './ActionButton.js'

const style1 = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 900,
    height: 600,
    backgroundColor: '#FFFFFF',
    border: '3px solid #000',
    padding: '20px',
    boxShadow: 24,
    display: 'flex',
    flexDirection: 'column'
}
export default function PlayPlaylistModal() {
    const { store } = useContext(GlobalStoreContext);
    const open = store.currentModal === "PLAYER";
    const playlist = store.currentList;

    const [currentSong, setCurrentSong] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [isPlaying, setIsPlaying] = useState(true);

    
    function handlePlayPause() {
        setIsPlaying(!isPlaying);
    }

    function handleSelectSong(index) {
        setCurrentIndex(index);
        setCurrentSong(playlist?.songs?.[index]);
    }
    function handleNext() {
        if (!playlist?.songs?.length) return;

        const nextIndex = (currentIndex + 1) % playlist.songs.length;

        setCurrentIndex(nextIndex);
        setCurrentSong(playlist.songs[nextIndex]);
    }
    function handlePrev() {
        if (!playlist?.songs?.length) return;

        const prevIndex = currentIndex === 0 ? playlist.songs.length - 1 : currentIndex - 1;

        setCurrentIndex(prevIndex);
        setCurrentSong(playlist.songs[prevIndex]);
    }


    function handleClose(event) {
        store.hideModals();
    }

    return (
        <Modal open={open}>
            <Box sx={style1}>

                <Box sx={{ 
                    width: "100%", 
                    background: "#b6ffc1",
                    padding: "8px",
                    fontWeight: "bold",
                    fontSize: "20px"
                }}>
                    Play Playlist
                </Box>
        <Box sx={{ display: "flex", height: "100%", marginTop: 1 }}>

        {/*LEFT*/}
                    <Box sx={{ 
                        width: "50%", 
                        border: "3px solid #000000", 
                        marginRight: "10px",
                        display: "flex",
                        flexDirection: "column",
                        height: 555
                    }}>
                        
                        <Box sx={{ padding: "10px" }}>
                            <Typography variant="h6">
                                {playlist?.name}
                            </Typography>
                            <Typography variant="subtitle2">
                                {playlist?.ownerEmail}
                            </Typography>
                        </Box>

                        <Box sx={{
                            overflowY: "auto",
                            flexGrow: 1,
                            padding: "10px"
                        }}>
                            {playlist?.songs?.map((song, index) => (
                                <Box
                                    key={song._id}
                                    onClick={() => handleSelectSong(index)}
                                    sx={{
                                        padding: "8px",
                                        marginBottom: "8px",
                                        border: "2px solid #d8d8d8",
                                        borderRadius: "4px",
                                        backgroundColor: currentSong?._id === song._id ? "#ffeb90" : "#fff",
                                        cursor: "pointer",
                                    }}
                                >
                                    {index + 1}. {song.title} by {song.artist} ({song.year})
                                </Box>
                            ))}
                        </Box>
        </Box>
                            {/*RIGHT*/}
                    <Box sx={{ 
                        width: "50%", 
                        background: "#b6ffc1",
                        padding: "10px",
                        display: "flex",
                        flexDirection: "column",
                        height: 540
                    }}>

                        {/* PLAYER */}
                        <Box sx={{ width: "100%", aspectRatio: "16 / 9", }}>
                            {currentSong ? (
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={
                                        isPlaying
                                        ? `https://www.youtube.com/embed/${currentSong.youTubeId}?autoplay=1`
                                        : `https://www.youtube.com/embed/${currentSong.youTubeId}?autoplay=0`
                                    }
                                    title="YouTube player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                ></iframe>
                            ) : (
                                <Typography sx={{ padding: 2 }}>
                                    Select a song to begin playing
                                </Typography>
                            )}
                        </Box>

                        {/* CONTROLS */}
                        <Box sx={{
                            display: "flex",
                            justifyContent: "center",
                            marginTop: "20px"
                        }}>
                            <Button variant="outlined" onClick={handlePrev}>⏮</Button>
                            <Button variant="outlined" onClick={handlePlayPause} sx={{ mx: 2 }}>⏯</Button>
                            <Button variant="outlined" onClick={handleNext}>⏭</Button>
                        </Box>

                        {/* CLOSE BUTTON */}
                        <Button
                            onClick={handleClose}
                            sx={{
                                marginTop: "auto",
                                backgroundColor: "#FFF",
                                border: "2px solid #000",
                                width: "120px",
                                alignSelf: "center"
                            }}
                        >
                            Close
                        </Button>



                        </Box>

                    </Box>

                </Box>

        </Modal>
    );
}
