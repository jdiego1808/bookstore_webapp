import { Card, CardContent, Typography, CardHeader, Avatar, IconButton, Menu, MenuItem, Input, makeStyles } from '@material-ui/core'
import { AccountCircle, MoreVert, Send} from '@material-ui/icons'
import { useState } from 'react'

const useStyles = makeStyles({
  hidden: {
    display: 'none',
  },
  available: {
    display: 'block'
  }
})

const Comment = ({comment, onDelete, onUpdate, email}) => {
  const classes = useStyles()
  const [updatingComment, setUpdatingComment] = useState('')
  const [anchorEl, setAnchorEl] = useState(null)
  const [isEdit, setIsEdit] = useState(false)

  return (
    <Card variant="outlined">
      <CardHeader 
        avatar={<Avatar aria-label="avatar"><AccountCircle /></Avatar>}
        action={
          <IconButton className={email===comment.email? classes.available : classes.hidden} onClick={(e) => setAnchorEl(e.currentTarget)}>
              <MoreVert />
          </IconButton>
        }
        title={comment.name}
        subheader={comment.date}
      />
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => {
            setIsEdit(!isEdit)
            setAnchorEl(null)
          }
        }
        >Edit</MenuItem>
        <MenuItem onClick={(e) => {
            e.preventDefault()
            onDelete(comment.id)
          }}
        >Delete</MenuItem>
      </Menu>
      <CardContent>
        { isEdit ? 
        (<Input 
          defaultValue={comment.text} 
          margin="dense"
          error={false}
          onChange={(e)=>{setUpdatingComment(e.target.value)}}
          endAdornment={
                <IconButton 
                  onClick = {(e) => {
                    e.preventDefault()
                    onUpdate(comment.id, updatingComment)
                    setIsEdit(!isEdit)
                  }}
                >
                  <Send />
                </IconButton>
          }
        />)
        : (<Typography variant="body1">{comment.text}</Typography>)
        }
      </CardContent>
    </Card>
  )
}

export default Comment