import { Container, Grid, makeStyles, Typography, Button, TextField, Card, CardHeader, Chip, Paper } from '@material-ui/core'
//import LocalShippingIcon from '@material-ui/icons/LocalShipping'
import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuth, useTransactions } from '../Context/AuthContext'
import deliveryIcon from '../assets/delivery.png'

const useStyles = makeStyles({
    root: {
        marginTop: 20,
        justifyContent: 'center',
    },
    loader: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: '5px',
        marginTop: '10px',
    },
    paper: {
        padding: '10px',
    },
    hidden: {
        display: 'none',
    },
    show: {
      display: 'block',
    },
    fullWidth: {
        width: '100%',
    }
})

const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2
  })

const Checkout = () => {
    const classes=useStyles()
    const user = useAuth()
    const phoneRef = useRef()
    const addressRef = useRef()
    const { cart, checkout } = useTransactions()
    const [isSubmitted, setIsSubmitted] = useState(false)
    const total = cart.reduce((sum, p) => sum + p.price*p.quantity, 0)

    const handleSubmit = () => {
        checkout(addressRef.current.value, phoneRef.current.value, total)
        setIsSubmitted(true)
    }

    return (
        <Container className={classes.root} maxWidth="md">
            <Paper className={classes.paper} elevation={3} >
                <Grid container spacing={3} className={isSubmitted ? classes.hidden : classes.show}>
                    <Grid item container>
                        <Grid item xs={2}><Typography variant='h6'>Email:</Typography></Grid>
                        <Grid item xs={10}>
                        <TextField defaultValue={user.email}
                            InputProps={{
                            readOnly: true,
                            }}
                        />
                        </Grid>
                    </Grid>

                    <Grid item container>
                        <Grid item xs={2}><Typography variant='h6'>Orders:</Typography></Grid>
                        <Grid item xs={10}>
                        {cart.map((item) =>
                            (
                            <Card key={item.bookId}>
                                <CardHeader 
                                title={item.title}
                                titleTypographyProps={{variant:'h6'}}
                                subheader={`${formatter.format(item.price)} - Quantity: ${item.quantity}`}
                                action={
                                    <Chip label={item.quantity} />
                                }
                                />
                            </Card>
                            ))}
                        </Grid>
                    </Grid>
                    <Grid item container>
                        <Grid item xs={2}><Typography variant="h6">Total:</Typography></Grid>
                        <Grid item xs={10}>
                        <Typography variant="h6">
                            {formatter.format(total)}
                        </Typography>
                        </Grid>
                    </Grid>
                    <Grid item container>
                        <Grid item xs={2}><Typography variant='h6'>Phone: </Typography></Grid>
                        <Grid item xs={10}><TextField className={classes.fullWidth} variant="outlined" size="small" placeholder='0987654321' inputRef={phoneRef} required/></Grid>
                    </Grid>
                    <Grid item container>
                        <Grid item xs={2}><Typography variant='h6'>Address: </Typography></Grid>
                        <Grid item xs={10}><TextField className={classes.fullWidth} variant="outlined" size="small" placeholder='221B Baker Street, London' inputRef={addressRef} required/></Grid>
                    </Grid>
                    <Grid item container>
                        <Grid item xs={3}/>
                        <Grid item xs={6}>
                            <Button className={classes.fullWidth}  variant="contained" color="primary" align='center' onClick={handleSubmit}>Submit</Button>
                        </Grid>
                        <Grid item xs={3}/>
                    </Grid>
                </Grid>
                <Grid container spacing={4} className={isSubmitted ? classes.show : classes.hidden}>
                    <div className={classes.loader}>
                        <img src={deliveryIcon} width='700px' heigth='300px' alt="delivery icon"/>
                    </div>
                    <Grid item xs={12}><Typography variant="h6">Your books are coming. Stay calm and enjoy coffee.</Typography></Grid>
                    <Grid item xs={12}>
                        <Button size="large" component={Link} color='primary' to='/'>
                            Continue Shopping
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    )
}

export default Checkout
