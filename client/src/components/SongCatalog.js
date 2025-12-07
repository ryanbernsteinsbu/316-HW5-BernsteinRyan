import { useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { GlobalStoreContext } from '../store'
import YouTube from 'react-youtube';
import AuthContext from '../auth';
import SongEntry from './SongEntry.js';
import { Grid, Box, Typography, List, TextField, MenuItem } from "@mui/material";
import MUIDeleteSongModal from './MUIDeleteSongModal'
import MUIEditSongModal from './MUIEditSongModal';
export default function SongCatalog(){
    //Filters
    const location = useLocation();
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    const [filters, setFilters] = useState({
        title: "",
        artist: "",
        year: "",
    });
    const [sortOrder, setSortOrder] = useState("LISTENERS_HI_LO");
    const [songs, setSongs] = useState([]);
    const [selected, setSelected] = useState(null);
    useEffect(() => {store.loadIdNamePairs()},[])
    useEffect(() => {
        async function fetchFilteredPairs() {
            const query = {
                    songTitle : filters.title,
                    songArtist : filters.artist,
                    songYear : filters .year,
                    sortOrder : sortOrder
                };
            // console.log(query);
            const recievedSongs = await store.getSongs(query);
            setSongs([...recievedSongs]);
        }
        fetchFilteredPairs();
    }, [store.songMarkedForDeletion ,filters, sortOrder]);
    let modalJSX = "";
    if (store.isEditSongModalOpen()) {
        modalJSX = <MUIEditSongModal />;
    }
    let listCard = "";
    if (songs) {
        listCard = 
            <List sx={{width: '100%', bgcolor: 'background.paper', mb:"20px" }}>
            {
                songs.map((pair) => (
                    <SongEntry
                        key={pair._id}
                        song={pair}
                        onSelect={setSelected}
                    />
                ))
                
            }
            </List>;
    }
    return (
        <Grid container spacing={2} sx={{ height: "100vh", padding: 2, bgcolor:"background.paper"}}>
            {/* left */}
            <Grid item xs={12} md={4} sx={{ position: "relative", zIndex: 100 }}>
                <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
                    Songs
                </Typography>

            <TextField
                fullWidth
                label="by Song Title"
                value={filters.title}
                onChange={(e) => setFilters({ ...filters, title: e.target.value })}
                sx={{ mb: 2 }}
            />

            <TextField
                fullWidth
                label="by Song Artist"
                value={filters.artist}
                onChange={(e) => setFilters({ ...filters, artist: e.target.value })}
                sx={{ mb: 2 }}
            />

            <TextField
                fullWidth
                label="by Song Year"
                value={filters.year}
                onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                sx={{ mb: 2 }}
            />
            {selected && (
                <Box
                    sx={{
                        width: "100%",
                        position: "relative",
                        paddingTop: "56.25%",
                        mb: 2,
                    }}
                >
                    <Box
                        sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                        }}
                    >
                        <YouTube
                            videoId={selected}
                            opts={{ width: "100%", height: "100%", playerVars: {origin: window.location.origin},}}
                        />
                    </Box>
                </Box>
            )}
            </Grid>
            {/* right */}
            <Grid item xs={12} md={8} sx={{ position: "relative", zIndex: 2 }}>
            <TextField
                select
                size="small"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                sx={{ width: 200 }}
            >
                <MenuItem value="LISTENERS_HI_LO">Listeners (Hi-Lo)</MenuItem>
                <MenuItem value="LISTENERS_LO_HI">Listeners (Lo-Hi)</MenuItem>
                <MenuItem value="NAME_A_Z">Playlist Name (A-Z)</MenuItem>
                <MenuItem value="NAME_Z_A">Playlist Name (Z-A)</MenuItem>
            </TextField>
                <Box sx={{bgcolor:"background.paper", maxHeight: 550, overflowY: "auto"}} >
                    {
                        listCard
                    }
                </Box>
                <MUIDeleteSongModal/>
                {modalJSX}
            </Grid>
        </Grid>
    );
}

