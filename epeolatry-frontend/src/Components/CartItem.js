import { Button, Card, CardActions, CardContent, makeStyles, Typography } from '@material-ui/core'
import React from 'react'


const useStyles =  makeStyles(() => ({
    cardContent: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    cartActions: {
      justifyContent: 'space-between',
    },
    buttons: {
      display: 'flex',
      alignItems: 'center',
    },
    button: {
      color: 'white',
      width: '100%',
      height: '40px',
  
  },
  }))

const CartItem = ({item, formatter, onUpdateCartQty, onRemoveFromCart}) => {
    const classes = useStyles()

    return (
        <Card className="cart-item">
            <CardContent className={classes.cardContent}>
                <Typography variant="h6">{item.title}</Typography>
                <Typography variant="h6" color='secondary' >{formatter.format(item.price)}</Typography>
            </CardContent>
            <CardActions className={classes.cardActions}>
                <div className={classes.buttons}>
                    <Button type="button" size="small" onClick={() => onUpdateCartQty(item.bookId, item.quantity - 1)}>-</Button>
                    <Typography>&nbsp;{item.quantity}&nbsp;</Typography>
                    <Button type="button" size="small" onClick={() => onUpdateCartQty(item.bookId, item.quantity + 1)}>+</Button>
                </div>
                <Button className={classes.button} variant="contained" type="button" color='secondary' onClick={() => onRemoveFromCart(item.bookId)}>Remove</Button>
            </CardActions>
        </Card>
    )
}

export default CartItem
