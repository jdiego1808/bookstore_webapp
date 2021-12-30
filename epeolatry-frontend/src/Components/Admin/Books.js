import { makeStyles, Grid, Container, Paper, Snackbar, CircularProgress, Button } from "@material-ui/core";
import Pagination from '@material-ui/lab/Pagination';
import AddIcon from "@material-ui/icons/Add";
import { DataGrid } from '@material-ui/data-grid';
import { useState, useEffect, useCallback } from "react";
import {useAdmin, useAdminActions} from '../../Context/AdminContext'
import axios from 'axios'
import { Alert } from "@material-ui/lab";
import InsertDialog from './InsertDialog'

const useStyles = makeStyles({
    root: {
      marginTop: '20px',
      justifyContent: 'center',
      alignItems: 'center',
    },
    books: {
      height: '700px',
      // backgroundColor: '#ccc',
      overflow: 'auto',
    },
    header: {
      fontWeight: '500',
    },
    pagination: {
      position: 'relative',
      left: '30%',
    },
    loader: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButton: {
        display: "flex",
        justifyContent: "flex-end"
    }
});

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});
  
const columns = [
    { field: 'title', headerName: 'Title', headerAlign: 'center', flex: 1, editable: false },
    { field: 'quantity', headerName: 'Quantity', headerAlign: 'center', flex: 0.5, type: 'number', editable: true },
    {
      field: 'price',
      headerName: 'Price',
      flex: 0.5,
      headerAlign: 'center',
      type: 'number',
      valueFormatter: ({ value }) => currencyFormatter.format(Number(value)),
      editable: true
    }
];

const Books = () => {
    const classes = useStyles()
    const {token} = useAdmin()
    const {updatePrice, updateQuantity, insertBook} = useAdminActions()
    const [page, setPage] = useState(1)
    const [books, setBooks] = useState([])
    const [loading, setLoading] = useState(false)
    const [booksCount, setBooksCount] = useState(0)
    const [openSnackbar, setOpenSnackbar] = useState(false)
    const [openDialog, setOpenDialog] = useState(false);
    const booksPerPage = 20

    const getBooks = async (token, page, sort='price', sortDirection=1) => {
        setLoading(true)
        await axios({
            method: "GET",
            url: 'https://localhost:5001/api/Admin/books',
            params: {
                page: page,
                sort: sort,
                sortDirection: sortDirection
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            setBooks(res.data.books) 
            setBooksCount(res.data.booksCount)
        })
        .catch(err => {
            console.log(err)
            return null
        })
        setLoading(false)
    }

    const handleInsert = (book) => {
        const res = insertBook(token, book)
        !res && setOpenSnackbar(true)
    }

    const handleChange = (event, value) => {
        setPage(value);
    }

    const handleClickOpenDialog = () => {
        setOpenDialog(true);
    };
    
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleCellEditCommit = useCallback(({id, field, value}) => {
        switch(field) {
            case 'price': {
                const res = updatePrice(token, id, value)
                res ?
                setBooks(books.map((b) =>{
                    if(b.id === id) return {...b, price: value}
                    return b
                }))
                : setOpenSnackbar(true)
                break
            }
            case 'quantity': {
                const res = updateQuantity(token, id, value)
                res ?
                setBooks(books.map((b) =>{
                    if(b.id === id) return {...b, quantity: value}
                    return b
                }))
                : setOpenSnackbar(true)
                
                break
          }
          default: break
        }
    }, [books, token, updatePrice, updateQuantity])

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackbar(false);
    };

    useEffect(()=>{
        getBooks(token, page-1)        
    }, [page, token])
    
    return (
        <Container disableGutters>
            <Paper elevation={0}>
                <Grid container spacing={3} className={classes.root}>
                    <Grid item xs={12} className={classes.addButton}>
                        <Button
                        variant="contained"
                        color="default"
                        startIcon={<AddIcon />}
                        onClick={handleClickOpenDialog}
                        >
                        Add new book
                        </Button>
                    </Grid>           
                    <Grid item className={classes.books} xs={12}>
                    {loading ? (
                        <div className={classes.loader}>
                            <CircularProgress size='3rem' thickness={5} />
                        </div>
                    ) : (   
                        <DataGrid
                            rows={books}
                            loading={loading}
                            columns={columns}
                            onCellEditCommit={handleCellEditCommit}
                            hideFooterPagination
                        />
                    )}
                    </Grid>
                    
                    <Grid item xs={12} className={classes.pagination}>
                        <Pagination             
                            count={Math.ceil(booksCount/booksPerPage)} 
                            page={page} 
                            onChange={handleChange} 
                        />
                    </Grid>
                </Grid>
                <InsertDialog open={openDialog} handleClose={handleCloseDialog} handleInsert={handleInsert}/>
            </Paper>
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error">
                    An error has occurred.
                </Alert>
            </Snackbar>
        </Container>
    )
}

export default Books
