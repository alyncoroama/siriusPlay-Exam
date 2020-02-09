import React from "react";
import ReactDOM from "react-dom";
import Footer from "./components/Footer";
import Initial from './components/Initial';
import Fade from 'react-reveal/Fade';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Header from './components/Header';
import Login from "./components/Login";
import CircularProgress from '@material-ui/core/CircularProgress';
import './scss/style.scss';
import Cookies from 'js-cookie'
import Modal from 'react-awesome-modal';
import CookieConsent from "react-cookie-consent";
import Database from './components/Database';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Play from "./components/Play";

let email = "";
let loggedIn = false;
let balance = 100;
let name = "";
const mountNode = document.getElementById("app");
const rules = "<p id='rulesTitle'>Rules</p>\n" +
    "    <div id='generalRules'>\n" +
    "        <p>1.Each player starts alternately.</p>\n" +
    "        <p>2.The one that starts will pick a rule.</p>\n" +
    "        <p>3.You pick a bet and play!</p>\n" +
    "    </div>\n" +
    "    <section id='generalRules2'>\n" +
    "        <div>\n" +
    "            <p>A) Bigger wins</p>\n" +
    "            <p>A bigger dice combination will win</p>\n" +
    "            <p>* extra rule *</p>\n" +
    "        </div>\n" +
    "        <div>\n" +
    "            <p>B) Smaller Wins + A smaller dice combination will win</p>\n" +
    "            <p>* extra rule *</p>\n" +
    "        </div>\n" +
    "        <div>\n" +
    "            <p>C) Clean</p>\n" +
    "            <p>3:3; 5:5; 6:6; 6:5; are instant winning dices</p>\n" +
    "            <p>1:1; 2:2; 2:1; 4:4; are losing dices</p>\n" +
    "            <p>And if none is hit, biggest wins</p>\n" +
    "        </div>\n" +
    "        <div>\n" +
    "            <p>D) Half Half</p>\n" +
    "            <p>It’s basically the best out of 3 games of Clean</p>\n" +
    "        </div>\n" +
    "        <div>\n" +
    "            <p>E) The Easy Woman</p>\n" +
    "            <p>The first one that rolls 7 wins</p>\n" +
    "        </div>\n" +
    "        <div>\n" +
    "            <p>F)Paracyclist</p>\n" +
    "            <p>You always lose, you can’t pick this rule either.</p>\n" +
    "        </div>\n" +
    "        <div>\n" +
    "            <p>* extra rule *</p>\n" +
    "            <p>If a player rolls out a double then the game becomes a double game, where you must roll only doubles.</p>\n" +
    "        </div>\n" +
    "    </section>";
const stateLoginHelper = (param, boolean)=> {
        param.setState({
            loggedIn: boolean
        })
};
let mobileModalWidth = () => {
    if(window.mobilecheck()) {
        return "90%"
    } else {
        return "50%"
    }
};
let userMatcher = email => {
    if(Database.userList === undefined) {
        setTimeout(initialize,500)
    }
    for (let i = 0; i < Database.userList.length; i++) {
        if(Database.userList[i].getEmail() === email) {
            return Database.userList[i]
        }
    }
    return false;
};
const updateBalance = (param, value) => {
    param.setState({
        balance: value
    })
};
const initialRef = React.createRef();
const playRef = React.createRef();
const appRef = React.createRef();
const loginRef = React.createRef();
const headerRef = React.createRef();

const initialize = () => {
    if(Cookies.get("email") !== undefined) {
        email = Cookies.get("email");
        let user = userMatcher(email, Database.userList);
        if(user !== false) {
            balance = user.getBalance();
            name = user.getName();
            loggedIn = true;
        } else {
            email = "";
        }
    }
    setTimeout( () => {
        appRef.current.setState({show1: true});
        console.clear();
    }, 500);
    ReactDOM.render(<App loggedIn={loggedIn} email={email} balance={balance} name={name} ref={appRef} />, mountNode);
};



class App extends React.Component {
    state = {
        loggedIn: this.props.loggedIn,
        stage: "initial",
        show: true,
        show1: false,
        loading: false,
        visible : false,
        modal: "l2p",
        email: this.props.email,
        name: this.props.name,
        balance: this.props.balance,
        checkedA: false,
        checkedB: false,
        checkedC: false
    };
    handleChange = e => e => {
        switch (e.target.value) {
            case "checkedA":
                this.setState({checkedA: !this.state.checkedA});
                this.setState({checkedC: false});
                this.setState({checkedB: false});
                break;
            case "checkedB":
                this.setState({checkedB: !this.state.checkedB});
                this.setState({checkedA: false});
                this.setState({checkedC: false});
                break;
            case "checkedC":
                this.setState({checkedC: !this.state.checkedC});
                this.setState({checkedA: false});
                this.setState({checkedB: false});
                break
        }

    };
    initialize = param => {
        if(!this.state.loading) {
            document.querySelector("#container").style.height = "92.5vh";
            this.switchStage(param);
            this.toggleFade();
        }
    };
    renderSwitchModal(param) {
        switch (param) {
            case 'l2p':
                return <div className={"modal"} dangerouslySetInnerHTML={{__html:rules}}></div>;
            case 'loadBalance':
                return (
                    <div className={"modal"}>
                        <p className="balanceText">Hello, please select an amount of balance to add to your account.</p>
                        <FormGroup row>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={this.state.checkedA}
                                        onChange={this.handleChange('checkedA')}
                                        value="checkedA"
                                        color="primary"
                                    />
                                } label="100 DKK"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={this.state.checkedB}
                                        onChange={this.handleChange('checkedB')}
                                        value="checkedB"
                                        color="primary"
                                    />
                                } label="250 DKK"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={this.state.checkedC}
                                        onChange={this.handleChange('checkedC')}
                                        value="checkedC"
                                        color="primary"
                                    />
                                } label="500 DKK"
                            />
                        </FormGroup>
                        <Button variant="contained" size="large" onClick={
                            () => {
                                let pickedValue = this.state.checkedA;
                                let value = 100;
                                if(!pickedValue) {
                                    pickedValue = this.state.checkedB;
                                    value = 250;
                                    if(!pickedValue) {
                                        value = 500
                                    }
                                }
                                Database.putToAPI(this.state.email, value, "Load");
                                this.state.balance = this.state.balance + value;
                                updateBalance(headerRef.current,  this.state.balance);
                                if(this.state.stage === "play") {
                                    updateBalance(playRef.current,  this.state.balance);
                                }
                                document.querySelector(".balanceText").innerHTML = "Succes, your amount will be loaded shortly.";
                                setTimeout( () => {
                                    this.closeModal();
                                    setTimeout(() => {
                                        document.querySelector(".balanceText").innerHTML = "Hello, please select an amount of balance to add to your account.";}, 100);
                                    this.setState({checkedA: false});
                                    this.setState({checkedB: false});
                                    this.setState({checkedC: false});
                                }, 2000)

                            }
                        }>Load</Button>

                    </div>
                );
            case 'contactUs':
                return (
                    <div className={"modal"}>
                        <p className="contactUsText">Hello, please do contact us for any matter.</p>
                        <form onSubmit={
                            event => {
                                event.preventDefault();
                                setTimeout(() => {
                                    this.closeModal();
                                    document.querySelector(".contactUsText").innerHTML = "Hello, please do contact us for any matter.";
                                }, 2000);
                                document.querySelector(".contactUsText").innerHTML = "Thank you for your, email, we will respond asap.";
                                Database.sendMail("Sender:" + document.querySelector("#modalEmail").value + " Message:" + document.querySelector("#modalMessage").value)
                            }
                        }>
                    <TextField label="Email" variant="outlined" required id="modalEmail"/>
                    <TextField label="Message" variant="outlined" required multiline rows="4" id="modalMessage"/>
                    <Button variant="contained" size="large" type="submit">Submit</Button>
                        </form>
                    </div>
                )
        }
    }
    renderSwitch(param) {
        switch(param) {
            case 'initial':
                return <Initial {...this.passedProps} ref={initialRef}/>;
            case 'login':
                return <Login {...this.passedProps} handler={this.handleLogin} matchUser={userMatcher} ref={loginRef}/>;
            case 'play':
                return <Play {...this.passedProps} balance={this.state.balance} handler={this.handleLogin} headerRef={headerRef} email={this.state.email} ref={playRef} appRef={appRef}/>;
        }
    }
    switchStage = param => {
        this.setState({stage: param});
    };
    toggleFade = () => {
        this.toggleHelper();
        setTimeout(this.toggleHelper, 300);
    };
    toggleHelper = () => {
        this.setState({loading: !this.state.loading });
        this.setState({show: !this.state.show });
    };
    openModal = param =>{
        this.setState({
            visible : true
        });
        this.setState({
            modal: param
        });
    };
    closeModal = () => {
        this.setState({
            visible : false
        });
    };
    handleLogin = email => {
        this.setState({
            loggedIn: true
        });
        this.cookieLoggedIn(email);
        this.initialize("initial");

        stateLoginHelper(headerRef.current, true);
    };
    cookieLoggedIn = email => {
        let user = userMatcher(email);
        this.setState({
            email: email
        });
        this.setState({
            balance: user.getBalance()
        });
        this.setState({
            name: user.getName()
        });
        headerRef.current.setState({
            email: email
        });
        headerRef.current.setState({
            balance: user.getBalance()
        });
        headerRef.current.setState({
            name: user.getName()
        });
    };
    logoutHelper = param => {
        this.initialize("initial");
        this.state.balance = 100;
        this.state.email = "";
        this.state.name = "";
        stateLoginHelper(param, false);
        stateLoginHelper(this, false);
        stateLoginHelper(initialRef.current, false);
    };
    passedAccount = {
        email: this.state.email,
        balance: this.state.balance,
        name: this.state.name
    };
    passedProps = {
        loggedIn:this.state.loggedIn,
        openModal:this.openModal,
        initialize: this.initialize,
        toggleFade: this.toggleFade,
    };
    componentDidUpdate(prevProps, prevState, snapshot) {
        this.passedProps = {
            loggedIn:this.state.loggedIn,
            openModal:this.openModal,
            initialize: this.initialize,
            toggleFade: this.toggleFade
        };
    }
    sourceVideo = () => {
        if(mobilecheck()) {
            return <div id="videoImage"></div>
        } else {
            return (
                <video id={"videoBugFix2"} poster="poster.jpg" autoPlay loop muted playsinline>
                    <source src="video.mp4" type="video/mp4"/>
                </video>
            )
        }
    }
    render() {
        return (
            <div id="videoBugFix">
                {this.sourceVideo()}
                    <CookieConsent>
                        This website uses cookies to enhance your browsing experience.
                    </CookieConsent>
                <Header {...this.passedProps} {...this.passedAccount}logout={this.logoutHelper} ref={headerRef}/>
                <div id="container">
                    <Fade when={this.state.show}>
                                {this.renderSwitch(this.state.stage)}
                    </Fade>
                    <Modal visible={this.state.visible} width={mobileModalWidth()} height="70%" effect="fadeInUp" onClickAway={() => this.closeModal()}>
                        <div id={"modal"}>
                            {this.renderSwitchModal(this.state.modal)}
                        </div>
                    </Modal>
                </div>
                <Footer openModal={this.openModal}/>
            </div>
                )
    }

}



Database.updateFromAPI();
ReactDOM.render(
    <div id="placementForLoading">
    <CircularProgress id={"loading"} />
    </div>
    , mountNode);
initialize();
window.mobilecheck = function() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};
export default App;