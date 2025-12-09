import { useContext, useState, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function SongEntry(props) {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    const { song, onSelect, } = props;
    const [anchorEl, setAnchorEl] = useState(null);
    const menuOpen = Boolean(anchorEl);
    const handleOpenMenu = (event) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleAddToPlaylist = (playlistId) => {
        handleCloseMenu();
        store.addSongToPlaylist(song._id, playlistId)
        console.log("adding song");
    };
    useEffect(() => {
        // auth.getLoggedIn();
    }, []);


    function handleToggleEdit(event) {
        event.stopPropagation();
        toggleEdit();
    }

    function toggleEdit() {
        store.showEditSongModal(song);
    }

    async function handleDeleteList(event) {
        event.stopPropagation();
        store.markSongForDeletion(song._id);
    }

    let cardElement =
 <Box sx={{ width: "100%" }}>
        <ListItem
            id={song._id}
            key={song._id}
            sx={{borderRadius:"25px", p: "10px", bgcolor: '#8000F00F', marginTop: '15px', display: 'flex', /*p: 1*/ }}
            style={{transform:"translate(1%,0%)", width: '98%', fontSize: '12pt' }}
            button
        >
        <Box sx={{ p: 1, flexGrow: 1 }}>
            <Typography >
                {song.title} by {song.artist} ({song.year})
            </Typography>

            <Typography sx={{ fontSize: "0.8rem", color: "text.secondary", mt: 0.3 }}>
                {song.listens} listeners
            </Typography>
        </Box>
        {true && (
            <Box sx={{ p: 1 }}>
            <IconButton onClick={() => {onSelect(song.youTubeId)}} aria-label='play'>
            <PlayArrowIcon style={{fontSize:'24pt'}} />
            </IconButton>
            </Box>
        )}
        {auth.loggedIn && (
            <Box sx={{ p: 1 }}>
                <IconButton onClick={handleOpenMenu} aria-label='add'>
                    <AddIcon style={{ fontSize: '24pt' }} />
                </IconButton>

                <Menu
                    anchorEl={anchorEl}
                    open={menuOpen}
                    onClose={handleCloseMenu}
                >
                    {store.idNamePairs && store.idNamePairs.map(pair => (
                        <MenuItem
                            key={pair._id}
                            onClick={() => handleAddToPlaylist(pair._id)}
                        >
                            {pair.name}
                        </MenuItem>
                    ))}
                </Menu>
            </Box>
        )} 
        {(auth.loggedIn && auth.user.email === song.ownerEmail) && (
            <Box sx={{ p: 1 }}>
            <IconButton onClick={handleToggleEdit} aria-label='edit'>
            <EditIcon style={{fontSize:'24pt'}} />
            </IconButton>
            </Box>
        )}
        {(auth.loggedIn && auth.user.email === song.ownerEmail) && (
            <Box sx={{ p: 1 }}>
                <IconButton onClick={(event) => {
                        handleDeleteList(event, song._id)
                    }} aria-label='delete'>
                    <DeleteIcon style={{fontSize:'24pt'}} />
                </IconButton>
            </Box>
        )}
        </ListItem>
    </Box>;
    return (
        cardElement
    );
}

export default SongEntry;
