import React from 'react';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import {Link} from 'react-router-dom'; 

const drawerWidth = 240;

const styles = theme => ({
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9,
    },
  },
  link:{
    padding: '0 16px',
    textDecoration: 'none'
  }
});

class LeftPanel extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            open: props.open
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.open !== nextProps.open) {
            return {
                open: nextProps.open
            }
        }
        return null;
    }

    render() {
        console.log(this.state.open)
        const { classes } = this.props;
        return(
            <Drawer
          variant="permanent"
          classes={{
            paper: classNames(classes.drawerPaper, !this.state.open && classes.drawerPaperClose),
          }}
          open={this.state.open}
        >
          <div className={classes.toolbarIcon}>
            <IconButton onClick={this.props.handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <List>
            <ListItem button>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <Link className={classes.link} to="/"><ListItemText primary="Dashboard" /></Link>
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <Link className={classes.link} to="/interviews"><ListItemText primary="Interviews" /></Link>
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <Link className={classes.link} to="/candidates"><ListItemText primary="Candidates" /></Link>
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <Link className={classes.link} to="/interviewers"><ListItemText primary="Interviewers" /></Link>
            </ListItem>
          </List>
          <Divider />
          
        </Drawer>
        )
    }
}


export default withStyles(styles)(LeftPanel);