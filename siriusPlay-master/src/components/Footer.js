import React from 'react'
import MailOutlineRoundedIcon from '@material-ui/icons/MailOutlineRounded';
import GitHubIcon from '@material-ui/icons/GitHub';


class Footer extends React.Component {


    render() {
        return (
            <footer>
                <div id={"contactUs"}>
                    <MailOutlineRoundedIcon onClick={() => {this.props.openModal("contactUs")}}/>
                    <p>Contact Us</p>
                </div>
                <div id={"github"}>
                    <a href={"https://github.com/Valentin-Dumitrache/siriusPlay"}><GitHubIcon/></a>
                    <p>About Us</p>
                </div>
                <p id={"copyrights"}>© 2019 Sirius, Inc.</p>
                <div id={"noSign"}/>
                <p>Access to persons under the age of 18 is strictly prohibited. </p>
                <p>It is the responsibility of each player to act in accordance with the regulations in force as well as our terms and conditions. Gambling involves financial risk, play carefully.</p>
            </footer>
        );
    }
}

export default Footer