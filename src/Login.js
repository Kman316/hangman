import React, { Component } from 'react';
import fire from './config/firebase';
import {FormErrors} from "./FormErrors";


class Login extends Component {
    constructor(props) {
        super(props);
        this.login = this.login.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.signup = this.signup.bind(this);
        this.state = {
            email: '',
            password: '',
            formErrors: {email: '', password: ''},
            emailValid: false,
            passwordValid: false,
            newPostKey: 0
        };
    }

    validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let emailValid = this.state.emailValid;
        let passwordValid = this.state.passwordValid;

        switch(fieldName) {
            case 'email':
                emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
                fieldValidationErrors.email = emailValid ? '' : ' is currently invalid';
                break;
            case 'password':
                passwordValid = value.length >= 6;
                fieldValidationErrors.password = passwordValid ? '': ' is too short, must include 6 characters';
                break;
            default:
                break;
        }
        this.setState({formErrors: fieldValidationErrors,
            emailValid: emailValid,
            passwordValid: passwordValid
        }, this.validateForm);
    }

    validateForm() {
        this.setState({formValid: this.state.emailValid && this.state.passwordValid});
    }

    increment(){
        this.setState({ gamesPlayed: this.state.gamesPlayed })
    }

    handleChange(e) {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({[name]: value},
            () => { this.validateField(name, value) });
    }

    login(e) {
        e.preventDefault();
        fire.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then((u)=>{
        }).catch((error) => {
            console.log(error);
        });
    }

    signup(e){

        e.preventDefault();
        fire.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then((u)=>{
        }).then((u)=>{console.log(u)})
            .catch((error) => {
                console.log(error);
            });


        fire.auth().onAuthStateChanged(firebaseUser =>{
            const ref = fire.database().ref().child('users/' + firebaseUser.uid);

            ref.set({email: this.state.email,
                password: this.state.password});

        });
    }



    reauthenticate = (currentPassword) => {
        var user = fire.auth().currentUser;
        var cred = fire.auth.EmailAuthProvider.credential(
            user.email, currentPassword);
        return user.reauthenticateWithCredential(cred);
    };

    changePassword = (currentPassword, newPassword) => {
        this.reauthenticate(currentPassword).then(() => {
            var user = fire.auth().currentUser;
            user.updatePassword(newPassword).then(() => {
                console.log("Password updated!");
            }).catch((error) => { console.log(error); });
        }).catch((error) => { console.log(error); });
    };

    render() {
        return (
            <div className="col-md-6">
                <form>
                    <h1 className="App-header">HANGMAN</h1>
                    <div className="form-group">
                        <label form="exampleInputEmail1">Email address</label>
                        <input value={this.state.email} onChange={this.handleChange} type="email" name="email"
                               className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
                               placeholder="Enter email" />
                    </div>
                    <div className="form-group">
                        <label form="exampleInputPassword1">Password</label>
                        <input value={this.state.password} onChange={this.handleChange} type="password" name="password"
                               className="form-control" id="exampleInputPassword1" placeholder="Password" />
                    </div>
                    <button type="submit" onClick={this.login} disabled={!this.state.formValid} className="btn btn-primary">Login</button>
                    <button onClick={this.signup} disabled={!this.state.formValid} style={{marginLeft: '25px'}} className="btn btn-success">Signup</button>
                    <div className="panel panel-default">
                    <FormErrors formErrors={this.state.formErrors} />
                    </div>

                </form>
            </div>
        );
    }
}
export default Login;