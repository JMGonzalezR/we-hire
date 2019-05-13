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

let counter = 0;
function createData(interviewer, candidate, date, meetingLink, challengeLink, rate, comments, status) {
  counter += 1;
  return { id: counter, interviewer, candidate, date, meetingLink, challengeLink, rate, comments, status };
}

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
  { id: 'meetingLink', numeric: false, disablePadding: false, label: 'Meeting Link' },
  { id: 'challengeLink', numeric: false, disablePadding: false, label: 'Challenge Link' },
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

class InterviewsGrid extends React.Component {
  state = {
    order: 'asc',
    orderBy: 'interviewer',
    selected: [],
    data: [
      createData('Gerald Canario', 'Juan Gonzalez' , new Date(), "meetinglink.com", "challengelink.com", "20-25", "React Developer", "Scheduled"),
      createData('Cristophe', 'Andrea' , new Date(), "meetinglink.com", "challengelink.com", "10-15", "Python Developer", "Scheduled"),
      createData('Franchesca', 'Manuel' , new Date(), "meetinglink.com", "challengelink.com", "15-20", "Wordpress Developer", "Scheduled"),
      createData('Michael', 'Jose' , new Date(), "meetinglink.com", "challengelink.com", "20-25", "Angular Developer", "Scheduled"),
      createData('Tim', 'Dionys' , new Date(), "meetinglink.com", "challengelink.com", "20-25", "React Developer", "Scheduled")
    ],
    page: 0,
    rowsPerPage: 5,
  };

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

  handleClick = (event, id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    this.setState({ selected: newSelected });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  render() {
    const { classes } = this.props;
    const { data, order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
   console.log(data);
    return (
      <Paper className={classes.root}>
        <EnhancedTableToolbar numSelected={selected.length} title="Interviews" />
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
                      onClick={event => this.handleClick(event, n.id)}
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
                        {n.interviewer}
                      </TableCell>
                      <TableCell align="right">{n.candidate}</TableCell>
                      <TableCell align="right">{n.date.toDateString()}</TableCell>
                      <TableCell align="right">{n.meetingLink}</TableCell>
                      <TableCell align="right">{n.challengeLink}</TableCell>
                      <TableCell align="right">{n.rate}</TableCell>
                      <TableCell align="right">{n.comments}</TableCell>
                      <TableCell align="right">{n.status}</TableCell>
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
export default withStyles(styles)(InterviewsGrid);