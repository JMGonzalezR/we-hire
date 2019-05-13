import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
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


class CandidateForm extends React.Component {
  state = {
    open: false,
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  render() {
    const {classes} = this.props;
    return (
      <div>
        <Fab color="primary" aria-label="Add" className={classes.fab} onClick={this.handleClickOpen}> 
            <AddIcon />
        </Fab>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
          disableBackdropClick
          disableEscapeKeyDown
        >
          <DialogTitle id="form-dialog-title" className={classes.dialogTitle}>New Candidate</DialogTitle>
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
                    id="position"
                    label="Opening/Position"
                    fullWidth
                    value={this.state.position}
                    onChange={this.handleChange('position')}
                />
            </form>
            
          </DialogContent>
          <DialogActions className={classes.dialogActions}>
            <Button onClick={this.handleClose} color="primary" variant="contained">
              Cancel
            </Button>
            <Button onClick={this.handleClose} color="secondary" variant="contained">
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default  withStyles(styles)(CandidateForm);