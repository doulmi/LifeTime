import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { Paper, IconButton, FlatButton, RadioButtonGroup, RadioButton, Checkbox, TextField, RaisedButton, DatePicker, MenuItem } from 'material-ui'
import { loadUser } from '../actions/userActions'
import { loadAllClasses } from '../actions/classActions'
import NavigationArrowBack from 'material-ui/svg-icons//navigation/arrow-back'
import { cyan500 } from 'material-ui/styles/colors'
import LoadingProgress from '../components/LoadingProgress'
import AutoSelectField from '../components/AutoSelectField'
import PersonalToolbar from '../components/PersonalToolbar'

import N18 from '../constants/string'
import DateTimeFormat from '../constants/format'

const styles = {
  sex: {
    marginTop: 10,
    color: '#757575',
    fontWeight: 'bold',
    fontSize: 10
  },
}

class PersonalPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: {},
      room: '',
      grade: '',
      sex: 'M',
      birthday: {},
      address: '',
      phone: '',
      name: '',
      class: '',
    }

    this.changeSex = this.changeSex.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.changeDate = this.changeDate.bind(this);
    this.handleSelection = this.handleSelection.bind(this);
  }

  componentWillMount() {
    //根据restfull的链接判断是 添加，修改还是查看
    let id = this.props.params.id;
    this.props.loadUser(id)
  }

  componentWillReceiveProps(nextProps) {
    let user = nextProps.user;
    let classes = [];

    if (user.role.slug == 'teacher') {
      user.classes && user.classes.map(cls => {
        classes.push(N18.getClasss(cls.grade, cls.name));
      })
    }

    this.setState({
      room: user.room,
      sex: user.sex,
      birthday: new Date(user.birthday),
      address: user.address,
      phone: user.phone,
      grade: user.grade,
      classs: user.class && user.class.name,
      userId: user.userId,
      classes: classes.join(', '),
      name: user.name
    });
  }

  handleCustomDisplaySelections(values) {
    if (values && values.length) {
      if (typeof values === 'string') return <Chip>{values}</Chip>
      return <div style={{ display: 'flex' }}>{values.map((v, i) => <Chip key={i}>{v}</Chip>)}</div>
    } else return N18.selectSomeValue
  }

  handleSelection(name, value) {
    this.setState({ [name]: value })
  }

  changeDate(useless, date) {
    this.setState({ birthday: date })
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: [e.target.value]
    })
  }

  changeSex() {
    this.setState({
      isMale: !this.state.isMale
    })
  }


  render() {
    let user = this.props.user;

    let keys = Object.keys(user);
    if (keys.length > 0) {
      let studentFields = (
        <div>
          <TextField
            hintText={N18.room}
            value={this.state.room}
            fullWidth={true}
            onChange={this.handleChange}
            errorText={this.state.errors.room}
            floatingLabelText={N18.room} />

          <TextField
            hintText={N18.grade}
            fullWidth={true}
            value={this.state.grade}
            onChange={this.handleChange}
            errorText={this.state.errors.grade}
            floatingLabelText={N18.grade} />

          <TextField
            hintText={N18.classs}
            value={this.state.classs}
            fullWidth={true}
            floatingLabelText={N18.classs} />
        </div>
      );

      let teacherFields = (
        <TextField
          hintText={N18.classes}
          value={this.state.classes}
          fullWidth={true}
          floatingLabelText={N18.classes} />
      )

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
            autoOk={true}
            fullWidth={true}
            value={this.state.birthday}
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

      return (
        <Paper>
          <div style={styles.toolbar}>
            <PersonalToolbar user={user} />
          </div>
          <div className="box">
            {this.props.isLoading ? <LoadingProgress /> :
              <div>
                {commonFields}
                {user.role.slug == 'student' ? studentFields : teacherFields}
              </div>
            }
          </div>
        </Paper>
      )
    } else {  //user not loaded yet
      return (
        <Paper>
          <LoadingProgress />
        </Paper>
      )
    }
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.users.user,
    isLoading: state.users.isLoading,
  }
}

PersonalPage.contextTypes = {
  router: React.PropTypes.object.isRequired
}

export default connect(mapStateToProps, { loadUser, loadAllClasses })(PersonalPage)