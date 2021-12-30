import { AppBar, Toolbar, Typography, makeStyles, Menu, MenuItem, IconButton, Badge, Button } from "@material-ui/core"
import { ShoppingCart, AccountCircle } from "@material-ui/icons"
import React, { useState } from "react"
import { Link, useHistory, useLocation } from "react-router-dom"
import { useAuth, useAuthActions, useTransactions } from '../Context/AuthContext'


const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1,
    },
    brand: {
        fontFamily: 'Montez, cursive',
        textDecoration: 'none',
        color: 'white',
        fontWeight: '500',
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
        '&:hover': {
            textDecoration: 'none',
            color: 'black'
        }
    },
    button: {
        margin: "2px",
        color: 'white',
        '&:hover': {
            color: 'black',
            textDecoration: 'none',
            backgroundColor: 'white',
        },
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    }
}))

const Navbar = () => {    
    const classes = useStyles()
    const history = useHistory()   
    const location = useLocation() 
    const user = useAuth()
    const { logout } = useAuthActions()
    const { cart } = useTransactions()
    const [anchorEl, setAnchorEl] = useState(null)
    const isOpen = Boolean(anchorEl)
    
    if(location.pathname === '/admin') return null

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    }

    const handleMenuClose = () => {
        setAnchorEl(null)
    }

    const handleLogout = () => {
        logout()
        if(location.pathname !== "/") history.push("/")
    }

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            getContentAnchorEl={null}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={menuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isOpen}
            onClose={handleMenuClose}
        >
            <MenuItem component={Link} to='/profile'>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Log out</MenuItem>
        </Menu>
    )

    return (
        <div className={classes.grow}>
            <AppBar position="fixed">
                <Toolbar>
                    <Typography className={classes.brand} variant="h4" component={Link} to="/">Epeolatry</Typography>
                    <div className={classes.grow} />
                    {user ? 
                        (<div className={classes.sectionDesktop}>
                            <IconButton component={Link} to="/cart" aria-label="show cart" color="inherit">
                                <Badge badgeContent={cart ? cart.length: 0} color="secondary">
                                    <ShoppingCart />
                                </Badge>
                            </IconButton>
                            <IconButton
                                edge="end"
                                aria-label="account of current user"
                                aria-controls={menuId}
                                aria-haspopup="true"
                                onClick={handleProfileMenuOpen}
                                color="inherit"
                            >
                                <AccountCircle />
                            </IconButton>
                        </div>)
                        :
                        (<div className={classes.sectionDesktop}>
                            <Button variant="outlined" className={classes.button} href="/signup">Sign Up</Button>
                            <Button variant="outlined" className={classes.button} href="/login">Log In</Button>
                        </div>)
                    }
                </Toolbar>
            </AppBar>
            {renderMenu}
        </div>
    )
}

export default Navbar
