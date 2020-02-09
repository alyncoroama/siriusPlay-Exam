import React from 'react'
import PersonRoundedIcon from '@material-ui/icons/PersonRounded';
import Fade from "@material-ui/core/Fade";
import {withStyles} from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';

const HtmlTooltip = withStyles(theme => ({
    tooltip: {
        backgroundColor: '#f5f5f9',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 220,
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid #dadde9',
    },
}))(Tooltip);

class Header extends React.Component {
    state = {
        balance: this.props.balance,
        loggedIn: this.props.loggedIn,
        name: this.props.name,
        loading: false
    };

  render() {
      return (
          <header>
              <nav id="navbar" role="navigation" aria-label="main navigation">
                  <div id={"logo"} onClick={() => {
                      if(!this.state.loading) {
                          this.props.initialize("initial")
                      }}}>
                  </div>
                  <div id={"logIn"}>

                      {this.state.loggedIn ?
                          <div>
                          <p id={"name"}>{this.state.name}</p>
                          <HtmlTooltip
                              title={
                                  <React.Fragment>
                                      <p id="balanceDisplay">{this.state.name}<br/> Balance: {this.state.balance} DKK</p>
                                      <p className={"clickable"} onClick={ () => {this.props.openModal("loadBalance")}}>Load Balance</p>
                                      <p className={"clickable"} onClick={ () => {
                                          if(!this.state.loading) {
                                              this.props.logout(this);
                                          }
                                          }}>Logout</p>
                                  </React.Fragment>
                              }
                              TransitionComponent={Fade}
                              placement={"bottom-end"}
                              interactive
                              disableTouchListener
                              arrow
                          >
                          <PersonRoundedIcon/>
                          </HtmlTooltip>
                          </div>:
                          <p onClick={() => {this.props.initialize("login")}} className={"clickable"} >Log In</p>
                      }
                  </div>
              </nav>
          </header>
      );
  }
}


export default Header