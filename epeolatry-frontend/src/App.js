import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import AdminPage from './Pages/AdminPage'
import Signup from './Components/Signup'
import BooksPage from './Pages/BooksPage'
import Navbar from './Components/Navbar'
import Login from './Components/Login'
import Cart from './Components/Cart'
import Checkout from './Components/Checkout'
import BookView from './Components/BookView/BookView'
import Profile from './Components/UserProfile/Profile'
import PrivateRoute from './Components/Admin/PrivateRoute'
import { AuthProvider } from './Context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <Router> 
        <Navbar />
        <Switch>
          <Route exact path="/" component={BooksPage} />
          <PrivateRoute exact path="/admin" component={AdminPage}/>
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />
          <Route path="/profile" component={Profile} />
          <Route path="/cart" component={Cart} />
          <Route path="/checkout" component={Checkout} />
          <Route exact path="/books/:id" component={BookView} />
        </Switch>
      </Router>
    </AuthProvider>
  );
}

export default App;
