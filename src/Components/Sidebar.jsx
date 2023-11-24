import { AccountBalanceWallet, CurrencyExchange, Home, Logout, Person } from "@mui/icons-material"
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material"
import { useNavigate } from "react-router-dom"

const Sidebar = () => {
    const navigate = useNavigate()
    const handleLogOut = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/login')
    }
    return (
        <Drawer
            sx={{
                width: 240,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: 240, marginTop: 7, boxSizing: 'border-box' },
            }}
            anchor="left"
            variant="permanent"
            style={{
                backgroundColor:'AppWorkspace'
            }}
        >
            <List>
                <ListItem className="sidebar_item" style={{  borderTop:'1px solid'}} onClick={() => navigate('/')}>
                    <ListItemIcon><AccountBalanceWallet /></ListItemIcon>
                    <ListItemText primary="Balance" />
                </ListItem>
                <ListItem className="sidebar_item" style={{  borderTop:'1px solid'}} onClick={() => navigate('/profile')}>
                    <ListItemIcon><Person /></ListItemIcon>
                    <ListItemText primary="Perfil" />
                </ListItem>
                <ListItem className="sidebar_item" style={{  borderTop:'1px solid'}} onClick={() => navigate('/transactions')}>
                    <ListItemIcon><CurrencyExchange /></ListItemIcon>
                    <ListItemText primary="Transferencias" />
                </ListItem>
                <ListItem className="sidebar_item" style={{  borderTop:'1px solid', borderBottom:'1px solid'}} onClick={() => handleLogOut()}>
                    <ListItemIcon><Logout /></ListItemIcon>
                    <ListItemText primary="Salir" />
                </ListItem>
            </List>
        </Drawer>
    )
}

export default Sidebar