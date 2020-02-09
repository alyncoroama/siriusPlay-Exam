import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import React from "react";

const longText = "This will prompt you to play as a guest as you are not logged in yet. You will receive 100 DKK if you decide to sign up afterwards";


class Initial extends React.Component {
    state = {
      loggedIn: this.props.loggedIn
    };


    render() {
        return (
            <div id={"initial"}>
                {this.state.loggedIn ?
                    <Button onClick={ ()=> {this.props.initialize("play")}} variant="contained" size="large" >Play Now</Button>
                    :
                    <Tooltip title={longText} placement={"top"} TransitionComponent={Zoom} disableTouchListener>
                        <Button onClick={ ()=> {
                            this.props.initialize("play");
                        }} variant="contained" size="large">Play Now</Button>
                    </Tooltip>
                }
                <Button variant="contained" size="small" onClick={ () => {this.props.openModal('l2p')}}>How to Play?</Button>
            </div>
        );
    }
}



export default Initial