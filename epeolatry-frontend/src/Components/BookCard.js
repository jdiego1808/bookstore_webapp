import { Button, Card, CardActions, CardContent, CardMedia, Typography, makeStyles } from '@material-ui/core'
import React from 'react'
import { Link } from 'react-router-dom'

const useStyles = makeStyles({
    media: {
        height: 445,
        paddingTop: '56.25%', // 16:9,
        // marginTop:'30'
    },
})

const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2
})

const BookCard = ({ book, handleAddToCart }) => {
    const classes = useStyles()

    const onAddToCart = (bookId, title, price) => {
        //e.preventDefault()
        const res = handleAddToCart(bookId, title, price)
        res && alert(res.error)
      }

    return (
        <Card>
            <Link to={`books/${book.id}`} >
                <CardMedia className={classes.media} image={book.thumbnailUrl} title="book image"/>                    
            </Link>
            <CardContent>
                <Typography gutterBottom variant="h5" component="h2">{book.title}</Typography>
                <Typography variant="h6">{formatter.format(book.price)}</Typography>                    
            </CardContent>
            
            <CardActions>
                {
                    book.quantity === 0
                    ? <Button size="small" color="danger" disabled="true">Out of stock</Button>
                    : <Button variant="contained" size="small" color="primary" onClick={() => onAddToCart(book.id, book.title, book.price)}>Add to cart</Button>
                } 
            </CardActions>

        </Card>
    )
}

export default BookCard
