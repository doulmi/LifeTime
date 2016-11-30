import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { MenuItem, IconButton, IconMenu, Dialog, List, ListItem, RaisedButton, Paper } from 'material-ui'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import { green500, red500, indigo500, cyan500, green900, yellow500, deepOrange500, grey500 } from 'material-ui/styles/colors'
import LoadingProgress from '../../components/LoadingProgress'
import Paginator from '../../components/Paginator'

import { loadNotifications, addNotification, deleteNotification, updateNotification } from '../../actions/notificationActions'

import N18 from '../../constants/string'
import Timer from '../../utils/timer'

const styles = {
  fullWidth: {
    widht: "100%"
  },

  date: {
    color: grey500,
    fontSize: 14,
    marginRight: 20
  },

  listItem: {
    margin: "6px 0"
  },

  author: {
    color: grey500,
    fontSize: 14,
    marginRight: 20
  },

  toStudent: {
    fontSize: 14,
    padding: 3
  },

  toTeacher: {
    backgroundColor: cyan500,
    borderRadius: 3,
    fontSize: 14,
    color: 'white',
    padding: 3
  },

  line: {
    padding: "10px 0"  
  }
}

class ManageNotificationPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 1,
      notification: {},
      openDialog: false
    }


    this.openDialog = this.openDialog.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
  }

  componentWillMount() {
    this.props.loadNotifications(0);
  }

  deleteNotification(notification) {
    this.props.deleteNotification(notification);
  }

  openDialog(notification) {
    this.setState({
      notification: notification,
      openDialog: true
    })
  }

  closeDialog() {
    this.setState({
      openDialog: false
    })
  }

  render() {
    const actions = [
      <RaisedButton
        label={N18.close}
        primary={true}
        onTouchTap={this.closeDialog}
        />
    ]

    const dialog = (
      <Dialog
        title={this.state.notification.title}
        actions={actions}
        modal={false}
        open={this.state.openDialog}
        onRequestClose={this.closeDialog}
        >
        <div style={styles.fullWidth} dangerouslySetInnerHTML={{ __html: this.state.notification.content }} />
      </Dialog>
    );

    const colors = [red500, indigo500, cyan500, green900, yellow500, deepOrange500];
    const length = colors.length;
    let idx = 0;

    const iconButtonElement = (
      <IconButton
        touch={true}
        tooltip={N18.more}
        tooltipPosition="bottom-left"
        >
        <MoreVertIcon color={grey500} />
      </IconButton>
    );

    return (
      <Paper>
        <div style={styles.container} className="box">
          <Link to='/addNotification'>
            <RaisedButton
              label={N18.newNotification}
              primary={true}
              />
          </Link>
          {this.props.isLoading ? <LoadingProgress /> :
            (
              <div>
                {this.props.notifications == undefined || this.props.notifications.length == 0 ?
                  <div>{N18.noNotifications}</div> : (
                    <div>
                      <List>
                        {this.props.notifications.map(notification => {
                          idx = (idx + 1) % length;
                          return (
                            <ListItem
                              key={notification._id}
                              onTouchTap={() => this.openDialog(notification)}
                              rightIconButton={
                                <IconMenu
                                  iconButtonElement={iconButtonElement}>
                                  <Link to={"/modifyNotification/" + notification._id}><MenuItem>{N18.modify}</MenuItem></Link>
                                  <MenuItem onTouchTap={() => this.deleteNotification(notification)}>{N18.delete}</MenuItem>
                                </IconMenu>
                              }
                              style={{ margin: "6px 0", borderLeft: '4px solid ' + colors[idx] }}>
                              <div>
                                {notification.title}
                              </div>
                              <div style={styles.line}>
                                <span style={styles.author}>{notification.from.name}</span>
                                <span style={styles.date}> {Timer.getYmd(new Date(notification.createdAt))}</span>
                                <span style={notification.to == 'student' ? styles.toStudent : styles.toTeacher}>{N18.to + N18[notification.to]}</span>
                              </div>
                            </ListItem>
                          );
                        })}
                      </List>
                      <Paginator
                        paginate={this.props.paginate}
                        link="/notifications"
                        loadData={this.props.loadNotifications}
                        />
                    </div>
                  )
                }
              </div>
            )
          }
        </div>
        {dialog}
      </Paper>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    notifications: state.notifications.notifications,
    paginate: state.notifications.paginate,
    isLoading: state.notifications.isLoading
  }
}

export default connect(mapStateToProps, { loadNotifications, addNotification, deleteNotification, updateNotification })(ManageNotificationPage)