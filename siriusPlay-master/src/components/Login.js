import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import React from "react";
import Database from "./Database";
import Cookies from "js-cookie";


function validateEmail(emailField){
    // https://stackoverflow.com/questions/5495815/javascript-code-for-showing-yesterdays-date-and-todays-date/32301169 + my own magic
    let reg = /^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/;
    return reg.test(emailField) !== false;
}


class Login extends React.Component {
    state = {
        intent: "login",
        helperText1: "",
        helperText2: ""
    };

    handleSubmit = event => {
        event.preventDefault();
        if(this.state.intent === "login") {
            if(event.target.querySelector("#email").value !== "" && event.target.querySelector("#password").value !== "") {
                switch (Database.logIn(event.target.querySelector("#email").value, event.target.querySelector("#password").value)) {
                    case "mailMatch":
                        this.setState({helperText2: "Password is wrong"});
                        break;
                    case "match":
                        Cookies.set('email', event.target.querySelector("#email").value, { expires: 7 });
                        this.props.handler(event.target.querySelector("#email").value);
                        break;
                    case false:
                        this.setState({helperText2: "Email is not registered"});
                        break
                }
            } else {
                this.setState({helperText2: "Please type your info."});
            }
        } else {
            let givenDate = new Date(event.target.querySelector("#date").value);
            let email = event.target.querySelector("#email").value;
            Cookies.set('email', email, { expires: 7 });
            let password = event.target.querySelector("#password").value;
            let name  = event.target.querySelector("#name").value;
            let formattedDate = event.target.querySelector("#date").value;
            if(email === "" || password === "" || name === "" || formattedDate === "") {
                this.setState({helperText1: "Please type your info."});
            } else {
                if(!isDate18orMoreYearsOld(givenDate.getDay(), givenDate.getMonth(), givenDate.getFullYear())) {
                    this.setState({helperText1: "You are not 18 years old, you can't sign up."});
                } else {
                    if(!this.props.matchUser(email)) {
                        if(validateEmail(email)) {
                            formattedDate = givenDate.getDay() + "/" + givenDate.getMonth() + "/" + givenDate.getFullYear();
                            Database.addUser(email, name, password, formattedDate);
                            this.props.handler(event.target.querySelector("#email").value);
                        } else {
                            this.setState({helperText1: "Please provide a vaild email."});
                        }
                    } else {
                        this.setState({helperText1: "The email is already registered."});
                    }
                }
            }
        }
    };

    renderSwitch() {
        switch (this.state.intent) {
            case "login":
                return (
                    <form noValidate autoComplete="off" onSubmit={this.handleSubmit}>
                        <TextField label="Email" variant="outlined" required id="email"/>
                        <TextField label="Password" variant="outlined" type="password" required id="password" helperText={this.state.helperText2}/>
                        <Button variant="contained" size="large" type="submit">Log In</Button>
                        <Button variant="contained" size="small" onClick={() => {
                            this.props.toggleFade();
                            setTimeout(() => {
                                this.setState({intent: "signUp"})
                            }, 300)
                        }}>Sign Up</Button>
                    </form>
                );
            case "signUp":
                return (
                    <form noValidate autoComplete="off" onSubmit={this.handleSubmit}>
                        <TextField label="Name" variant="outlined" required id="name"/>
                        <TextField label="Email" variant="outlined" required id="email"/>
                        <TextField label="Password" variant="outlined" type="password" required id="password"/>
                        <TextField
                            id="date"
                            label="Birthday"
                            type="date"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            helperText={this.state.helperText1}
                        />
                        <Button variant="contained" size="small" type="submit">Sign Up</Button>
                    </form>
                )
        }
    }
    render() {
        return (
            this.renderSwitch()
        );
    }
}

function isDate18orMoreYearsOld(day, month, year) {
    //https://codereview.stackexchange.com/questions/118272/is-date-18-years-old
    return new Date(year+18, month-1, day) <= new Date();
}

export default Login