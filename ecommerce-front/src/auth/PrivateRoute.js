import React,{Component} from 'react';
import {Route,Redirect} from 'react-router-dom'
import {isAuthenticated} from './index';

//https://reactrouter.com/web/example/auth-workflow
//if user is authenticated/logged in , we return first component dashboard else redirected to sign in

function PrivateRoute({ component:Component, ...rest }) {
    return (
      <Route
        {...rest}
        render={ ( props ) =>
          isAuthenticated() ? (
            <Component {...props}/>
          ) : (
            <Redirect
              to={{
                pathname: "/signin",
                state: { from: props.location }
              }}
            />
          )
        }
      />
    );
  }


export default PrivateRoute;