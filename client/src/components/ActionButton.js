import { Button } from "@mui/material";

export default function ActionButton({ children, color = "#333", ...props }) {
    return (
        <Button
            variant="contained"
            sx={{
                background: color,
                    "&:hover": { background: color },
                    px: 3,
                    borderRadius: 2,
                    textTransform: "none",
            }}
                {...props}
            >
                {children}
        </Button>
    );
}
