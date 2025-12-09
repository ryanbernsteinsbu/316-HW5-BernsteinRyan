import { useContext, useState, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function PlaylistCard(props) {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    const [editActive, setEditActive] = useState(false);
    const [text, setText] = useState("");
    const [expanded, setExpanded] = useState(false);
    const { idNamePair , play} = props;

    useEffect(() => {
        auth.getLoggedIn();
    }, []);

    function handleLoadList(event, id) {
        console.log("handleLoadList for " + id);
        if (!event.target.disabled) {
            let _id = event.target.id;
            if (_id.indexOf('list-card-text-') >= 0)
                _id = ("" + _id).substring("list-card-text-".length);

            console.log("load " + event.target.id);

            // CHANGE THE CURRENT LIST
            store.setCurrentList(id);
        }
    }
    function handlePlay(event){
        event.stopPropagation();
        play();
    }
    function handleToggleEdit(event) {
        event.stopPropagation();
        toggleEdit();
    }

    function toggleEdit() {
        let newActive = !editActive;
        if (newActive) {
            store.setIsListNameEditActive();
        }
        setEditActive(newActive);
    }

    async function handleDeleteList(event, id) {
        event.stopPropagation();
        //let _id = event.target.id;
        //_id = ("" + _id).substring("delete-list-".length);
        store.markListForDeletion(id);
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            let id = event.target.id.substring("list-".length);
            store.changeListName(id, text);
            toggleEdit();
        }
    }
    function handleUpdateText(event) {
        setText(event.target.value);
    }
    function toggleExpand(event) {
        event.stopPropagation();
        setExpanded(!expanded);
    }
    let cardElement =
 <Box sx={{ width: "100%" }}>
        <ListItem
            id={idNamePair._id}
            key={idNamePair._id}
            sx={{borderRadius:"25px", p: "10px", bgcolor: '#8000F00F', marginTop: '15px', display: 'flex', /*p: 1*/ }}
            style={{transform:"translate(1%,0%)", width: '98%', fontSize: '24pt' }}
            button
            onClick={(event) => {
                handleLoadList(event, idNamePair._id)
            }}
        >
        <Box sx={{ p: 1, flexGrow: 1 }}>{idNamePair.name} [{idNamePair.ownerName}]</Box>
        {true && (
            <Box sx={{ p: 1 }}>
            <IconButton onClick={handlePlay} aria-label='play'>
            <PlayArrowIcon style={{fontSize:'24pt'}} />
            </IconButton>
            </Box>
        )}
        {(auth.loggedIn && auth.user.email === idNamePair.ownerEmail) && (
            <Box sx={{ p: 1 }}>
            <IconButton onClick={handleToggleEdit} aria-label='edit'>
            <EditIcon style={{fontSize:'24pt'}} />
            </IconButton>
            </Box>
        )}
        {(auth.loggedIn && auth.user.email === idNamePair.ownerEmail) && (
            <Box sx={{ p: 1 }}>
                <IconButton onClick={(event) => {
                        handleDeleteList(event, idNamePair._id)
                    }} aria-label='delete'>
                    <DeleteIcon style={{fontSize:'24pt'}} />
                </IconButton>
            </Box>
        )}

            <Box sx={{ p: 1 }}>
                <IconButton onClick={(event) => {
                        toggleExpand(event);
                    }} aria-label='expand'>
                    {expanded ? <ExpandLessIcon/> : <ExpandMoreIcon/>}
                </IconButton>
            </Box>
        </ListItem>
        {expanded && idNamePair.sample?.length >0 && (
            <Box sx={{
                bgcolor: "#f5f5f5",
                    mx: 4,
                    mt: 1,
                    p: 2,
                    borderRadius: "15px"
            }}>
            {idNamePair.sample.map((song, index) => (
                <Typography key={index}>
                    {index + 1}. {song.title} by {song.artist} ({song.year})
                </Typography>
            ))}
            </Box>
        )}
    </Box>
    if (editActive) {
        cardElement =
            <TextField
                margin="normal"
                required
                fullWidth
                id={"list-" + idNamePair._id}
                label="Playlist Name"
                name="name"
                autoComplete="Playlist Name"
                className='list-card'
                onKeyPress={handleKeyPress}
                onChange={handleUpdateText}
                defaultValue={idNamePair.name}
                inputProps={{style: {fontSize: 48}}}
                InputLabelProps={{style: {fontSize: 24}}}
                autoFocus
            />
    }
    return (
        cardElement
    );
}

export default PlaylistCard;
