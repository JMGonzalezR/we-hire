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
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
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


class InterviewerForm extends React.Component {
  constructor(props){
      super(props);
      let {interviewer, candidate, date, meeting_link, challenge_link, rate, comments, status} = props.candidate;
      this.state = {
        open: props.openForm,
        openNotification: false,
        interviewer, 
        candidate, 
        date, 
        meeting_link, 
        challenge_link, 
        rate, 
        comments, 
        status,
        notificationMessage: '',
        candidateId: props.candidateId,
        candidates:[],
        interviewers:[]
      };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let {interviewer, candidate, date, meeting_link, challenge_link, rate, comments, status} = nextProps.candidate;
    if (prevState.open !== nextProps.openForm) {
        return {
            open: nextProps.openForm,
            interviewer, 
            candidate, 
            date, 
            meeting_link, 
            challenge_link, 
            rate, 
            comments, 
            status,
            candidateId: nextProps.candidateId
        }
    }
    return null;
    }

    componentDidMount(){
        this.fetchCandidates();
        this.fetchInterviewers();
    }

    fetchCandidates = () => {
        let dataURL = "http://wordpress-react-test.randomstudiosrd.com/wp-json/acf/v3/candidates"  
        fetch(dataURL)
            .then(res => res.json())
            .then(res => {
                console.log(res);
                this.setState({
                    candidates:res
                })
            })
      }
    
    fetchInterviewers = () => {
        let dataURL = "http://wordpress-react-test.randomstudiosrd.com/wp-json/acf/v3/interviewers"  
        fetch(dataURL)
            .then(res => res.json())
            .then(res => {
                console.log(res);
                this.setState({
                    interviewers:res
                })
            })
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
        let {interviewer, candidate, date, meeting_link, challenge_link, rate, comments, status,candidateId} = this.state;
        let me = this;
        let id ='';
        if(candidateId) id = candidateId;
        fetch('http://wordpress-react-test.randomstudiosrd.com/wp-json/wp/v2/interviews/' +id,{
            method: "POST",
            headers:{
                'Content-Type': 'application/json',
                'accept': 'application/json',
                'Authorization': 'Bearer '+token
            },
            body: JSON.stringify({
                fields:{
                    interviewer, 
                    candidate, 
                    date, 
                    meeting_link, 
                    challenge_link, 
                    rate, 
                    comments, 
                    status,
                },
                status:"publish"
            })
        }).then(function(response){
            return response.json();
        }).then(function(post){
            console.log(post);
            me.setState({ 
                interviewer:'', 
                candidate:'', 
                date:'', 
                meeting_link:'', 
                challenge_link:'', 
                rate:'', 
                comments:'', 
                status:'',
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
          <DialogTitle id="form-dialog-title" className={classes.dialogTitle}>New Candidate</DialogTitle>
          <DialogContent>
            
            <form>
                <InputLabel htmlFor="interviewer-simple">Interviewer</InputLabel>
                <Select
                    margin="dense"
                    fullWidth
                    value={this.state.interviewer}
                    onChange={this.handleChange('interviewer')}
                    inputProps={{
                    name: 'interviewer',
                    id: 'interviewer-simple',
                    }}
                >
                    {
                        this.state.interviewers.map(data =>{
                            return(
                                <MenuItem value={data.acf.name +" "+ data.acf.last_name}>{data.acf.name +" "+ data.acf.last_name}</MenuItem>
                            )
                        })
                    }
                </Select>
                <InputLabel htmlFor="candidate-simple">Candidate</InputLabel>
                <Select
                    margin="dense"
                    fullWidth
                    value={this.state.candidate}
                    onChange={this.handleChange('candidate')}
                    inputProps={{
                    name: 'candidate',
                    id: 'candidate-simple',
                    }}
                >
                    {
                        this.state.candidates.map(data =>{
                            return(
                                <MenuItem value={data.acf.name +" "+ data.acf.last_name}>{data.acf.name +" "+ data.acf.last_name}</MenuItem>
                            )
                        })
                    }
                </Select>
                <TextField
                    margin="dense"
                    id="date"
                    label="Date"
                    fullWidth
                    type="date"
                    value={this.state.date}
                    InputLabelProps={{
                        shrink: true,
                      }}
                    onChange={this.handleChange('date')}
                />
                <TextField
                    margin="dense"
                    id="meeting_link"
                    label="Meeting Link"
                    fullWidth
                    value={this.state.meeting_link}
                    onChange={this.handleChange('meeting_link')}
                />
                <TextField
                    margin="dense"
                    id="challenge_link"
                    label="Challenge Link"
                    fullWidth
                    value={this.state.challenge_link}
                    onChange={this.handleChange('challenge_link')}
                />
                 <TextField
                    margin="dense"
                    id="rate"
                    label="Rate"
                    fullWidth
                    value={this.state.rate}
                    onChange={this.handleChange('rate')}
                />
                <TextField
                    margin="dense"
                    id="comments"
                    label="Comments"
                    fullWidth
                    value={this.state.comments}
                    onChange={this.handleChange('comments')}
                />
                <InputLabel htmlFor="status-simple">Status</InputLabel>
                <Select
                    margin="dense"
                    fullWidth
                    value={this.state.status}
                    onChange={this.handleChange('status')}
                    inputProps={{
                    name: 'status',
                    id: 'status-simple',
                    }}
                >
                    
                <MenuItem value="Scheduled">Scheduled</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
    
                </Select>
                
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

export default  withStyles(styles)(InterviewerForm);