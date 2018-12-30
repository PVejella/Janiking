import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';

//Material UI core and icons
import {
    Table, TableBody, TableCell, TableHead, TableFooter, TablePagination, TableRow, TableSortLabel,
    Toolbar, Typography, Paper, Checkbox, IconButton, Tooltip, Select, OutlinedInput, MenuItem, FormControl, InputLabel
} from '@material-ui/core'

import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import {lighten} from '@material-ui/core/styles/colorManipulator';
import connect from "react-redux/es/connect/connect";
import ReactDOM from "react-dom";
import _ from "lodash";

let counter = 0;

function createData(billing, calories, fat, carbs, protein)
{
    return {
        id: counter++,
        billing,
        calories,
        fat,
        carbs,
        protein
    };
}

function desc(a, b, orderBy)
{
    if ( b[orderBy] < a[orderBy] )
    {
        return -1;
    }
    if ( b[orderBy] > a[orderBy] )
    {
        return 1;
    }
    return 0;
}

function stableSort(array, cmp)
{
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = cmp(a[0], b[0]);
        if ( order !== 0 ) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy)
{
    return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const rows = [
    {
        id            : 'billing',
        numeric       : false,
        disablePadding: false,
        label         : 'Billing'
    },
    {
        id            : 'service',
        numeric       : false,
        disablePadding: false,
        label         : 'Service'
    },
    {
        id            : 'description',
        numeric       : false,
        disablePadding: false,
        label         : 'Description'
    },
    {
        id            : 'quantity',
        numeric       : true,
        disablePadding: false,
        label         : 'Quantity'
    },
    {
        id            : 'amount',
        numeric       : true,
        disablePadding: false,
        label         : 'Amount'
    },
    {
        id            : 'markup',
        numeric       : true,
        disablePadding: false,
        label         : 'Markup (%)'
    },
    {
        id            : 'extend_amount',
        numeric       : true,
        disablePadding: false,
        label         : 'Extended Amount'
    }
];

class InvoiceLineTableHead extends React.Component {
    createSortHandler = property => event => {
        this.props.onRequestSort(event, property);
    };

    render()
    {
        const {classes, onSelectAllClick, order, orderBy, numSelected, rowCount} = this.props;

        return (
            <TableHead style={{backgroundColor: "lightgray"}}>
                <TableRow>
                    {rows.map(row => {
                        return (
                            <TableCell
                                key={row.id}
                                numeric={row.numeric}
                                padding={row.disablePadding ? 'none' : 'default'}
                                sortDirection={orderBy === row.id ? order : false}
                            >
                                <Tooltip
                                    title="Sort"
                                    placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                                    enterDelay={300}
                                >
                                    <TableSortLabel
                                        active={orderBy === row.id}
                                        direction={order}
                                        onClick={this.createSortHandler(row.id)}
                                    >
                                        {row.label}
                                    </TableSortLabel>
                                </Tooltip>
                            </TableCell>
                        );
                    }, this)}
                    <TableCell padding="checkbox">
                        <Checkbox
                            indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={numSelected === rowCount}
                            onChange={onSelectAllClick}
                        />
                    </TableCell>
                </TableRow>
            </TableHead>
        );
    }
}


InvoiceLineTableHead.propTypes = {
    numSelected     : PropTypes.number.isRequired,
    onRequestSort   : PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order           : PropTypes.string.isRequired,
    orderBy         : PropTypes.string.isRequired,
    rowCount        : PropTypes.number.isRequired
};

const toolbarStyles = theme => ({
    root     : {
        paddingRight: theme.spacing.unit
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color          : theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85)
            }
            : {
                color          : theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark
            },
    spacer   : {
        flex: '1 1 100%'
    },
    actions  : {
        color: theme.palette.text.secondary
    },
    title    : {
        flex: '0 0 auto'
    }
});

let InvoiceLineTableToolbar = props => {
    const {numSelected, classes} = props;

    return (
        <Toolbar
            className={classNames(classes.root, {
                [classes.highlight]: numSelected > 0
            })}
        >
            <div className={classes.title}>
                {numSelected > 0 ? (
                    <Typography color="inherit" variant="subtitle1">
                        {numSelected} selected
                    </Typography>
                ) : (
                    <Typography variant="h6" id="tableTitle">
                        Invoice Lines
                    </Typography>
                )}
            </div>
            <div className={classes.spacer}/>
            <div className={classes.actions}>
                {numSelected > 0 ? (
                    <Tooltip title="Delete">
                        <IconButton aria-label="Delete">
                            <DeleteIcon/>
                        </IconButton>
                    </Tooltip>
                ) : (
                    <Tooltip title="Filter list">
                        <IconButton aria-label="Filter list">
                            <FilterListIcon/>
                        </IconButton>
                    </Tooltip>
                )}
            </div>
        </Toolbar>
    );
};

InvoiceLineTableToolbar.propTypes = {
    classes    : PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired
};

InvoiceLineTableToolbar = withStyles(toolbarStyles)(InvoiceLineTableToolbar);

const styles = theme => ({
    root        : {
        width    : '100%',
        marginTop: theme.spacing.unit * 3,
        head: {
            color: 'black',
        },
        '& thead tr th':{
            color: 'black!important',
            fontWeight: 700,
            fontSize: 14
        },
        InvoiceLineHeadRoot:{
            backgroundColor: 'lightgray',
        }
    },
    table       : {
        minWidth: 1020
    },
    tableWrapper: {
        overflowX: 'auto'
    }
});

class InvoiceLineTable extends React.Component {
    state = {
        order      : 'asc',
        orderBy    : 'calories',
        selected   : [],
        data       : [
            createData('Regular Billing', 305, 3.7, 67, 4.3),
        ],
        page       : 0,
        rowsPerPage: 5,
        labelWidth: 0,
    };

    componentDidMount(){
        if(this.InputLabelRef) {
            this.setState({
                labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth
            });
        }
    }

    handleRequestSort = (event, property) => {
        const orderBy = property;
        let order = 'desc';

        if ( this.state.orderBy === property && this.state.order === 'desc' )
        {
            order = 'asc';
        }

        this.setState({
            order,
            orderBy
        });
    };

    handleSelectAllClick = event => {
        if ( event.target.checked )
        {
            this.setState(state => ({selected: state.data.map(n => n.id)}));
            return;
        }
        this.setState({selected: []});
    };

    handleClick = (event, id) => {
        const {selected} = this.state;
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if ( selectedIndex === -1 )
        {
            newSelected = newSelected.concat(selected, id);
        }
        else if ( selectedIndex === 0 )
        {
            newSelected = newSelected.concat(selected.slice(1));
        }
        else if ( selectedIndex === selected.length - 1 )
        {
            newSelected = newSelected.concat(selected.slice(0, -1));
        }
        else if ( selectedIndex > 0 )
        {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }

        this.setState({selected: newSelected});
    };

    handleChangePage = (event, page) => {
        this.setState({page});
    };

    handleChangeRowsPerPage = event => {
        this.setState({rowsPerPage: event.target.value});
    };

    handleChangeBilling = (event, n) => {
        console.log('row=>', n);
        console.log('event.target.value=>', event.target.value);
        console.log('event.target.name=>', event.target.name);

        let newData = this.state.data.map(row=>{
            let temp = row;
           if(n.id===row.id){
               temp[event.target.name] = event.target.value
           }
           return temp;
        });

        this.setState({data: newData})
    };

    isSelected = id => this.state.selected.indexOf(id) !== -1;

    render()
    {
        const {classes} = this.props;
        const {data, order, orderBy, selected, rowsPerPage, page} = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

        return (
            <Paper className={classes.root}>
                <InvoiceLineTableToolbar numSelected={selected.length}/>
                <div className={classes.tableWrapper}>
                    <Table className={classes.table} aria-labelledby="tableTitle">
                        <InvoiceLineTableHead
                            className={classNames(classes.InvoiceLineHeadRoot)}
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={this.handleSelectAllClick}
                            onRequestSort={this.handleRequestSort}
                            rowCount={data.length}
                        />
                        <TableBody>
                            {stableSort(data, getSorting(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map(n => {
                                    const isSelected = this.isSelected(n.id);
                                    console.log('row=', n);
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
                                            <TableCell component="th" scope="row" >
                                                <FormControl variant="outlined" className={classes.formControl} style={{marginBottom: '0!important'}}>
                                                    <Select
                                                        value={n.billing}
                                                        onChange={(ev)=>this.handleChangeBilling(ev, n)}
                                                        input={
                                                            <OutlinedInput
                                                                labelWidth={this.state.labelWidth}
                                                                name="billing"
                                                                id="billing"
                                                            />
                                                        }
                                                    >
                                                        <MenuItem value="">
                                                            <em>Select</em>
                                                        </MenuItem>
                                                        <MenuItem value="Regular Billing">Regular Billing</MenuItem>
                                                        <MenuItem value="Additional Billing Office">Additional Billing Office</MenuItem>
                                                        <MenuItem value="Extra Work">Extra Work</MenuItem>
                                                        <MenuItem value="Client Supplies">Client Supplies</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </TableCell>
                                            <TableCell numeric>{n.calories}</TableCell>
                                            <TableCell numeric>{n.fat}</TableCell>
                                            <TableCell numeric>{n.carbs}</TableCell>
                                            <TableCell numeric>{n.protein}</TableCell>
                                            <TableCell padding="checkbox">
                                                <Checkbox checked={isSelected}/>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow style={{height: 49 * emptyRows}}>
                                    <TableCell colSpan={6}/>
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
                        'aria-label': 'Previous Page'
                    }}
                    nextIconButtonProps={{
                        'aria-label': 'Next Page'
                    }}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
            </Paper>
        );
    }
}

InvoiceLineTable.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(InvoiceLineTable);
