import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ActionButton from './ActionButton.js';

export default function SplashScreen() {
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
                <ActionButton>
                    Continue as Guest
                </ActionButton>

                <ActionButton>
                    Login
                </ActionButton>

                <ActionButton>
                    Create Account
                </ActionButton>
                </Box>
            </div>            
        </div>
    )
}
