import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Snackbar from '@material-ui/core/Snackbar';
import { withStyles } from '@material-ui/core/styles';


const styles = theme => ({
    fab: {
        position: 'absolute',
        bottom: theme.spacing.unit * 2,
        right: theme.spacing.unit * 2,
      },
    dialogTitle: {
        borderBottom: `1px solid ${theme.palette.divider}`
    },
    dialogActions: {
        borderTop: `1px solid ${theme.palette.divider}`,
        padding: theme.spacing.unit,
        margin: 0
    }
  });


class InterviewersForm extends React.Component {
  constructor(props){
      super(props);
      let {name, last_name, email, phone_number, tecnologies_evaluated} = props.candidate;
      this.state = {
        open: props.openForm,
        openNotification: false,
        name,
        last_name,
        email,
        phone_number,
        tecnologies_evaluated,
        notificationMessage: '',
        candidateId: props.candidateId
      };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let {name, last_name, email, phone_number, tecnologies_evaluated} = nextProps.candidate;
    if (prevState.open !== nextProps.openForm) {
        return {
            open: nextProps.openForm,
            name,
            last_name,
            email,
            phone_number,
            tecnologies_evaluated,
            candidateId: nextProps.candidateId
        }
    }
    return null;
    }
  
  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleCloseNotification = () => {
    this.setState({ openNotification: false });
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  onSubmit = () => {
        let token = window.localStorage.getItem("token");
        let {name, last_name, email, phone_number, tecnologies_evaluated,candidateId} = this.state;
        let me = this;
        let id ='';
        if(candidateId) id = candidateId;
        fetch('http://wordpress-react-test.randomstudiosrd.com/wp-json/wp/v2/interviewers/' +id,{
            method: "POST",
            headers:{
                'Content-Type': 'application/json',
                'accept': 'application/json',
                'Authorization': 'Bearer '+token
            },
            body: JSON.stringify({
                fields:{
                    name:name,
                    last_name:last_name,
                    email:email,
                    phone_number:phone_number,
                    tecnologies_evaluated:tecnologies_evaluated
                },
                status:"publish"
            })
        }).then(function(response){
            return response.json();
        }).then(function(post){
            console.log(post);
            me.setState({ 
                name: '',
                last_name: '',
                email: '',
                phone_number: '',
                tecnologies_evaluated: '',
                notificationMessage: "Candidate Created!",
                openNotification:true
                })
            me.props.fetchCandidates();
            me.props.onCloseForm();
        }).catch(function(error){
            me.setState(
                {
                    notificationMessage: "There is a problem with the Fetch:" + error.message,
                    openNotification:true
                },
            )
        })
  }

  render() {
    const {classes} = this.props;
    return (
      <div>
        <Fab color="primary" aria-label="Add" className={classes.fab} onClick={this.props.onOpenForm}> 
            <AddIcon />
        </Fab>
        <Dialog
          open={this.state.open}
          onClose={this.props.onCloseForm}
          aria-labelledby="form-dialog-title"
          disableBackdropClick
          disableEscapeKeyDown
        >
          <DialogTitle id="form-dialog-title" className={classes.dialogTitle}>New Interviewer</DialogTitle>
          <DialogContent>
            
            <form>
                <TextField
                    margin="dense"
                    id="name"
                    label="Name"
                    fullWidth
                    value={this.state.name}
                    onChange={this.handleChange('name')}
                />
                <TextField
                    margin="dense"
                    id="last_name"
                    label="Last Name"
                    fullWidth
                    value={this.state.last_name}
                    onChange={this.handleChange('last_name')}
                />
                <TextField
                    margin="dense"
                    id="email"
                    label="Email Address"
                    type="email"
                    fullWidth
                    value={this.state.email}
                    onChange={this.handleChange('email')}
                />
                <TextField
                    margin="dense"
                    id="phone_number"
                    label="Phone Number"
                    fullWidth
                    value={this.state.phone_number}
                    onChange={this.handleChange('phone_number')}
                />
                 <TextField
                    margin="dense"
                    id="tecnologies_evaluated"
                    label="Tecnologies Evaluated"
                    fullWidth
                    value={this.state.tecnologies_evaluated}
                    onChange={this.handleChange('tecnologies_evaluated')}
                />
            </form>
            
          </DialogContent>
          <DialogActions className={classes.dialogActions}>
            <Button onClick={this.props.onCloseForm} color="primary" variant="contained">
              Cancel
            </Button>
            <Button onClick={this.onSubmit} color="secondary" variant="contained">
              {this.state.candidateId === undefined ? "Create" : "Update"}
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          anchorOrigin={{ vertical:'top', horizontal:'left' }}
          open={this.state.openNotification}
          onClose={this.handleCloseNotification}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{this.state.notificationMessage}</span>}
        />
      </div>
    );
  }
}

export default  withStyles(styles)(InterviewersForm);