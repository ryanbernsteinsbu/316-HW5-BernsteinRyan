import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ActionButton from './ActionButton.js';
import { useHistory } from 'react-router-dom'

export default function SplashScreen() {
    const history = useHistory();
    function handleLogin(event){
        history.push("/login/");
    }
    function handleGuest(event){
        history.push("/playlists/");
    }
    function handleRegister(event){
        history.push("/register/");
    }
    return (
        <div id="splash-screen">
            <div>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 600,
                  color: "#444",
                  mt: 4,
                }}
              >
                The Playlister
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  gap: 3,
                  mb: 4,
                  justifyContent: "center",
                }}
              >
                <ActionButton onClick={handleGuest}>
                    Continue as Guest
                </ActionButton>

                <ActionButton onClick={handleLogin}>
                    Login
                </ActionButton>

                <ActionButton onClick={handleRegister}>
                    Create Account
                </ActionButton>
                </Box>
            </div>            
        </div>
    )
}
