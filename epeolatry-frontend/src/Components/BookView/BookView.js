import { Button, Container, Grid, Typography, CircularProgress } from '@material-ui/core'
import ReactMarkdown from 'react-markdown'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useLocation } from 'react-router-dom';
import './style.css'
import CommentSection from './CommentSection'
import { useAuth, useCommentActions } from '../../Context/AuthContext'

const SAMPLE_BOOK_IMG = 'https://cdn.shopify.com/s/files/1/2262/4635/products/Art_SB_1024x.jpg?v=1581028017'

// const createMarkup = (text) => {
//     return { __html: text };
// };

const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2
})


const BookView = () => {
  const location = useLocation()
  const user = useAuth()
  const { addComment, updateComment, deleteComment } = useCommentActions()
  const bookId = location.pathname.split('/')[2]
  const [book, setBook] = useState({});
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {  
    const fetchBook = async (bookId) => {
      try {
        const res = await axios({
            method: "GET",
            url: `https://localhost:5001/api/Books/${bookId}?bookId=${bookId}`
        })
        
        setBook(res.data.book)
        setLoading(false)
        setComments(book.comments)
        
      } catch(err) {
          console.log(err)
      }
    };

    fetchBook(bookId);
  }, [book.comments, bookId, comments]);

  const handleAddComment = (text) => {
    if (text === "") return;
    
    const newComments = addComment(book.id, text)
    newComments && setComments(newComments)  
  }

  const handleUpdateComment = (commentId, updatedComment) => {
    setComments(
      comments.map((c) => {
        if (c.id === commentId) return { ...c, text: updatedComment };
        return c;
      })
    )
    updateComment(book.id, commentId, updatedComment)
  }

  const handleDeleteComment = (commentID) => {
    console.log(commentID)
    setComments(comments.filter((c) => c.id !== commentID));
    deleteComment(book.id, commentID)
  }

  return (
      <Container className="product-view">
        {loading ? (
          <div className='loader'>
              <CircularProgress size='3rem' thickness={5} />
          </div>
        ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} className="image-wrapper">
            <img src={book.thumbnailUrl ? book.thumbnailUrl : SAMPLE_BOOK_IMG} alt={book.title}
            />
          </Grid>
          <Grid item xs={12} sm={6} className="text">
            <Typography variant="h2"><b>{book.title}</b></Typography>
            <hr />
            <Typography variant='subtitle1'>by <b>{book.authors.map(author => author).join(', ')}</b></Typography>
            <br/>
            <ReactMarkdown children={book.longDescription || book.shortDescription || 'No description yet'} />
            <br /> 
            <Typography variant='subtitle2'><b>Categories: </b>{book.categories.map(cate => cate).join(', ')}</Typography>
            <Typography variant="h3" color="secondary" >Price: <b> {formatter.format(book.price)} </b> </Typography>
            <hr/>
            
            <Grid item >
              <Grid item xs={12}>
                <Button size="large" className="custom-button" component={Link} to='/' >
                    Continue Shopping
                </Button>
              </Grid>
            </Grid>
          </Grid>
          
          <Grid item xs={12}>
            <CommentSection 
              comments={book.comments}
              handleAddComment={handleAddComment}
              handleUpdateComment={handleUpdateComment}
              handleDeleteComment={handleDeleteComment}
              user={user}
            />
          </Grid>
        </Grid>
        )}
      </Container>
  )
}

export default BookView
