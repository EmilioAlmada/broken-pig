import { AppBar, Box, CircularProgress, IconButton, MenuItem, Typography } from "@mui/material"
import pig from '../../public/pig.svg'
import { useAuthContext } from "../Auth/AuthProvider"
import { useNavigate } from "react-router-dom"

const Header = () => {
    const navigate = useNavigate()
    const { authUser } = useAuthContext()
    if (!authUser) return <CircularProgress />
    return (
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Box display='flex' justifyContent='space-between' alignItems='center' gap={1} margin={1}>
                <Box display='flex' justifyContent='center' gap={2} alignItems='center'>
                    <img width={'40em'} style={{}} src={pig} />
                    <Typography variant="h7">Broken Pig</Typography>
                </Box>
                {authUser && <MenuItem onClick={() => navigate('/profile')}><Typography>{`${String(authUser.name).toUpperCase()} ${String(authUser.lastName).toUpperCase()}`}</Typography></MenuItem>}
            </Box>
        </AppBar>
    )
}

export default Header