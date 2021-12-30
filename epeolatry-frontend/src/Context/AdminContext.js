import React, { useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AdminContext = React.createContext()
const AdminActionsContext = React.createContext()

export function useAdmin() {
    return useContext(AdminContext)
}

export function useAdminActions() {
    return useContext(AdminActionsContext)
}


export function AdminProvider({children}) {
    const [token, setToken] = useState("")
    const [trans, setTrans] = useState([])
    const [statistics, setStatistics] = useState([])

    async function signin(email, password) {
        await axios({
            method: "POST",
            url: 'https://localhost:5001/api/User/login',
            data: {
              email: email,
              password: password
            }
          })
          .then(res => {
            const token = res.data.user.authToken
            localStorage.setItem('token', token);
            setToken(token)
          })
          .catch(err => {
            console.log(err.response)
            return {error: err.respone.data}
          })
    }

    async function logout(){
        await axios({
            method: "POST",
            url: 'https://localhost:5001/api/User/logout',
            headers: {
                Authorization: `Bearer ${token}`
            }
          })
          .then(res => {
            setToken('')
            localStorage.removeItem('token')
          })
          .catch(err => {
            console.log(err.response.data)
            return err.respone.data
          }) 
      }
    

    const getTransactions = async (token) => {
        await axios({
            method: "GET",
            url: 'https://localhost:5001/api/Admin/transactions',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            // console.log(res)
            setTrans(res.data.usersTransactions)
        })
        .catch(err => {
            console.log(err)
        })
    }

    const verifyTransaction = async (token, email, date) => {
        await axios({
            method: "PUT",
            url: 'https://localhost:5001/api/Admin/transactions/verify',
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: {
                email: email,
                date: date
            }
        })
        .then(res => {
            setTrans(res.data.usersTransactions)
        })
        .catch(err => {
            console.log(err)
        })
    }

    const analyzeTransactions = async (token) => {
        await axios ({
            method: 'GET',
            url: 'https://localhost:5001/api/Admin/transactions/analyze',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            setStatistics(res.data.report.statistics)
        })
        .catch(err => {
            console.log(err)
        })
    }

    const insertBook = async (token, book) => {
        await axios({
            method:"POST",
            url: "https://localhost:5001/api/Admin/books",
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            data: {
                title: book.title,
                isbn: book.isbn,
                pageCount: book.pageCount,
                publishedDate: book.publishedDate,
                thumbnailUrl: book.thumbnailUrl,
                shortDescription: book.shortDescription,
                longDescription: book.longDescription,
                status: book.status,
                price: book.price,
                quantity: book.quantity,
                authors: book.authors,
                categories: book.categories
            }
        })
        .then(res => {
            // setBook(res.data.book)
            return true
        })
        .catch(err => {
            return false
        })
    }

    const updatePrice = async (token, bookId, price) => {
        await axios({
            method: 'PUT',
            url: `https://localhost:5001/api/Admin/books/${bookId}/update-price`,
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            data: {
                bookId: bookId,
                price: price
            }
        })
        .then(res => {
            // setBooks(books.map((b) => {
            //     if(b.id===bookId) return {...b, price: price}
            //     return b
            // }))
            return true
        })
        .catch(err => {
            console.log(err)
            return false
        })
    }

    const updateQuantity = async (token, bookId, quantity) => {
        await axios({
            method: 'PUT',
            url: `https://localhost:5001/api/Admin/books/${bookId}/update-quantity`,
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            data: {
                bookId: bookId,
                quantity: quantity
            }
        })
        .then(res => {
            // setBooks(books.map((b) => {
            //     if(b.id===bookId) return {...b, quantity: quantity}
            //     return b
            // }))
            return true
        })
        .catch(err => {
            console.log(err)
            return false
        })
    }

    useEffect(() => {
        async function fetchData() {
            const storedToken = localStorage.getItem('token')
            if(!storedToken || storedToken==='') return
            setToken(storedToken)
            await getTransactions(storedToken)
            await analyzeTransactions(storedToken)
        }
        fetchData()

    }, [])

    const adminData = {
        token, trans, statistics
    }

    const adminActions = {
        signin, 
        logout,
        verifyTransaction,
        insertBook, 
        updatePrice,
        updateQuantity
    }

    return (
        <AdminContext.Provider value={adminData}>
            <AdminActionsContext.Provider value={adminActions}>
            {children}
            </AdminActionsContext.Provider>            
        </AdminContext.Provider>
    )
}