import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Paper, List, ListItem, RaisedButton, Dialog } from 'material-ui'
import { red500, indigo500, cyan500, green900, yellow500, deepOrange500, grey500 } from 'material-ui/styles/colors'
import Paginator from '../components/Paginator'
import LoadingProgress from '../components/LoadingProgress'

import { loadNotifications } from '../actions/notificationActions'
import N18 from '../constants/string'
import Timer from '../utils/timer'

const styles = {
  container: {
    padding: "30px 0"
  },

  fullWidth: {
    widht: "100%"
  },

  date: {
    marginLeft: 10,
    color: grey500,
    fontSize: 12,
  },

  listItem: {
    margin: "6px 0"
  },

  author: {
    color: grey500,
    fontSize: 14,
  },

  subtitle: {
    marginBottom: 10
  },

  title: {
    fontSize: 30
  }
}

class NotificationPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: this.props.params.page,
      notification: {},
      openDialog: false
    }

    this.openDialog = this.openDialog.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
  }

  componentWillMount() {
    let page = this.props.params.page;

    if (page != undefined) {
      this.props.loadNotifications(page - 1);
    } else {
      this.props.loadNotifications(0);
    }
  }

  // componentWillReceiveProps(nextProps) {
    // let page = nextProps.params.page;
    // if(page == undefined) {
      // this.setState({page: 0});
      // this.props.loadNotifications(0);
    // }
    // if(page != this.state.page) {
      // this.setState({page: page - 1});
      // this.props.loadNotifications(page - 1);
    // }
  // }

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
    ];

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

    return (
      <div style={styles.container}>
        <div style={styles.title}>{N18.allNotifications}</div>
        <Paper>
          {this.props.isLoading ? <LoadingProgress /> :
            this.props.notifications != undefined && this.props.notifications.length != 0 ?
              (
                <div>
                  <List>
                    {this.props.notifications != undefined && this.props.notifications.map(notification => {
                      idx = (idx + 1) % length;
                      return (
                        <ListItem
                          key={notification._id}
                          onTouchTap={() => this.openDialog(notification)}
                          style={{ margin: "6px 0", borderLeft: '4px solid ' + colors[idx] }}>
                          <div>
                            <div style={styles.subtitle}>{notification.title}</div>
                            <span style={styles.author}>{notification.from == undefined ? '' : notification.from.name}</span>
                            <span style={styles.date}>{Timer.getYmd(new Date(notification.createdAt))}</span>
                          </div>
                        </ListItem>
                      );
                    })}

                    <Paginator
                      paginate={this.props.paginate}
                      link="/notifications"
                      loadData={this.props.loadNotifications}
                      />
                  </List>
                </div>
              ) : (
                <div style={styles.container}>{N18.noNotifications}</div>
              )
          }
          {dialog}
        </Paper>
      </div>
    )
  }
}

// NotificationPage.propTypes = {
//   notifications: React.PropTypes.array.isRequired,
//   paginate: React.PropTypes.object.isRequired
// }

const mapStateToProps = (state) => {
  return {
    notifications: state.notifications.notifications,
    paginate: state.notifications.paginate,
    isLoading: state.notifications.isLoading,
  }
}
export default connect(mapStateToProps, { loadNotifications })(NotificationPage)