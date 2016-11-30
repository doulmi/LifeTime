import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { Snackbar, Chip, Paper, IconButton, FlatButton, RadioButtonGroup, RadioButton, Checkbox, TextField, RaisedButton, DatePicker, MenuItem } from 'material-ui'
import NavigationArrowBack from 'material-ui/svg-icons//navigation/arrow-back'
import { cyan500, grey500 } from 'material-ui/styles/colors'
import LoadingProgress from '../../components/LoadingProgress'
import AutoSelectField from '../../components/AutoSelectField'

import { loadClasses } from '../../actions/classActions'
import { addUser, loadUser, updateUser } from '../../actions/userActions'
import N18 from '../../constants/string'
import { validateStudent, validateTeacher } from '../../utils/validators'
import DateTimeFormat from '../../constants/format'

const styles = {
  sex: {
    marginTop: 10,
    color: '#757575',
    fontWeight: 'bold',
    fontSize: 10
  },
  selectClass: {
    marginTop: 15,
    fontWeight: 'bold',
    color: grey500,
    fontSize: 12
  },
  toolbar: {
    padding: 10,
    background: cyan500,
  },
  buttons: {
    float: 'right',
    marginTop: 10
  },
  container: {
    paddingBottom: 60
  }
}

class CreateUserPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: {},
      room: '',
      sex: 'M',
      birthday: {},
      address: '',
      phone: '',
      name: '',
      classs: '',
      grade: '',
      userId: '',
      class: '',
      classes: [],
      message: '',
      open: false,
      success: '',
      classesLabels: [],
    }

    this.changeSex = this.changeSex.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.changeDate = this.changeDate.bind(this);
    this.handleSelection = this.handleSelection.bind(this);
    this.goBack = this.goBack.bind(this);
    this.storeUser = this.storeUser.bind(this);
    this.showSnackbar = this.showSnackbar.bind(this);
    this.closeSnackbar = this.closeSnackbar.bind(this);
  }

  componentWillMount() {
    //根据restfull的链接判断是添加学生，还是添加老师
    this.type = this.props.location.query.type;
    this.props.loadClasses();
    this.edit = false;

    if (this.props.location.pathname.endsWith('edit')) {
      this.edit = true;
      let id = this.props.routeParams.id;
      this.props.loadUser(id);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.edit && Object.keys(nextProps.user).length != 0) {
      let user = nextProps.user;
      this.type = user.role.slug;
      let birthday = user.birthday == undefined ? {} : new Date(user.birthday);
      let classesLabels = [];
      let classes = [];

      user.classes && user.classes.map(cls => {
        classes.push(N18.getClasss(cls.grade, cls.name));
      })

      this.setState({
        room: user.room,
        sex: user.sex,
        birthday: birthday,
        address: user.address,
        phone: user.phone,
        name: user.name,
        classs: user.class ? N18.getClasss(user.class.grade, user.class.name) : '',
        class: user.class ? user.class._id : '',
        userId: user.userId,
        classes: classes,
      })
    }
  }

  handleCustomDisplaySelections(values) {
    if (values && values.length) {
      if (typeof values === 'string') return <Chip>{values}</Chip>
      return <div style={{ display: 'flex' }}>{values.map((v, i) => <Chip key={i}>{v}</Chip>)}</div>
    } else return N18.selectSomeValue
  }

  handleSelection(name, value) {
    if (name == 'classs') {
      this.setState({
        [name]: this.classLabels[value],
        class: value
      })
    } else {
      this.setState({
        classes: value
      })
    }
  }

  //回退
  goBack() {
    this.context.router.goBack();
  }

  changeDate(useless, date) {
    this.setState({ birthday: date })
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: [e.target.value][0]
    })
  }

  changeSex() {
    this.setState({
      isMale: !this.state.isMale
    })
  }

  showSnackbar() {
    this.setState({
      open: true
    })
  }

  closeSnackbar() {
    this.setState({
      open: false,
      success: '',
      msg: ''
    })
  }

  storeUser() {
    let user = this.state;
    let clses = user.classes;
    if (this.type == 'student') {
      var {errors, isValid} = validateStudent(user);
    } else {
      var {errors, isValid} = validateTeacher(user);
      let classes = this.state.classes.map(cls => {
        return this.labels[cls];
      });
      user.classes = classes;
    }
    if (isValid) {
      if (this.edit) {
        user._id = this.props.user._id;
        this.props.updateUser(user, this.type);
        this.setState({
          open: true,
          classes: clses,
          message: N18.updateUserSuccess
        })
      } else {
        this.props.addUser(user, this.type);
        this.setState({
          open: true,
          message: N18.createUserSuccess,
          room: '',
          sex: 'M',
          birthday: {},
          address: '',
          phone: '',
          name: '',
          classs: '',
          class: '',
          userId: '',
          classes: []
        })
      }
    }
    this.setState({ errors: errors });
  }

  render() {
    let classes = [];
    this.classLabels = [];
    this.labels = [];

    this.props.classes.map(cls => {
      this.classLabels[cls._id] = N18.getClasss(cls.grade, cls.name);
      this.labels[N18.getClasss(cls.grade, cls.name)] = cls._id;
      classes.push(
        <div key={cls._id} value={cls._id} label={N18.getClasss(cls.grade, cls.name)}>
          {N18.getClasss(cls.grade, cls.name)}
        </div>
      )
    })

    let studentFields = (
      <div>
        <TextField
          hintText={N18.room}
          value={this.state.room}
          fullWidth={true}
          name="room"
          onChange={this.handleChange}
          errorText={this.state.errors.room}
          floatingLabelText={N18.room} />

        <div style={styles.selectClass}>
          {N18.selectClass}
        </div>
        <AutoSelectField
          name="classs"
          fullWidth={true}
          value={this.state.classs}
          hintText=''
          errorText={this.state.errors.classs}
          onSelect={this.handleSelection} >
          {classes}
        </AutoSelectField>
      </div>
    )

    let teacherFields = (
      <AutoSelectField
        name='classes'
        multiple
        hintText={N18.selectClasses}
        onSelect={this.handleSelection}
        value={this.state.classes}
        style={{ minWidth: 150 }}
        >
        {this.props.classes.map(cls => {
          return (
            <div key={cls._id} value={N18.getClasss(cls.grade, cls.name)} label={N18.getClasss(cls.grade, cls.name)} style={{ whiteSpace: 'normal' }}>
              {N18.getClasss(cls.grade, cls.name)}
            </div>
          )
        }
        )}

      </AutoSelectField>
    );

    let commonFields = (
      <div>
        <TextField
          hintText={N18.userId}
          value={this.state.userId}
          name="userId"
          fullWidth={true}
          errorText={this.state.errors.userId}
          floatingLabelText={N18.userId}
          onChange={this.handleChange}
          />

        <TextField
          hintText={N18.name}
          value={this.state.name}
          fullWidth={true}
          name="name"
          errorText={this.state.errors.name}
          onChange={this.handleChange}
          floatingLabelText={N18.name} />

        <div style={styles.sex}>
          {N18.sex}
          <RadioButtonGroup
            name="sex"
            valueSelected={this.state.sex}
            onChange={(event, value) => this.setState({ sex: value })}
            >
            <RadioButton
              value="M"
              label={N18.male}
              />
            <RadioButton
              value="F"
              label={N18.female}
              />
          </RadioButtonGroup>
        </div>

        <DatePicker
          hintText={N18.birthday}
          floatingLabelText={N18.birthday}
          DateTimeFormat={DateTimeFormat}
          okLabel={N18.ok}
          fullWidth={true}
          value={this.state.birthday}
          fullWidth={true}
          errorText={this.state.errors.birthday}
          cancelLabel={N18.cancel}
          locale='zh'
          onChange={this.changeDate}
          />

        <TextField
          hintText={N18.address}
          value={this.state.address}
          name="address"
          fullWidth={true}
          errorText={this.state.errors.address}
          onChange={this.handleChange}
          floatingLabelText={N18.address} />

        <TextField
          hintText={N18.phone}
          name="phone"
          value={this.state.phone}
          fullWidth={true}
          errorText={this.state.errors.phone}
          onChange={this.handleChange}
          floatingLabelText={N18.phone} />
      </div>
    );

    let snackbar = (<Snackbar
      open={this.state.open}
      message={this.state.message}
      autoHideDuration={4000}
      onRequestClose={this.closeSnackbar}
      />)

    return (
      <Paper>
        <div style={styles.toolbar}>
          <IconButton tooltip={N18.back} onTouchTap={this.goBack} >
            <NavigationArrowBack color="white" />
          </IconButton>
        </div>
        <div className="box" style={{ paddingBottom: 60 }}>
          {this.props.isLoading ? <LoadingProgress /> :
            <div>
              {this.type == 'student' ? studentFields : teacherFields}
              {commonFields}
            </div>
          }
          <div style={styles.buttons}>
            <RaisedButton
              onTouchTap={this.storeUser}
              label={N18.submit}
              primary={true}
              />
          </div>
        </div>
        {snackbar}
      </Paper>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    classes: state.classes.classes,
    isLoading: state.classes.isLoading,
    success: state.users.success,
    user: state.users.user
  }
}

CreateUserPage.contextTypes = {
  router: React.PropTypes.object.isRequired
}

export default connect(mapStateToProps, { loadClasses, addUser, loadUser, updateUser })(CreateUserPage)