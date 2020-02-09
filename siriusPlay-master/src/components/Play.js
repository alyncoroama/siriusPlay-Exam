import Button from '@material-ui/core/Button';
import React from "react";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from "@material-ui/core/FormGroup";
import ReactDice from 'react-dice-complete';
import NumberFormat from 'react-number-format';
import 'react-dice-complete/dist/react-dice-complete.css'
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";
import Database from "./Database";

let winSound = new Audio("win.mp3");
let rollSound = new Audio("roll.mp3");


class Play extends React.Component {
    state = {
        checkedA: true,
        checkedB: false,
        checkedC: false,
        checkedD: false,
        checkedE: false,
        loading: false,
        extraRule: false,
        balance: this.props.balance,
        email: this.props.email,
        pickedRule: "Bigger wins",
        conclusion: "",
        turn: "Your Turn",
        rollTurn: "(Your Roll)",
        roll: 0,
        value: "0",
        notEnough: "Balance: " + this.props.balance + " DKK"
    };
    handleChange = e => e => {
        if(!this.state.loading && this.state.turn === "Your Turn") {
            switch (e.target.value) {
                case "checkedA":
                    this.setState({checkedA: !this.state.checkedA});
                    this.setState({pickedRule: "Bigger wins"});
                    this.setState({checkedB: false});
                    this.setState({checkedC: false});
                    this.setState({checkedD: false});
                    this.setState({checkedE: false});
                    break;
                case "checkedB":
                    this.setState({checkedA: false});
                    this.setState({checkedB: !this.state.checkedB});
                    this.setState({pickedRule: "Smaller wins"});
                    this.setState({checkedC: false});
                    this.setState({checkedD: false});
                    this.setState({checkedE: false});
                    break;
                case "checkedC":
                    this.setState({checkedA: false});
                    this.setState({checkedB: false});
                    this.setState({checkedC: !this.state.checkedC});
                    this.setState({pickedRule: "Clean"});
                    this.setState({checkedD: false});
                    this.setState({checkedE: false});
                    break;
                case "checkedD":
                    this.setState({checkedA: false});
                    this.setState({checkedB: false});
                    this.setState({checkedC: false});
                    this.setState({checkedD: !this.state.checkedD});
                    this.setState({pickedRule: "Half Half"});
                    this.setState({checkedE: false});
                    break;
                case "checkedE":
                    this.setState({checkedA: false});
                    this.setState({checkedB: false});
                    this.setState({checkedC: false});
                    this.setState({checkedD: false});
                    this.setState({checkedE: !this.state.checkedE});
                    this.setState({pickedRule: "The Easy Woman"});
                    break;
            }
        }
    };
    checkValue = val => {
        if(val === undefined) {}
        else {
            if(!this.state.loading) {
                if(val.target.value > this.state.balance || val.target.value < 0) {
                    this.setState({value: 0});
                    this.setState({notEnough: "Not enough DKK"});
                } else {
                    this.setState({notEnough: "Balance: " + this.state.balance + " DKK"});
                }
            } else {
                this.setState({value: this.betValue})
            }
        }
    };
    firstRoll;
    secondRoll;
    firstRollDice1;
    firstRollDice2;
    secondRollDice1;
    secondRollDice2;
    i = 0;
    betValue;
    firstDice = false;
    won = false;
    halfHalfWinCounter = 0;
    halfHalfLoseCounter = 0;
    play = () => {
        if(parseInt(this.state.value, 10) <= 0 || this.state.value === "") {
            this.setState({notEnough: "Please insert an amount."});
        } else {
            if (!this.state.loading) {
                this.betValue = this.state.value;
                this.setState({notEnough: "Balance: " + this.state.balance + " DKK"});
                this.setState({loading: true});
                this.props.headerRef.current.setState({loading: true});
                this.setState({conclusion: ""});
                document.querySelector("#conclusion").style.display = "none";
                this.won = false;
                this.roll();
            }
        }
    };
    roll = () => {
        this.rollAll();
        if(this.state.pickedRule !== "Clean" && this.state.pickedRule !== "Half Half" && this.state.pickedRule !== "Double game") {
                setTimeout( () => {
                    this.firstRoll = this.state.roll;
                    this.firstRollDice1 = document.querySelectorAll(".die-container")[0].children[0].classList[1].replace("roll", "");
                    this.firstRollDice2 = document.querySelectorAll(".die-container")[1].children[0].classList[1].replace("roll", "");
                },2100);
                setTimeout( () => {
                    this.rollAll();
                }, 4000);
                setTimeout( () => {
                    this.secondRoll = this.state.roll;
                    this.secondRollDice1 = document.querySelectorAll(".die-container")[0].children[0].classList[1].replace("roll", "");
                    this.secondRollDice2 = document.querySelectorAll(".die-container")[1].children[0].classList[1].replace("roll", "");
                    this.handleRoll()
                }, 6100)
            } else {
            this.firstDice = !this.firstDice;
            if(this.firstDice) {
                setTimeout( () => {
                    this.firstRoll = this.state.roll;
                    this.firstRollDice1 = document.querySelectorAll(".die-container")[0].children[0].classList[1].replace("roll", "");
                    this.firstRollDice2 = document.querySelectorAll(".die-container")[1].children[0].classList[1].replace("roll", "");
                    this.handleRoll(this.firstRollDice1, this.firstRollDice2);
                },2100);
            } else {
                setTimeout( () => {
                    this.secondRoll = this.state.roll;
                    this.secondRollDice1 = document.querySelectorAll(".die-container")[0].children[0].classList[1].replace("roll", "");
                    this.secondRollDice2 = document.querySelectorAll(".die-container")[1].children[0].classList[1].replace("roll", "");
                    this.handleRoll(this.secondRollDice1, this.secondRollDice2)
                },2100);
            }
        }
    };
    handleRoll = (dice1, dice2) => {
        setTimeout( () => {
            switch (this.state.pickedRule) {
                case "Bigger wins":
                case "Smaller wins":
                     if(this.state.pickedRule === "Bigger wins") {
                         this.won = this.firstRoll > this.secondRoll;
                     } else {
                         this.won = this.firstRoll < this.secondRoll;
                     }
                     if(this.firstRollDice1 === this.firstRollDice2 || this.secondRollDice1 === this.secondRollDice2) {
                         if(this.firstRollDice1 === this.firstRollDice2 && this.secondRollDice1 === this.secondRollDice2) {
                             this.setState({pickedRule: "Double game"});
                             this.roll()
                         } else {
                             this.won = this.firstRollDice1 === this.firstRollDice2;
                             this.giveBalance();
                         }
                     } else {
                         if(this.firstRoll === this.secondRoll) {
                             this.roll();
                         } else {
                             this.giveBalance();
                         }
                     }
                    break;
                case "Double game":
                    this.double(dice1, dice2);
                    break;
                case "Clean":
                case "Half Half":
                    this.clean(dice1, dice2);
                    break;
                case "The Easy Woman":
                    if(this.firstRoll === 7 || this.secondRoll === 7) {
                        if(this.firstRoll === 7) {
                            this.won = true;
                        }
                        this.giveBalance();
                    } else {
                        this.setState({loading: false});
                        this.play();
                    }
                    break;
                case "Paracyclist":
                    this.won = true;
                    this.giveBalance();
                    break;
            }
        }, 2000)
    };
    double = (firstDice, secondDice) => {
        if(firstDice !== secondDice) {
            if(!this.firstDice) {
                this.won = true;
            }
            this.giveBalance();
        } else {
            this.roll()
        }
    };
    clean = (firstDice, secondDice) => {
        let done = false;
        firstDice = parseInt(firstDice, 10);
        secondDice = parseInt(secondDice, 10);
        if(
            (
                firstDice === 6
        &&
                secondDice === 6
            )
        ||
            (
                firstDice === 6
        &&
                secondDice === 5
            )
        ||
            (
                firstDice === 5
        &&
                secondDice === 6
            )
        ||
            (
                firstDice === 5
        &&
                secondDice === 5
            )
        ||
            (
                firstDice === 3
        &&
                secondDice === 3
            )
        ) {
            done = true;
            if(this.firstDice) {
                this.won = true;
                this.giveBalance(done);
            } else {
                this.giveBalance()
            }

        }
        if(
            (
                firstDice === 1
                &&
                secondDice === 1
            )
            ||
            (
                firstDice === 1
                &&
                secondDice === 2
            )
            ||
            (
                firstDice === 2
                &&
                secondDice === 2
            )
            ||
            (
                firstDice === 2
                &&
                secondDice === 1
            )
            ||
            (
                firstDice === 4
                &&
                secondDice === 4
            )
        ) {
            done = true;
            if(!this.firstDice) {
                this.won = true;
                this.giveBalance();
            } else {
                this.giveBalance(done);
            }


        }
        if(!done) {
            if(!this.firstDice) {
                if(this.firstRoll !== this.secondRoll) {
                    if(this.firstRoll > this.secondRoll) {
                        this.won = true;
                    }
                    this.giveBalance();
                } else {
                    this.roll();
                }
            } else {
                this.roll();
            }
        }

    };
    giveBalance = cleanDone => {
        if (this.state.turn === "Your Turn" && this.won) {
            if(this.state.pickedRule === "Half Half") {
                this.halfHalfWinCounter++;
                if(this.halfHalfWinCounter === 2) {
                    this.wonConclusion();
                }
            } else {
                this.wonConclusion();
            }
        }
        if (this.state.turn === "Your Turn" && !this.won) {
            if(this.state.pickedRule === "Half Half") {
                this.halfHalfLoseCounter++;
                if(this.halfHalfLoseCounter === 2) {
                    this.lost();
                }
            } else {
                this.lost();
            }
        }
        if (this.state.turn === "Opponent's Turn" && !this.won) {
            if(this.state.pickedRule === "Half Half") {
                this.halfHalfWinCounter++;
                if(this.halfHalfWinCounter === 2) {
                    this.wonConclusion();
                }
            } else {
                this.wonConclusion();
            }

        }
        if (this.state.turn === "Opponent's Turn" && this.won) {
            if(this.state.pickedRule === "Half Half") {
                this.halfHalfLoseCounter++;
                if(this.halfHalfLoseCounter === 2) {
                    this.lost();
                }
            } else {
                this.lost();
            }
        }
        if(this.state.pickedRule === "Half Half") {
            if(this.halfHalfWinCounter === 2 || this.halfHalfLoseCounter === 2) {
                this.reload();
            } else {
                if(cleanDone) {
                    if(this.state.rollTurn === "(Opponent's Roll)") {
                        this.setState({rollTurn: "(Your Roll)"});
                    } else {
                        this.setState({rollTurn: "(Opponent's Roll)"});
                    }
                    this.firstDice = false;
                }
                this.won = false;
                this.roll();
            }
        } else {
            this.reload();
        }
    };
    reload = () => {
        if (this.state.email !== "") {
            Database.putToAPI(this.state.email, this.state.balance, "replace");
            this.props.headerRef.current.setState({balance: this.state.balance});
            this.props.appRef.current.setState({balance: this.state.balance});
        } else {
            if (this.state.balance === 0) {
                setTimeout(() => {
                    this.props.initialize("login")
                }, 2000)
            }
        }
        this.setState({loading: false});
        this.props.headerRef.current.setState({loading: false});
        this.setState({notEnough: "Balance: " + this.state.balance + " DKK"});
        if (this.state.turn === "Your Turn") {
            this.setState({turn: "Opponent's Turn"});
            this.setState({rollTurn: "(Opponent's Roll)"});
            this.pickRule();
        } else {
            this.setState({turn: "Your Turn"});
            this.setState({rollTurn: "(Your Roll)"});
            this.pickRule("Player");
        }
        this.won = false;
        this.halfHalfWinCounter = 0;
        this.halfHalfLoseCounter = 0;
        this.i = 0;
        this.firstDice = false;
        this.setState({value: 0});
    };
    pickRule = who => {
        let rules = ["Bigger wins", "Smaller wins", "Clean", "Half Half", "The Easy Woman", "Paracyclist"];
        let randomNumber =Math.floor(Math.random() * 6);
        if(who === "Player") {
            this.setState({checkedA: true});
            this.setState({pickedRule: rules[0]});
        } else {
            this.setState({checkedA: false});
            this.setState({pickedRule: rules[randomNumber]});
        }
        this.setState({checkedB: false});
        this.setState({checkedC: false});
        this.setState({checkedD: false});
        this.setState({checkedE: false});

    };
    wonConclusion = () => {
        this.setState({conclusion: "You Won"});
        winSound.play();
        document.querySelector("#conclusion").style.display = "block";
        if(!window.mobilecheck()) {
            document.querySelector("#conclusion").style.animation = "pulse 2s linear 5";
        }
        this.setState({balance: parseInt(this.state.balance, 10) + parseInt(this.state.value, 10)})
    };
    lost = () => {
        this.setState({conclusion: "You Lost"});
        if(!window.mobilecheck()) {
            document.querySelector("#conclusion").style.animation = "";
        }
        document.querySelector("#conclusion").style.display = "block";
        this.setState({balance: parseInt(this.state.balance, 10) - parseInt(this.state.value, 10)})
    };
    render() {
        return (
            <div id={"play"}>
                <h1 id="conclusion">{this.state.conclusion}</h1>
                <FormGroup id="firstGroup">
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={this.state.checkedA}
                                onChange={this.handleChange('checkedA')}
                                value="checkedA"
                                color="primary"
                            />
                        } label="Bigger wins"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={this.state.checkedB}
                                onChange={this.handleChange('checkedB')}
                                value="checkedB"
                                color="primary"
                            />
                        } label="Smaller Wins"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={this.state.checkedC}
                                onChange={this.handleChange('checkedC')}
                                value="checkedC"
                                color="primary"
                            />
                        } label="Clean"
                    />
                </FormGroup>
                <FormGroup id="secondGroup">
                    <div id="AI">
                        <p id="AII">{this.state.turn}{this.state.rollTurn}</p>
                        <p>Rule: {this.state.pickedRule}</p>
                        <p>Roll: {this.state.roll}</p>
                    </div>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={this.state.checkedD}
                                onChange={this.handleChange('checkedD')}
                                value="checkedD"
                                color="primary"
                            />
                        } label="Half Half"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={this.state.checkedE}
                                onChange={this.handleChange('checkedE')}
                                value="checkedE"
                                color="primary"
                            />
                        } label="The Easy Woman"
                    />
                </FormGroup>
                <div id="playGround">
                    <div id="dices">
                        <ReactDice
                            numDice={2}
                            rollDone={num => {this.changeRoll(num)}}
                            ref={dice => this.reactDice = dice}
                            faceColor="#B70707"
                            dotColor="white"
                            disableIndividual={true}
                        />
                    </div>
                </div>
                <Button id="playButton" onClick={() => {this.play()}}>Play</Button>
                <div id="numberFormatContainer">
                <NumberFormat value={this.state.value} customInput={TextField} helperText={this.state.notEnough}  onChange={this.checkValue} format={this.checkValue()} onValueChange={(values) => {
                    const {formattedValue, value} = values;
                    if(!this.state.loading) {
                        if(values > this.state.balance || values < 0) {
                            this.setState({value: 0})
                        } else {
                            this.setState({value: formattedValue})
                        }
                    }
                }}/>
                {bugFixer()}
                </div>
            </div>
        );
    }
    rollAll() {
        rollSound.play();
        if(this.i > 0) {
            if(this.state.rollTurn === "(Opponent's Roll)") {
                this.setState({rollTurn: "(Your Roll)"});
            } else {
                this.setState({rollTurn: "(Opponent's Roll)"});
            }
        }
        if(this.state.rollTurn === "(Your Roll)" && this.state.turn === "Your Turn") {
            this.i++
        }
        if(this.state.rollTurn === "(Opponent's Roll)" && this.state.turn === "Opponent's Turn") {
            this.i++
        }
        this.reactDice.rollAll()
    }
    changeRoll(num) {
        this.setState({roll: num})
    }
}

const bugFixer = () => {
    if(!window.mobilecheck()) {
        document.querySelector("#videoBugFix2").pause();
    }
    setTimeout(() => {
        if (window.mobilecheck()) {
            document.querySelector("#container").style.height = "60vh";
            document.querySelector("#play").style.height = "60vh";
            document.querySelector("#play").style.position = "relative";
        }
    }, 100)

};
//https://stackoverflow.com/questions/11381673/detecting-a-mobile-browser
window.mobilecheck = function() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};

export default Play