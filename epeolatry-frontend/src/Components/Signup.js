
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

const Signup = () => {
  const classes = useStyles()
  const { signup } = useAuthActions()
  const usernameRef = useRef()
  const emailRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const history = useHistory()

  async function handleSubmit(e) {
    e.preventDefault()

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match")
    }
    setLoading(true)
    const res = signup(usernameRef.current.value, emailRef.current.value, passwordRef.current.value)
    setLoading(false)
    res ? setError(res.error) : history.push("/")
  }

  // const signup = async (username, email, password) => {
  //   await axios({
  //     method: "POST",
  //     url: 'https://localhost:5001/api/User/register',
  //     data: {
  //       name: username,
  //       email: email,
  //       password: password
  //     }
  //   })
  //   .then(res => {
  //     setCurrentUser(res.data)
  //   })
  //   .catch(err => {
  //     console.log(err.response.data)
  //     setError(err.response.data.error.name)
  //   })
  // }
  

  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <Card.Body>
          <h2 className="text-center mb-4">Sign Up</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" ref={usernameRef} required />
            </Form.Group>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} required />
            </Form.Group>
            <Form.Group id="password-confirm">
              <Form.Label>Password Confirmation</Form.Label>
              <Form.Control type="password" ref={passwordConfirmRef} required />
            </Form.Group>
            <Button disabled={loading} className="w-100" type="submit">
              Sign Up
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        Already have an account? <Link to="/login">Log In</Link>
      </div>
    </div>
  )
}

export default Signup
