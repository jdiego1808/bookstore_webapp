
import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { Link, useHistory } from "react-router-dom"
import { makeStyles } from "@material-ui/core"
import { useAuthActions } from '../Context/AuthContext'

const useStyles = makeStyles({
  root: {
    maxWidth: 350,
    display: 'contents'
  },
  card: {
    alignItems: 'center',    
  }
})

const Login = () => {
  const classes = useStyles()
  const { login } = useAuthActions()
  const emailRef = useRef()
  const passwordRef = useRef()

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const history = useHistory()

  function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    const res = login(emailRef.current.value, passwordRef.current.value)
    setLoading(false)
    res.error ? setError(res.error) : history.push("/")
  }

  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <Card.Body>
          <h2 className="text-center mb-4">Log In</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} required />
            </Form.Group>
            <hr/>
            <Button disabled={loading} className="w-100" type="submit">
              Log In
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        Doesn't have an account? <Link to="/signup">Sign Up</Link>
      </div>
    </div>
  )
}

export default Login
