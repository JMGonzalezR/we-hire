import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import EnhancedTableHead from '../../components/EnhancedTableHead';
import EnhancedTableToolbar from '../../components/EnhancedTableToolbar';
import InterviewsForm from './interviewsForm';

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const rows = [
  { id: 'interviewer', numeric: false, disablePadding: true, label: 'Interviewer' },
  { id: 'candidate', numeric: false, disablePadding: false, label: 'Candidate' },
  { id: 'date', numeric: false, disablePadding: false, label: 'Date' },
  { id: 'meeting_link', numeric: false, disablePadding: false, label: 'Meeting Link' },
  { id: 'challenge_link', numeric: false, disablePadding: false, label: 'Challenge Link' },
  { id: 'rate', numeric: false, disablePadding: false, label: 'Rate' },
  { id: 'comments', numeric: false, disablePadding: false, label: 'Comments' },
  { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
];



const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 1020,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});

class CandidatesGrid extends React.Component {


  state = {
    order: 'asc',
    orderBy: 'name',
    selected: [],
    data: [],
    page: 0,
    rowsPerPage: 5,
    dataSelected:{},
    openForm: false
  };

  componentDidMount(){
    this.fetchCandidates();
  }

  fetchCandidates = () => {
    let dataURL = "http://wordpress-react-test.randomstudiosrd.com/wp-json/acf/v3/interviews"  
    fetch(dataURL)
        .then(res => res.json())
        .then(res => {
            console.log(res);
            this.setState({
                data:res
            })
        })
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  handleSelectAllClick = event => {
    if (event.target.checked) {
      this.setState(state => ({ selected: state.data.map(n => n.id) }));
      return;
    }
    this.setState({ selected: [] });
  };

  handleClick = (event, id, data) => {
    const { selected, dataSelected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    let newDataSelected = {};
    //If you click in the row selected, it will remove it from selected
    if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } 
    else newSelected = [id];

    if(dataSelected !== data){
        newDataSelected = data;
    }

    this.setState({ selected: newSelected, dataSelected: newDataSelected });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  onDelete = () =>{
    let token = window.localStorage.getItem("token");
    let id = this.state.selected[0];
    let me = this;
    fetch('http://wordpress-react-test.randomstudiosrd.com/wp-json/wp/v2/interviews/'+id ,{
        method: "DELETE",
        headers:{
            'Content-Type': 'application/json',
            'accept': 'application/json',
            'Authorization': 'Bearer '+token
        },
        body: JSON.stringify({
            id
        })
    }).then(function(response){
        return response.json();
    }).then(function(post){
        console.log(post);
        me.setState({ 
            selected:[]
            })
        me.fetchCandidates();
    }).catch(function(error){
        console.log(error.message)
    })
  }

  onEdit = () =>{
        this.setState({openForm:true})
  }

  onCloseForm = () =>{
    this.setState({openForm:false, selected:[], dataSelected:{}})
  }

  render() {
    const { classes } = this.props;
    const { data, order, orderBy, selected, rowsPerPage, page, openForm } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
    const id = selected[0];
    return (
      <Paper className={classes.root}>
        
        <EnhancedTableToolbar numSelected={selected.length} title="Interviews" onDelete={this.onDelete} onEdit={this.onEdit} />
        <InterviewsForm fetchCandidates={this.fetchCandidates} candidate={this.state.dataSelected} onOpenForm={this.onEdit} openForm={openForm} candidateId={id} onCloseForm={this.onCloseForm}/>
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={data.length}
              rows={rows}
            />
            <TableBody>
              {stableSort(data, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(n => {
                  const isSelected = this.isSelected(n.id);
                  return (
                    <TableRow
                      hover
                      onClick={event => this.handleClick(event, n.id, n.acf)}
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={n.id}
                      selected={isSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox checked={isSelected} />
                      </TableCell>
                      <TableCell component="th" scope="row" padding="none">
                        {n.acf.interviewer}
                      </TableCell>
                      <TableCell >{n.acf.candidate}</TableCell>
                      <TableCell >{n.acf.date}</TableCell>
                      <TableCell >{n.acf.meeting_link}</TableCell>
                      <TableCell >{n.acf.challenge_link}</TableCell>
                      <TableCell >{n.acf.rate}</TableCell>
                      <TableCell >{n.acf.comments}</TableCell>
                      <TableCell >{n.acf.status}</TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page',
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </Paper>
    );
  }
}
export default withStyles(styles)(CandidatesGrid);