import React from 'react';
import { Route } from 'react-router-dom';
import { AdminProvider } from '../../Context/AdminContext';
// import { AuthProvider } from '../../Context/AuthContext'

const PrivateRoute = ({component: Component, ...rest}) => {
   
    return (
        <AdminProvider>
            <Route {...rest} render={props => (<Component {...props}/>)}/>
        </AdminProvider>   
        
    );
};

export default PrivateRoute;