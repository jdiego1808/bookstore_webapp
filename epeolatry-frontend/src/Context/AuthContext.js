import React, { useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = React.createContext()
const AuthActionsContext = React.createContext()
const TransactionsContext = React.createContext()
const CommentsContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}
export function useAuthActions() {
  return useContext(AuthActionsContext)
}

export function useTransactions() {
  return useContext(TransactionsContext)
}

export function useCommentActions() {
  return useContext(CommentsContext)
}

export function AuthProvider({children}) {
  const [user, setUser] = useState(null)
  const [cart, setCart] = useState([])

  async function login(email, password) {
    await axios({
        method: "POST",
        url: 'https://localhost:5001/api/User/login',
        data: {
          email: email,
          password: password
        }
      })
      .then(res => {
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setUser(res.data.user)
      })
      .catch(err => {
        console.log(err.response)
        return {error: err.respone.data}
      })
  }

  async function register (name, email, password) {
    await axios({
      method: "POST",
      url: 'https://localhost:5001/api/User/register',
      data: {
        name: name,
        email: email,
        password: password
      }
    })
    .then(res => {
        localStorage.setItem('user', JSON.stringify(res.data));
      setUser(res.data)
    })
    .catch(err => {
      console.log(err.response.data)
      return err.respone.data
    })
  }

  async function logout(){
    await axios({
        method: "POST",
        url: 'https://localhost:5001/api/User/logout',
        headers: {
            Authorization: `Bearer ${user.authToken}`
        }
      })
      .then(res => {
        setUser(null)
        localStorage.removeItem('user')
      })
      .catch(err => {
        console.log(err.response.data)
        return err.respone.data
      }) 
  }

  async function saveCart() {
    const passingData = cart.length>0 ? cart : JSON.stringify([])
    await axios({
      method: "PUT",
      url: 'https://localhost:5001/api/User/cart',
      headers: {
          Authorization: `Bearer ${user.authToken}`
      },
      data: {
        cart: passingData
      }
    })
    .then(res => {
      console.log(res.data)
    })
    .catch(err => {
      console.log(err.response.data)
    }) 
  }

  function addToCart(bookId, title, price) {
    console.log(bookId)
    if(!user) return {error: 'Unauthorizated'};
    // console.log(bookId)
    const isExist = cart.findIndex(item => item.bookId===bookId)
    if(isExist!==-1) {
      updateCartQty(bookId, 2)
      return
    }
    setCart(c => [...c, {bookId: bookId, title: title, price: price, quantity: 1}])
    saveCart()
  }

  function updateCartQty (bookId, quantity) {
    if(quantity===0) {
      setCart(cart => cart.filter(item => item.bookId!==bookId))
      return;
    }
    setCart(cart.map((item) => {
      if (item.bookId === bookId) {
        item.quantity = quantity
        return item
      }
      return item
    }))
    saveCart()
  }

  function deleteCartItem(bookId) {
    setCart(cart => cart.filter(item => item.bookId!==bookId))
    saveCart()
  }

  async function checkout(address, phone, totalPrice) {
    await axios({
      method: "PUT",
      url: 'https://localhost:5001/api/User/transactions',
      headers: {
          Authorization: `Bearer ${user.authToken}`
      },
      data: {
        items: cart,
        totalPrice: totalPrice,
        date: new Date().toISOString(),
        address: address,
        phone: phone,
        status: "In process"
      }
    })
    .then(res => {
      setUser({...user, transactions: res.data.transactions, cart: []})
      setCart([])
      saveCart()
    })
    .catch(err => {
      console.log(err.response.data)
    }) 
  }

  async function addComment(bookId, text) {
    
    try {
      const res = await axios({
          method: "POST",
          url: 'https://localhost:5001/api/Books/comment',
          headers: {
            Authorization: `Bearer ${user.authToken}`,
            'Content-Type': 'application/json'
          },
          data: {
            bookId: bookId,
            comment: text
          }
      })
      return res.data.comments
    } catch(err) {
      console.log(err)
    }
  }

  async function updateComment (bookId, commentId, text) {
    
    try {
      await axios({
          method: "PUT",
          url: 'https://localhost:5001/api/Books/comment',
          headers: {
            Authorization: `Bearer ${user.authToken}`,
            'Content-Type': 'application/json'
          },
          data: {
            bookId: bookId,
            commentId: commentId,
            updatedComment: text
          }
      })
    } catch(err) {
      console.log(err)
    }
  }

  async function deleteComment(bookId, commentId) {
    try {
      await axios({
          method: "DELETE",
          url: 'https://localhost:5001/api/Books/comment',
          headers: {
            Authorization: `Bearer ${user.authToken}`,
            'Content-Type': 'application/json'
          },
          data: {
            commentId: commentId,
            bookId: bookId
          }
      })
    } catch(err) {
      console.log(err)
    }
  }
  

  useEffect(() => {
    const u  = JSON.parse(localStorage.getItem('user'))
    if(!u) return
    
    setUser(u)
    setCart(u.cart)
  }, [])

  useEffect(()=> {
    localStorage.setItem('user', JSON.stringify(user))
  },[user])

  const actions = {login, register, logout}

  const transactions = {cart, addToCart, updateCartQty, deleteCartItem, checkout}

  const commentActions = {addComment, updateComment, deleteComment}

  return (
    <AuthContext.Provider value={user}>
      <AuthActionsContext.Provider value={actions}>
        <TransactionsContext.Provider value={transactions}>
          <CommentsContext.Provider value={commentActions}>
          {children}
          </CommentsContext.Provider>
        </TransactionsContext.Provider>
      </AuthActionsContext.Provider>
    </AuthContext.Provider>
  )
}