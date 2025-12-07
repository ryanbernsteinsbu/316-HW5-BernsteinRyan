import { useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth';
import PlaylistCard from './PlaylistCard.js'
import { Grid, Box, Typography, List, TextField, MenuItem } from "@mui/material";
import MUIDeleteModal from './MUIDeleteModal'
export default function PlaylistScreen(){
    //Filters
    const location = useLocation();
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    const [filters, setFilters] = useState({
        name: "",
        user: "",
        title: "",
        artist: "",
        year: "",
    });
    //order
    const [sortOrder, setSortOrder] = useState("listeners-desc");
    //playlists
    const [playlists, setPlaylists] = useState([]);

    useEffect(() => {
        async function fetchFilteredPairs() {
            const query = {
                    playlistName : filters.name,
                    userName : filters.user,
                    songTitle : filters.title,
                    songArtist : filters.artist,
                    songYear : filters .year,
                    sortOrder : sortOrder
                };
            console.log(query);
            const queriedIdNamePairs = await store.queryPlaylistPairs(query);
            // console.log(queriedIdNamePairs); // This is the resolved array
            setPlaylists([...queriedIdNamePairs]);
            // if(auth.loggedIn && JSON.stringify(filters) === JSON.stringify({
            //     name: "",
            //     user: "",
            //     title: "",
            //     artist: "",
            //     year: "",
            // })){
            //     store.loadIdNamePairs();
            //     setPlaylists([...store.idNamePairs]);
            // }
        }
        fetchFilteredPairs();
    }, [filters, sortOrder]);
    
    // useEffect(() => {
    // }, [auth.loggedIn, location ]);

    let listCard = "";
    if (playlists) {
        listCard = 
            <List sx={{width: '100%', bgcolor: 'background.paper', mb:"20px" }}>
            {
                playlists.map((pair) => (
                    <PlaylistCard
                        key={pair._id}
                        idNamePair={pair}
                        selected={false}
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
                    Playlists
                </Typography>
            <TextField
                fullWidth
                label="by Playlist Name"
                value={filters.name}
                onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                sx={{ mb: 2 }}
            />

            <TextField
                fullWidth
                label="by User Name"
                value={filters.user}
                onChange={(e) => setFilters({ ...filters, user: e.target.value })}
                sx={{ mb: 2 }}
            />

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
                <Box sx={{bgcolor:"background.paper"}} >
                    {
                        listCard
                    }
                </Box>
                <MUIDeleteModal/>
            </Grid>
        </Grid>
    );
}
