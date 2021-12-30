import React, { useState, useEffect } from 'react'
import { Container, Grid, makeStyles, Typography, Button } from '@material-ui/core'
import { Link } from 'react-router-dom';
import { useTransactions } from "../Context/AuthContext";
import CartItem from './CartItem';

const useStyles = makeStyles((theme) => ({
    toolbar: theme.mixins.toolbar,
    title: {
      marginTop: '3%',
    },
    checkoutButton: {
      minWidth: '150px',
      background: '#1C2331',
      color: 'white',
      height: '40px',
      
    '&:hover': {
        backgroundColor: '#2a344a',
        boxShadow: 'none',
        color: 'white',    
      },
    },
    link: {
      textDecoration: 'none',
    },
    cardDetails: {
      display: 'flex',
      marginTop: '7%',
      width: '100%',
      justifyContent: 'space-between',
    },
}));

const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2
})

const Cart = () => {
    const classes = useStyles()
    const {cart, updateCartQty, deleteCartItem } = useTransactions()
    const [totalPrice, setTotalPrice] = useState()

    useEffect(() => {
      setTotalPrice(cart.reduce((sum, p) => sum + p.price*p.quantity, 0))
    }, [cart])

    const handleRemoveCartItem = (bookId) => {
      deleteCartItem(bookId)
    }

    const renderEmptyCart = () => (
        <Typography variant="subtitle1">You have no items in your shopping cart,
          <Link className={classes.link} to="/"> start adding some</Link>!
        </Typography>
      );

      const renderCart = () => (
        <>
          <Grid container spacing={4}>
            {cart.map((item) => (
              <Grid item xs={12} sm={4} key={item.bookId}>
                <CartItem item={item} formatter={formatter} onUpdateCartQty={updateCartQty} onRemoveFromCart={handleRemoveCartItem} />
              </Grid>
            ))}
          </Grid>
          <div className={classes.cardDetails}>
          <Typography variant="h5">Total price: <b>{formatter.format(totalPrice)}</b></Typography>
            <div>
              {cart.length>=0?
              <Button className={classes.checkoutButton} component={Link} to="/checkout" 
                size="large" 
                type="button" 
                variant="contained"
              >
                Checkout
              </Button>
              :
              <Button className={classes.checkoutButton} component={Link} to="/" 
                size="large" 
                type="button" 
                variant="contained"
              >
                Continue shopping
              </Button>
              }
            </div>
          </div>
        </>
      );

    return (
        <Container>
            <div className={classes.toolbar} />
            <Typography className={classes.title} variant="h5" gutterBottom><b>Your Shopping Cart</b></Typography>
            <hr/>
            { !cart ? renderEmptyCart() : renderCart() }
        </Container>
    )
}

export default Cart
