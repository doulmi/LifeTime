import React, { Component } from 'react'
import { connect } from 'react-redux'
import { TextField, FloatingActionButton, RaisedButton, Toolbar, MenuItem, IconButton, IconMenu, Paper, Dialog, FlatButton, Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import ActionDone from 'material-ui/svg-icons/action/done';
import ContentAdd from 'material-ui/svg-icons/content/add';
import { cyan500, grey500, grey900 } from 'material-ui/styles/colors'

import Paginator from '../../components/Paginator'
import SearchBar from '../../components/SearchBar'
import LoadingProgress from '../../components/LoadingProgress'
import { loadCollects, updateCollect, deleteCollect, addCollect } from '../../actions/collectActions'

import N18 from '../../constants/string'
import Timer from '../../utils/timer'
import { validateCollectData } from '../../utils/validators'

const styles = {
  top2: {
    marginTop: 30
  },
  toolbar: {
    background: cyan500,
  },
  buttons: {
    float: 'right',
    marginTop: -19,
  }
}

class ManageCollectPage extends Component {
  constructor(props) {
    super(props);

    let query = this.props.location.query;
    let search = query.search;
    let student = query.student;

    this.state = {
      errors: [],
      action: '',
      open: false,
      collect: {},
      title: '',
      content: '',
      student: student == undefined ? '' : student,
      searchInput: search == '' || search == undefined ? '' : search
    }

    this.search = this.search.bind(this);
    this.searchCallback = this.searchCallback.bind(this);
    this.clearCallback = this.clearCallback.bind(this);
    this.getQuery = this.getQuery.bind(this);
    this.openDialog = this.openDialog.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this.createCollect = this.createCollect.bind(this);
    this.onChange = this.onChange.bind(this);
    this.storeCollect = this.storeCollect.bind(this);
  }

  componentWillMount() {
    let page = 0;
    this.props.loadCollects(page, this.props.location.search);
  }
  
  onChange(e) {
    this.setState({
      [e.target.name] : e.target.value
    })
  }

  openDialog() {
    this.setState({ open: true })
  }

  closeDialog() {
    this.setState({ open: false })
  }

  createCollect() {
    this.setState({ open: true })
  }

  storeCollect() {
    let collect = {
      title: this.state.title.trim(),
      content: this.state.content.trim(),
    }

    let {errors, isValid} = validateCollectData(collect);

    if (isValid) {
      this.props.addCollect(collect);
      this.setState({
        errors: {},
        title: '',
        content: '',
        open: false
      })
    } else {
      this.setState({ errors })
    }
  }

  getQuery() {
    let queries = [];
    if (this.state.searchInput.trim() != '') {
      queries.push('search=' + this.state.searchInput.trim());
    }
    if (this.state.student != '') {
      queries.push('student=' + this.state.student);
    }
    let query = '';
    if (queries.length > 0) {
      query = '?';
      for (let i = 0; i < queries.length; i++) {
        if (i != 0) {
          query += '&&';
        }
        query += queries[i];
      }
    }
    return query;
  }

  search() {
    this.context.router.push(this.props.location.pathname + this.getQuery());
    this.props.loadCollects(0, this.getQuery())
  }

  searchCallback(value) {
    this.setState({
      searchInput: value
    }, () => this.search());
  }

  clearCallback() {
    this.setState({
      searchInput: ''
    }, () => this.search());
  }

  detailsPage(collect) {
    this.context.router.push({
      pathname: '/collects/' + collect._id,
      state: { collect: collect }
    })
  }

  render() {
    const iconButtonElement = (
      <IconButton
        touch={true}
        tooltip={N18.more}
        tooltipPosition="bottom-left"
        >
        <MoreVertIcon color={grey500} />
      </IconButton>
    )

    const actions = [
      <FlatButton
        label={N18.cancel}
        onTouchTap={this.closeDialog}
        />,
      <RaisedButton
        label={N18.submit}
        primary={true}
        onTouchTap={this.storeCollect}
        />
    ]

    const dialog = (
      <Dialog
        title={N18.new + N18.collect}
        actions={actions}
        modal={false}
        open={this.state.open}
        onRequestClose={this.closeDialog}
        >

        <TextField
          hintText={N18.title}
          fullWidth={true}
          name='title'
          onChange={this.onChange}
          value={this.state.title}
          errorText={this.state.errors.title}
          floatingLabelText={N18.title} />

        <TextField
          hintText={N18.content}
          fullWidth={true}
          multiLine={true}
          rows={2}
          name='content'
          onChange={this.onChange}
          value={this.state.content}
          errorText={this.state.errors.content}
          floatingLabelText={N18.content} />
      </Dialog>
    )

    let isAdmin = this.props.auth.user.role == 'admin' || this.props.auth.user.role == 'superAdmin'

    return (
      <Paper>
        <div style={styles.toolbar} className="toolbar">
          <SearchBar
            clearCallback={this.clearCallback}
            searchCallback={this.searchCallback}
            searchInput={this.state.searchInput}
            />
          {isAdmin &&
            <span style={styles.buttons}>
              <FloatingActionButton secondary={true} onTouchTap={this.createCollect} >
                <ContentAdd />
              </FloatingActionButton>
            </span>
          }
        </div>
        <div className="box">
          {this.props.isLoading ? <LoadingProgress /> :
            (
              <div>
                <Table >
                  <TableHeader displaySelectAll={false} adjustForCheckbox={false} >
                    <TableRow selectable={false}>
                      <TableHeaderColumn>{N18.collectTitle}</TableHeaderColumn>
                      <TableHeaderColumn className="hidden-xs" style={{ width: 120 }}>{N18.name}</TableHeaderColumn>
                      <TableHeaderColumn className="hidden-xs" style={{ width: 120 }}>{N18.isSubmit}</TableHeaderColumn>
                      <TableHeaderColumn style={{ width: 80 }}>操作</TableHeaderColumn>
                    </TableRow>
                  </TableHeader>
                  <TableBody displayRowCheckbox={false} showRowHover={true}>
                    {this.props.collects.map(collect => (
                      <TableRow key={collect._id}>
                        <TableRowColumn>{collect.title}</TableRowColumn>
                        <TableRowColumn className="hidden-xs" style={{ width: 120 }}>{collect.user.name}</TableRowColumn>
                        <TableRowColumn className="hidden-xs" style={{ width: 120 }} >{collect.isSubmit ? <ActionDone color='green' /> : ''}</TableRowColumn>
                        <TableRowColumn style={{ width: 80 }}>
                          <IconMenu
                            useLayerForClickAway={true}
                            iconButtonElement={iconButtonElement}>
                            <MenuItem onTouchTap={() => this.detailsPage(collect)}>{N18.read}</MenuItem>
                            {isAdmin && <MenuItem onTouchTap={() => this.props.deleteCollect(collect)}>{N18.delete}</MenuItem>}
                          </IconMenu>
                        </TableRowColumn>
                      </TableRow>
                    ))
                    }
                  </TableBody>
                </Table>
                <Paginator
                  paginate={this.props.paginate}
                  query={this.props.location.search}
                  loadData={this.props.loadCollects}
                  />
              </div>
            )
          }
        </div>
        {dialog}
      </Paper>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    auth: state.auth,
    collects: state.collects.collects,
    paginate: state.collects.paginate,
    isLoading: state.collects.isLoading
  }
}

ManageCollectPage.contextTypes = {
  router: React.PropTypes.object.isRequired
}

export default connect(mapStateToProps, { loadCollects, updateCollect, deleteCollect, addCollect })(ManageCollectPage)