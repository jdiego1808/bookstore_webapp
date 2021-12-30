import { makeStyles, Button, Card, CardHeader, CardActionArea, TextField } from '@material-ui/core'
import {useState} from 'react'
import Comment from './Comment'

const useStyles = makeStyles((theme) => ({
  root:{
    maxWidth: '50rem',
  },
  commentForm: {
    marginLeft: "10px",
    marginRight: "10px",
    display: 'flex',
    justifyContent: 'space-between',
  },
  inputField: {
    flex:2,
  },
  grow: {
    flex: 1,
  }
}));

export default function CommentSection({ comments, handleAddComment, handleUpdateComment, handleDeleteComment, user}) {
  const classes = useStyles()
  const [input, setInput] = useState('')

  return (
  <Card className={classes.root}>
    <CardHeader 
      title="Comments" 
      subheader={`${comments.length} comment(s)`}  
    />
    <CardActionArea>
      <form className={classes.commentForm} 
        onSubmit={(e) => {
          e.preventDefault();
          handleAddComment(input);
          setInput("");
        }}  
        autoComplete="off"
      >
        <TextField
          value={input}
          className={classes.inputField}
          placeholder="Write a comment" 
          onChange={ (e) => setInput(e.currentTarget.value) }
        />
        <div className={classes.grow}></div>
        <Button variant="contained" type='submit' size="small" className={classes.grow}>Add comment</Button>
      </form>
    </CardActionArea>
    <br/>
    <div>
      {
        comments.map((c) => (
          <Comment 
            key={c.id} 
            comment={c} 
            onDelete={handleDeleteComment} 
            onUpdate={handleUpdateComment}
            email={user? user.email: ''}
          />
        ))
      }
    </div>
  </Card>
  );
}
