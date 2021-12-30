
import React, { useRef } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { makeStyles, Grid, Paper } from "@material-ui/core"

const useStyles = makeStyles({
  root: {
    justifyContent: "center",
    alignItems: "center",
    position: 'absolute',
    top: '30%',
  },
  form: {
    padding: "10px",
  },
  input: {
    marginTop: '10px',
  },
})

const SignIn = ({ error, loading, login}) => {
  const classes = useStyles()

  const emailRef = useRef()
  const passwordRef = useRef()

  // const [error, setError] = useState("")
  // const [loading, setLoading] = useState(false)


  function handleSubmit(e) {
    e.preventDefault()
    login(emailRef.current.value, passwordRef.current.value)
   
  }

  return (
    <Grid container className={classes.root}>
      <Grid item xs={4}>
        <Paper elevation={3}>
        <Card className={classes.form}>
          <Card.Body>
            <h2 className="text-center mb-4">Log In</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={(e) => handleSubmit(e)}>
              <Form.Group id="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" ref={emailRef} required />
              </Form.Group>

              <Form.Group id="password" className={classes.input}>
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" ref={passwordRef} required />
              </Form.Group>
              <hr />
              <Button disabled={loading} className="w-100" type="submit">
                Log In
              </Button>
            </Form>
          </Card.Body>
        </Card>
        </Paper>
      </Grid>
    </Grid>
  )
}

export default SignIn
