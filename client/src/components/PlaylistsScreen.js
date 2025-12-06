import { useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import PlaylistCard from './PlaylistCard.js'
import { Grid, Box, Typography } from "@mui/material";
import SearchFilters from "./SearchFilters";
import SortBar from "./SortBar";
import PlaylistList from "./PlaylistList";

export default function PlaylistScreen(){
    //Filters
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
        //send a query and update playlists
    }, [filters, sortOrder]);
    
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
            <Fab sx={{transform:"translate(1150%, 10%)"}}
                color="primary" 
                aria-label="add"
                id="add-list-button"
                onClick={handleCreateNewList}
            >
                <AddIcon />
            </Fab>
            </List>;
    }
    return (
        <Grid container sx={{ height: "100vh", padding: 2 }}>
            {/* LEFT COLUMN */}
            <Grid item xs={12} md={4}>
                <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
                    Playlists
                </Typography>

                <SearchFilters filters={filters} setFilters={setFilters} />
            </Grid>

            {/* RIGHT COLUMN */}
            <Grid item xs={12} md={8}>
                <SortBar sortOrder={sortOrder} setSortOrder={setSortOrder} />

                <PlaylistList playlists={playlists} />
            </Grid>
        </Grid>
    );
}
