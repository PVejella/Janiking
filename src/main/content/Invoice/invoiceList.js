import React, {Component} from 'react';
import ReactTable from "react-table";
import _ from 'lodash';

// core components
import TextField from "@material-ui/core/TextField";
import {Hidden, Icon, IconButton, Fab, Input, Paper,} from '@material-ui/core';

// theme components
import {FusePageCustom, FuseAnimate,FuseSearch} from '@fuse';


import {bindActionCreators} from "redux";
import {withStyles} from "@material-ui/core";
import {withRouter} from 'react-router-dom';
import connect from "react-redux/es/connect/connect";
import * as Actions from 'store/actions';
import SummaryPanel from './SummaryPanel';
import FilterPanel from './filterPanel';

import moment from 'moment'
import checkboxHOC from "react-table/lib/hoc/selectTable";
import classNames from 'classnames';

const CheckboxTable = checkboxHOC(ReactTable);

const headerHeight = 100;

const styles = theme => ({
    root: {
        background    : "url('/assets/images/backgrounds/signin-bg.jpg') no-repeat",
        backgroundSize: 'cover',
    },
    layoutRoot: {
        flexDirection: 'row',
        '& .z-9999':{
            height: 64
        }
    },
    card: {
        width   : '100%',
        maxWidth: 384,
    },
    progress: {
        margin: theme.spacing.unit * 2,
    },
    layoutHeader       : {
        height   : headerHeight,
        minHeight: headerHeight,
        backgroundColor: theme.palette.secondary.main
    },
    layoutRightSidebar : {
        width: 300
    },
    layoutSidebarHeader: {
        height   : headerHeight,
        minHeight: headerHeight,
        display: 'flex',
        alignItems: 'center',
        backgroundColor: theme.palette.secondary.main
    },
    addButton          : {
        position: 'absolute',
        bottom  : -28,
        left    : 16,
        zIndex  : 999,
        backgroundColor: theme.palette.primary.light,
        '&:hover': {
            backgroundColor: theme.palette.primary.dark,
        }
    },
    imageIcon:{
        width: 24,
        height: 24
    },
    separator: {
        width          : 1,
        height         : '100%',
        backgroundColor: theme.palette.divider
    },
    search: {
        width: 360,
        [theme.breakpoints.down('sm')]: {
            width: '100%'
        }
    }
});
const defaultProps = {
    trigger: (<IconButton className="w-64 h-64"><Icon>search</Icon></IconButton>)
};

class InvoicePage extends Component {
    state = {
        s: '',
        temp: [],
        checkedPaid: true,
        checkedPP: true,
        checkedComplete: true,
        checkedOpen: true,
    };

    constructor(props){
        super(props);

        if(!props.bLoadedInvoices) {
            props.getInvoices();
        }

        this.escFunction = this.escFunction.bind(this);
    }

    componentWillMount(){
        this.setState({checkedPaid: this.props.transactionStatus.checkedPaid});
        this.setState({checkedPP: this.props.transactionStatus.checkedPP});
        this.setState({checkedComplete: this.props.transactionStatus.checkedComplete});
        this.setState({checkedOpen: this.props.transactionStatus.checkedOpen});

        this.getInvoicesFromStatus(this.props.transactionStatus)

    }

    getInvoicesFromStatus =(newprops=this.props.transactionStatus, rawData=this.props.invoices) =>{
        let temp=[];
        let all_temp=[];
        let temp1=[];
        const statusStrings = ['paid', 'paid partial', 'open', 'completed'];
        const keys=['checkedPaid', 'checkedPP', 'checkedOpen', 'checkedComplete'];

        if(rawData===null) return;

        let temp0 = rawData.Data;

        temp1 = keys.map((key, index)=> {

            if(newprops[key]){
                temp = temp0.filter(d => {
                    return d.TransactionStatus.toLowerCase() === statusStrings[index]
                });
            }
            all_temp =_.uniq([...all_temp, ...temp]);
        });
        this.setState({temp: all_temp})
    };

    componentWillReceiveProps(nextProps){
        let bChanged = false;
        if(this.props.transactionStatus.checkedPaid !== nextProps.transactionStatus.checkedPaid) {
            this.setState({checkedPaid: !this.state.checkedPaid});
            bChanged = true;
        }

        if(this.props.transactionStatus.checkedPP !== nextProps.transactionStatus.checkedPP) {
            this.setState({checkedPP: !this.state.checkedPP});
            bChanged = true;
        }

        if(this.props.transactionStatus.checkedComplete !== nextProps.transactionStatus.checkedComplete) {
            this.setState({checkedComplete: !this.state.checkedComplete});
            bChanged = true;
        }

        if(this.props.transactionStatus.checkedOpen !== nextProps.transactionStatus.checkedOpen) {
            this.setState({checkedOpen: !this.state.checkedOpen});
            bChanged = true;
        }

        if(bChanged)
            this.getInvoicesFromStatus(nextProps.transactionStatus);

        if(nextProps.invoices){
            this.getInvoicesFromStatus(nextProps.transactionStatus, nextProps.invoices);
        }
    }

    componentDidMount(){
        document.addEventListener("keydown", this.escFunction, false);
    }

    componentWillUnmount(){
        document.removeEventListener("keydown", this.escFunction, false);
    }

    escFunction(event){
        if(event.keyCode === 27) {
            this.setState({s: ''});
            this.getInvoicesFromStatus();
        }
    }
    search(val) {
        const temp = this.state.temp.filter( d => {
            return d.InvoiceId.toString().indexOf(val) !== -1 || !val ||
                d.InvoiceNo.indexOf(val) !== -1 ||
                d.InvoiceAmount.toString().indexOf(val) !== -1 ||
                d.InvoiceTotal.toString().indexOf(val) !== -1 ||
                d.InvoiceTax.toString().indexOf(val) !== -1 ||
                d.InvoiceDescription.toLowerCase().indexOf(val) !== -1 ||
                d.CustomerName.toLowerCase().indexOf(val) !== -1 ||
                d.CustomerId.toString().indexOf(val) !== -1 ||
                d.CustomerNo.toString().indexOf(val) !== -1 ||
                d.TransactionStatusListId.toString().indexOf(val) !== -1
        });

        this.setState({temp: temp});
    }

    handleChange = prop => event => {
        this.setState({ [prop]: event.target.value });

        if(prop==='s') {
            this.search(event.target.value.toLowerCase());
        }
    };

    toggleLeftSidebar = () => {
    };
    toggleRightSidebar = () => {
    };
    render()
    {
        const { classes,toggleFilterPanel, toggleSummaryPanel, filterState, summaryState } = this.props;
        return (
            <FusePageCustom
                classes={{
                    root: classes.layoutRoot,
                    rightSidebar : classes.layoutRightSidebar,
                    sidebarHeader: classes.layoutSidebarHeader,
                    header: classes.layoutHeader
                }}
                header={
                    <div className="flex row flex-1  p-8 sm:p-12 relative justify-between">
                        <div className="flex flex-row flex-1 justify-between">
                            <div className="flex items-center pl-0 lg:pl-0 p-24">
                                <Hidden smDown>
                                    <IconButton
                                        onClick={(ev) => toggleFilterPanel()}
                                        aria-label="toggle filter panel"
                                    >
                                        { !filterState && (
                                            <img className={classes.imageIcon} src="assets/images/invoices/filter.png"/>
                                        )}
                                        {filterState && (
                                            <Icon>close</Icon>
                                        )}
                                    </IconButton>
                                </Hidden>
                                <Hidden smUp>
                                    <IconButton
                                        onClick={(ev) => this.pageLayout.toggleLeftSidebar()}
                                        aria-label="toggle filter panel"
                                    >
                                        <img className={classes.imageIcon} src="assets/images/invoices/filter.png"/>
                                        {/*<Icon>menu</Icon>*/}
                                    </IconButton>
                                </Hidden>
                                {/*<div className="flex-1"><h4>Filter</h4></div>*/}
                            </div>
                            <div className="flex items-center pr-0 lg:pr-12 p-24">
                                {/*<div className="flex-1"><h4>Summary</h4></div>*/}
                                {/*<FuseSearch/>*/}
                                <Paper className={"flex items-center h-44 w-full lg:mr-12 xs:mr-0"} elevation={1}>
                                    <Input
                                        placeholder="Search..."
                                        className={classNames(classes.search, 'pl-16')}
                                        // className="pl-16"
                                        disableUnderline
                                        fullWidth
                                        value={this.state.s}
                                        onChange={this.handleChange('s')}
                                        inputProps={{
                                            'aria-label': 'Search'
                                        }}
                                    />
                                    <Icon color="action" className="mr-16">search</Icon>
                                </Paper>
                                <div className={classes.separator}/>
                                <Hidden smDown>
                                    <IconButton
                                        onClick={(ev) => toggleSummaryPanel()}
                                        aria-label="toggle summary panel"
                                        className="pr-0"
                                    >
                                        { !summaryState && (
                                            <Icon>insert_chart</Icon>
                                        )}
                                        {summaryState && (
                                            <Icon>close</Icon>
                                        )}
                                    </IconButton>
                                </Hidden>
                                <Hidden smUp>
                                    <IconButton
                                        onClick={(ev) => this.pageLayout.toggleRightSidebar()}
                                        aria-label="toggle summary panel"
                                    >
                                        <Icon>insert_chart</Icon>
                                    </IconButton>
                                </Hidden>
                            </div>
                        </div>
                        <div className="flex flex-none items-end">
                            <FuseAnimate animation="transition.expandIn" delay={600}>
                                <Fab color="secondary" aria-label="add" className={classes.addButton} onClick={() => alert('ok')}>
                                    <Icon>add</Icon>
                                </Fab>
                            </FuseAnimate>
                        </div>
                    </div>
                }
                content={
                    <div className="flex-1 flex-col">
                        {this.props.invoices && (
                            <ReactTable
                                data={this.state.temp}
                                getTheadGroupProps={(state, rowInfo, column, instance) =>{
                                    return {
                                        style:{
                                            padding: "10px 10px",
                                            fontSize: 14,
                                            fontWeight: 700
                                        }
                                    }
                                }}
                                getTheadThProps={(state, rowInfo, column, instance) =>{
                                    let width=80;
                                    if (column.id==='InvoiceDescription') width= 250;
                                    if (column.id==='CustomerName') width= 190;
                                    return {
                                        style:{
                                            minWidth: width,
                                            width: width
                                        }
                                    }
                                }}
                                getTheadProps={(state, rowInfo, column, instance) =>{
                                    return {
                                        style:{
                                            padding: "10px 10px",
                                            fontSize: 13,
                                        }
                                    }
                                }}
                                getTrProps={(state, rowInfo, column, instance) =>{
                                    return {
                                        style:{
                                            padding: "8px 10px",
                                            fontSize: 12,
                                            textAlign: 'center'
                                        }
                                    }
                                }}
                                getTdProps={(state, rowInfo, column, instance) =>{
                                    let direction = 'column';
                                    if (column.Header==='Description' ) direction = 'row';
                                    if (column.Header==='Name' ) {direction = 'row'; }

                                    let width=80;
                                    if (column.id==='InvoiceDescription') width= 250;
                                    if (column.id==='CustomerName') width= 190;
                                    console.log( column);
                                    return {
                                        style:{
                                            textAlign: 'center',
                                            flexDirection: direction,
                                            minWidth: width,
                                            width: width
                                        }
                                    }
                                }}
                                columns={[
                                    {
                                        Header: "Invoice",
                                        columns: [
                                            {
                                                Header  : "No",
                                                accessor: "InvoiceNo",
                                                filterAll: true
                                            },
                                            {
                                                Header  : "Id",
                                                accessor: "InvoiceId"
                                            },
                                            {
                                                Header  : "Date",
                                                id: "InvoiceDate",
                                                accessor: d=>moment(d.InvoiceDate).format('YYYY-MM-DD')
                                            },
                                            {
                                                Header  : "Due Date",
                                                id: "DueDate",
                                                accessor: d=>moment(d.DueDate).format('YYYY-MM-DD')
                                            },
                                            {
                                                Header  : "Amount",
                                                accessor: "InvoiceAmount",
                                            },
                                            {
                                                Header  : "Tax",
                                                accessor: "InvoiceTax",
                                            },
                                            {
                                                Header  : "Total",
                                                accessor: "InvoiceTotal",
                                            },
                                            {
                                                Header  : "Description",
                                                accessor: "InvoiceDescription",
                                            },
                                        ]
                                    },
                                    {
                                        Header: "Customer",
                                        columns: [
                                            {
                                                Header  : "No",
                                                accessor: "CustomerNo",
                                            },
                                            {
                                                Header  : "Id",
                                                accessor: "CustomerId",
                                            },
                                            {
                                                Header  : "Name",
                                                accessor: "CustomerName",
                                            },
                                        ]

                                    },
                                    {
                                        Header: "Transaction Status",
                                        columns:[
                                            {
                                                Header  : "List Id",
                                                accessor: "TransactionStatusListId",
                                            },
                                            {
                                                Header  : "Status",
                                                accessor: "TransactionStatus",
                                            },
                                        ]
                                    }
                                ]}
                                defaultPageSize={20}
                                className="-striped -highlight"
                                style={{fontSize: 12}}
                            />
                        )}
                    </div>
                }
                leftSidebarHeader={
                    filterState ? <div className="p-24"><h4>Filter Panel</h4></div>: ''
                }
                leftSidebarContent={
                    filterState ? <FilterPanel/>:''
                }
                rightSidebarHeader={
                    summaryState ? <div className="p-24"><h4>Summary Panel</h4></div>:''
                }
                rightSidebarContent={
                    summaryState ? <SummaryPanel/> : ''
                }
                onRef={instance => {
                    this.pageLayout = instance;
                }}
            >
            </FusePageCustom>
        );
    }
}

function mapDispatchToProps(dispatch)
{
    return bindActionCreators({
        getInvoices: Actions.getInvoices,
        toggleFilterPanel: Actions.toggleFilterPanel,
        toggleSummaryPanel: Actions.toggleSummaryPanel,
    }, dispatch);
}

function mapStateToProps({invoices})
{
    return {
        invoices: invoices.invoicesDB,
        bLoadedInvoices: invoices.bLoadedInvoices,
        transactionStatus: invoices.transactionStatus,
        filterState: invoices.bOpenedFilterPanel,
        summaryState: invoices.bOpenedSummaryPanel,
    }
}

export default withStyles(styles, {withTheme: true})(withRouter(connect(mapStateToProps, mapDispatchToProps)(InvoicePage)));

