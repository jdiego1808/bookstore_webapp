import { CircularProgress, Container, Grid, makeStyles, InputAdornment, Input, IconButton } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search';
import { useState, useEffect } from 'react'
import axios from 'axios'

import Carousel from 'react-bootstrap/Carousel'
import "react-responsive-carousel/lib/styles/carousel.min.css";

import { useTransactions } from '../Context/AuthContext'
import BookCard from '../Components/BookCard'

import logo from '../assets/1.jpeg'
import logo1 from '../assets/2.jpeg';
import logo2 from '../assets/4.jpeg';
import logo3 from '../assets/3.jpeg';


const useStyles = makeStyles({
    root: {
        marginTop: 80,
    },
    loader: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    paper: {
        marginBottom: "1rem",
        padding: "13px",
    },
    searchs: {
        justifyContent: 'center',
        display: 'flex',
        marginTop: '40px',
        },
    searchb: {
        marginBottom: '10px',
        height: '50%',
        width: '100%',
        paddingLeft: '10px',
    },
})

const BooksPage = () => {
    const classes = useStyles()
    const {addToCart} = useTransactions()

    const [booksFilter, setBooksFilter] = useState([])
    const [searchTerm, setSearchTerm] = useState('')

    const [books, setBooks] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {    
        const fetchData = async () => {
            setLoading(true)
            try {
                const res = await axios({
                    method: "GET",
                    url: "https://localhost:5001/api/Books"
                })

                setBooks(res.data.books)
                setLoading(false)
            } catch(err) {
                console.log(err)
            }
        }

        fetchData()
    }, [])

    const handleSearch = () => {
        const search = async () => {
            setLoading(true)
            try {
                const res = await axios({
                    method: "GET",
                    url: `https://localhost:5001/api/Books/search?text=${searchTerm}`
                })

                setBooksFilter(res.data.books)
                setLoading(false)
            } catch(err) {
                console.log(err)
            }
        }
        search()
    }


    return (
        <Container className={classes.root}>
            <Grid container spacing={3}>
                <Grid item xs></Grid>
                <Grid item xs={6}>
                <Input className={classes.searchb} 
                    type="text" placeholder='Search...' 
                    onChange={event => {setSearchTerm(event.target.value)}}
                    endAdornment = {
                        <InputAdornment position='end'>
                            <IconButton edge="start"  aria-label="Search button"  onClick={handleSearch}>
                                <SearchIcon />
                            </IconButton>
                        </InputAdornment>
                    }
                />
                </Grid>
                <Grid item xs></Grid>
            </Grid>
            <Carousel fade autoPlay >
                <Carousel.Item>
                    <img className="d-block w-100" src={logo1} alt=" slide" />
                    <Carousel.Caption></Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img className="d-block w-100" src={logo} alt="First slide" />
                    <Carousel.Caption></Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img className="d-block w-100" src={logo3} alt="Second slide" />         
                    <Carousel.Caption></Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img className="d-block w-100" src={logo2} alt="Second slide" />
                    <Carousel.Caption></Carousel.Caption>
                </Carousel.Item>
            </Carousel>
            
            <hr />
            <Grid container spacing={2}>
                {loading ? (
                    <div className={classes.loader}>
                        <CircularProgress size='3rem' thickness={5} />
                    </div>
                ) : (
                    searchTerm === ''
                    ? books.map((book) => (
                        <Grid item key={book.id} xs={12} sm={6} md={4} lg={3}>
                            <BookCard book={book} handleAddToCart={addToCart}/>
                        </Grid>
                    ))
                    : booksFilter.map((book) => (
                        <Grid item key={book.id} xs={12} sm={6} md={4} lg={3}>
                            <BookCard book={book} handleAddToCart={addToCart}/>
                        </Grid>
                    ))
                )}
            </Grid>
        </Container>
    )
}

export default BooksPage
