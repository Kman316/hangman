import React, { Component } from 'react';
import './App.css';
import firebase from './config/firebase';
import Homepage from './Homepage';
import Login from './Login';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            user: {},
            email: '',
            password: ''
        });
        this.authListener = this.authListener.bind(this);
    }

    componentDidMount() {
        this.authListener();
    }

    authListener() {
        firebase.auth().onAuthStateChanged((user) => {
            console.log(user);
            if (user) {
                this.setState({ user });
                localStorage.setItem('user', user.uid);
            } else {
                this.setState({ user: null });
                localStorage.removeItem('user');
            }
        });
    }
    render() {
        return (
            <div>
                {this.state.user ? (<Homepage/>) : (<Login/>)}
            </div>
        )
    }
}

export default App;