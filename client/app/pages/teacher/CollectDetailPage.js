import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Snackbar, Paper, IconButton, TextField, ListItem, List, FlatButton, RaisedButton } from 'material-ui'
import { cyan500 } from 'material-ui/styles/colors'
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back'
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import LoadingProgress from '../../components/LoadingProgress'
import { loadCollect, deleteStudentFromCollect, updateCollect } from '../../actions/collectActions'
import N18 from '../../constants/string'

const styles = {
  toolbar: {
    padding: 10,
    background: cyan500,
  },

  buttons: {
    marginTop: 8,
    float: 'right'
  },

  list: {
    marginTop: 15
  }
}

class CollectDetailPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collect: this.props.collect,
      message: '',
      open: false
    }
    this.goBack = this.goBack.bind(this);
    this.personalDetail = this.personalDetail.bind(this);
    this.save = this.save.bind(this);
    this.saveAndSubmit = this.saveAndSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.closeSnackbar = this.closeSnackbar.bind(this);
  }


  componentWillMount() {
    this.props.loadCollect(this.props.params.id);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ collect: nextProps.collect });
  }


  personalDetail(student) {
    this.context.router.push({
      pathname: '/users/' + student._id
    })
  }

  goBack() {
    this.context.router.goBack();
  }

  deleteStudent(studentId) {
    let students = this.state.collect.students.filter(student => {
      return student._id != studentId
    })

    let collect = this.state.collect;
    collect.students = students;
    this.setState(collect);
  }

  closeSnackbar() {
    this.setState({
      open: false
    })
  }

  save() {
    let collect = this.state.collect;
    this.props.updateCollect(collect)
    this.setState({
      collect: collect,
      open: true,
      message: N18.saveSuccess
    });
  }

  saveAndSubmit() {
    let collect = this.state.collect;
    collect.isSubmit = true;
    this.props.updateCollect(collect);
    this.setState({
      collect: collect,
      open: true,
      message: N18.saveSuccess
    });
  }

  handleChange(e) {
    let collect = this.state.collect;
    collect[e.target.name] = e.target.value;
    this.setState(collect);
  }

  handleRequestClose() {
    this.setState({ open: false })
  }

  render() {
    let collect = this.state.collect;
    
    let isAdmin = this.props.auth.user.role == 'admin' || this.props.auth.user.role == 'superAdmin';
    
    //只对管理员开放修改
    let disabled = !isAdmin || collect.isSubmit;
    console.log(this.props.auth, isAdmin, collect.isSubmit)
    // canModify = isAdmin && !this.collect.isSubmit;
    // disabled = !(canModify) = !(isAdmin && !this.collect.isSubmit) = !isAdmin || this.collect.isSubmit
    

    let snackbar = (<Snackbar
      open={this.state.open}
      message={this.state.message}
      bodyStyle={{textAlign: 'center'}}
      autoHideDuration={4000}
      onRequestClose={this.closeSnackbar}
      />)

    let students = collect.students;
    if (!isAdmin && students) {
      //只显示该老师提交的学生 
      students = students.filter(student => {
        let save = false;
        this.props.auth.user.classes.map(cls => {
          if(cls._id == student.class._id) {
            save = true;
          }
        })
        return save;
      })   
    }
    
    return (
      <Paper>
        <div style={styles.toolbar}>
          <IconButton tooltip={N18.back} onTouchTap={this.goBack} >
            <NavigationArrowBack color="white" />
          </IconButton>

        </div>
        <div className="box">
          {this.props.isLoading ? <LoadingProgress /> :
            <div className="row">
              <TextField
                hintText={N18.teacher}
                value={collect.user != undefined ? collect.user.name : ""}
                name="name"
                fullWidth={true}
                disabled={true}
                floatingLabelText={N18.teacher} />

              <TextField
                hintText={N18.title}
                value={collect.title}
                fullWidth={true}
                disabled={disabled}
                name="title"
                onChange={this.handleChange}
                floatingLabelText={N18.title} />

              <TextField
                hintText={N18.content}
                value={collect.content}
                name="content"
                disabled={disabled}
                multiLine={true}
                onChange={this.handleChange}
                fullWidth={true}
                floatingLabelText={N18.content} />

              <div style={styles.list}>{N18.studentList}</div>
              <List>
                {students && students.map(student => {
                  return (
                    <ListItem
                      key={student._id}
                      primaryText={student.name}
                      onTouchTap={() => this.personalDetail(student)}
                      secondaryText={student.userId}
                      rightIconButton={collect.isSubmit ? null : <IconButton onTouchTap={() => {
                        this.deleteStudent(student._id);
                        this.props.deleteStudentFromCollect(collect._id, student._id);
                      } }><NavigationClose /></IconButton>}
                      />
                  )
                })}
              </List>

              {disabled ? null :
                <span style={styles.buttons}>
                  <RaisedButton
                    style={{ marginRight: 10 }}
                    tooltip={N18.saveAndSubmitTooltip}
                    onTouchTap={this.saveAndSubmit}
                    label={N18.saveAndSubmit}
                    secondary={true}
                    />
                  <RaisedButton
                    onTouchTap={this.save}
                    label={N18.save}
                    primary={true}
                    />
                </span>
              }
            </div>
          }
        </div>
        {snackbar}
      </Paper>
    )
  }
}

CollectDetailPage.propTypes = {
  deleteStudentFromCollect: React.PropTypes.func.isRequired,
  collect: React.PropTypes.object.isRequired,
  auth : React.PropTypes.object.isRequired,
  isLoading: React.PropTypes.bool.isRequired
}

CollectDetailPage.contextTypes = {
  router: React.PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
  return {
    collect: state.collects.collect,
    isLoading: state.collects.isLoading,
    auth: state.auth
  }
}

export default connect(mapStateToProps, { deleteStudentFromCollect, loadCollect, updateCollect })(CollectDetailPage)