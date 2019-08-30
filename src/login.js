import React from "react";
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

const CssTextField = withStyles({
    root: {
        '& .MuiInputBase-input': {
            color: '#f5f5f5',
        },
        '& .MuiInputLabel-root': {
            color: '#f5f5f5',
        },
        '& label.Mui-focused': {
            color: '#f5f5f5',
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: '#f5f5f5',
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: '#f5f5f5',
            },
            '&:hover fieldset': {
                borderColor: '#f5f5f5',
            },
            '&.Mui-focused fieldset': {
                borderColor: '#f5f5f5',
            },
        },
    },
})(TextField);

const LoginButton = withStyles({
    root: {
        background: '#3DA118',
        color: '#FFFFFF',
        '&:hover': {
            background: '#377A1F',
        }
    },
    label: {
        fontWeight: 'bold',
    }
})(Button);

const styles = theme => ({
    textField: {
        marginLeft: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    loginButton: {
        marginLeft: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
});

class Login extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            username: '',
            password: ''
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
    }

    handleUsernameChange(event) {
        this.setState({username: event.target.value})
    }

    handlePasswordChange(event) {
        this.setState({password: event.target.value})
    }

    handleSubmit(event) {
        event.preventDefault()
        if (this.state.username === 'sugar' && this.state.password === 'sugar2019') {
            window.location.reload()
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <form className="wrapper login" onSubmit={this.handleSubmit}>
                <div style={{border: '2px solid #FFFFFF', width: '300px', height: '250px', borderRadius: '10px'}}>
                    <div className="item">
                        <Typography variant="h4" style={{color: '#FFFFFF'}}>Login</Typography>
                    </div>
                    <div className="item">
                        <CssTextField
                            label="Username"
                            variant="outlined"
                            onChange={this.handleUsernameChange}
                        />
                    </div>
                    <div className="item">
                        <CssTextField
                            label="Password"
                            type="password"
                            variant="outlined"
                            onChange={this.handlePasswordChange}
                        />
                    </div>
                    <div className="item">
                        <LoginButton
                            className="full-width"
                            variant="contained"
                            type="submit"
                        >
                            Login
                        </LoginButton>
                    </div>
                </div>
            </form>
        )
    }
}

export default withStyles(styles)(Login);