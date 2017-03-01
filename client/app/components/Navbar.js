import React, { Component } from 'react'
import { Link } from 'react-router'

//ui
import { List, ListItem, Popover, PopoverAnimationVertical, AppBar, Drawer, MenuItem, FlatButton, Avatar, IconButton, Menu } from 'material-ui'
import ExitIcon from 'material-ui/svg-icons/action/exit-to-app';
import { cyan500 } from 'material-ui/styles/colors'
import Badge from 'material-ui/Badge'
import NotificationsIcon from 'material-ui/svg-icons/social/notifications'
import Alarm from 'material-ui/svg-icons/action/alarm'
import History from 'material-ui/svg-icons/action/history'
import Equalizer from 'material-ui/svg-icons/av/equalizer'
import DeviceAccessTime from 'material-ui/svg-icons/device/access-time'
import MapsLocalOffer from 'material-ui/svg-icons/maps/local-offer'
import ActionReceipt from 'material-ui/svg-icons/action/receipt';
import ActionThumbDown from 'material-ui/svg-icons/action/thumb-down';
import ActionThumbUp from 'material-ui/svg-icons/action/thumb-up';
import ActionFavorite from 'material-ui/svg-icons/action/favorite';
import ImageRemoveRedEye from 'material-ui/svg-icons/image/remove-red-eye';
import ActionAccountBox from 'material-ui/svg-icons/action/account-box';
import MapsLocalConvenienceStore from 'material-ui/svg-icons/maps/local-convenience-store';
import ActionRecordVoiceOver from 'material-ui/svg-icons/action/record-voice-over';
import CommunicationVpnKey from 'material-ui/svg-icons/communication/vpn-key';
import ActionAccessibility from 'material-ui/svg-icons/action/accessibility';
import CommunicationChat from 'material-ui/svg-icons/communication/chat';
import AvLibraryBooks from 'material-ui/svg-icons/av/library-books';
import PlacesSpa from 'material-ui/svg-icons/places/spa';
import ActionViewModule from 'material-ui/svg-icons/action/view-module';
import ActionClass from 'material-ui/svg-icons/action/class';
import ActionDateRange from 'material-ui/svg-icons/action/date-range';
import ActionPowerSettingsNew from 'material-ui/svg-icons/action/power-settings-new';
import withWidth, { SMALL, MEDIUM, LARGE } from 'material-ui/utils/withWidth';
// import navbarImg from '../resources/navbar.jpg'

import SelectableList from './SelectableList'

import N18 from '../constants/string'

const styles = {
  icon: {
    width: 25,
    height: 25,
    position: 'relative',
    paddingRight: 5,
    top: 7
  },

  profile: {
    padding: "40px 0 50px 15px",
    overflow: 'hidden',
  },

  username: {
    paddingLeft: 10,
    color: 'white'
  },

  item: {
    height: 45,
  }
}

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.toggleDrawer = this.toggleDrawer.bind(this);
  }

  logout() {
    this.props.logoutRequest();
  }

  handleSelect(event, index) {
    this.context.router.push(index);
  }


  toggleDrawer(open) {
    this.props.toggleDrawer(open);
  }


  render() {
    const { user } = this.props;

    const studentNav = (
      <SelectableList
        defaultValue={this.props.defaultValue}
        handleSelect={this.handleSelect} >
        <ListItem style={styles.item} leftIcon={<ActionAccessibility />} value='/info' ><span >{N18.info}</span></ListItem>
        <ListItem style={styles.item} leftIcon={<DeviceAccessTime />} value='/tasks' ><span >{N18.schedual}</span></ListItem>
        <ListItem style={styles.item} leftIcon={<Equalizer />} value='/dashboard'><span >{N18.statistic}</span></ListItem>
        <ListItem style={styles.item} leftIcon={<ActionDateRange />} value={'/schedual/' + this.props.user._id} ><span >{N18.mySchedual}</span></ListItem>
        <ListItem style={styles.item} leftIcon={<NotificationsIcon />} value='/notifications' > <span >{N18.notification}</span> </ListItem>
        <ListItem style={styles.item} leftIcon={<MapsLocalOffer />} value="/tags"><span >{N18.tag}</span></ListItem>
        <ListItem style={styles.item} leftIcon={<ActionFavorite />} value="/moods"><span >{N18.mood}</span></ListItem>
        <ListItem style={styles.item} leftIcon={<ImageRemoveRedEye />} value='/optiques'><span >{N18.optique}</span></ListItem>
        <ListItem style={styles.item} leftIcon={<ActionThumbUp />} value='/achievements'><span >{N18.achievement}</span></ListItem>
        <ListItem style={styles.item} leftIcon={<ActionThumbDown />} value='/punishments'><span >{N18.punishment}</span></ListItem>
        <ListItem style={styles.item} leftIcon={<PlacesSpa />} value={"/scores/" + user._id}><span >{N18.myScores}</span></ListItem>
      </SelectableList>
    );

    const teacherNav = (
      <SelectableList
        defaultValue={this.props.defaultValue}
        handleSelect={this.handleSelect} >
        <ListItem style={styles.item} leftIcon={<ActionAccessibility />} value='/info' ><span >{N18.info}</span></ListItem>
        <ListItem style={styles.item} leftIcon={<ActionAccountBox />} value='/manageStudent' ><span >{N18.manageStudent}</span></ListItem>
        <ListItem style={styles.item} leftIcon={<ActionThumbUp />} value='/manageAchievement'><span >{N18.manageAchievement}</span></ListItem>
        <ListItem style={styles.item} leftIcon={<ActionThumbDown />} value='/managePunishment'><span >{N18.managePunishment}</span></ListItem>
        <ListItem style={styles.item} leftIcon={<AvLibraryBooks />} value='/teacherCourse' ><span >{N18.teacherCourse}</span></ListItem>
        <ListItem style={styles.item} leftIcon={<ActionDateRange />} value={'/schedual/' + this.props.user._id} ><span >{N18.mySchedual}</span></ListItem>
        <ListItem style={styles.item} leftIcon={<PlacesSpa />} value="/manageCollect"><span >{N18.manageList}</span></ListItem>
        <ListItem style={styles.item} leftIcon={<ActionClass />} value="/manageClassroom"><span >{N18.manageClassroom}</span></ListItem>
        <ListItem style={styles.item} leftIcon={<NotificationsIcon />} value='/notifications' > <span >{N18.notification}</span> </ListItem>
      </SelectableList>
    );

    const adminNav = (
      <div>
        <SelectableList
          defaultValue={this.props.defaultValue}
          handleSelect={this.handleSelect} >
          <ListItem style={styles.item} leftIcon={<ActionAccessibility />} value='/info' ><span >{N18.info}</span></ListItem>
          <ListItem style={styles.item} leftIcon={<ActionAccountBox />} value='/manageStudent' ><span >{N18.manageStudent}</span></ListItem>
          <ListItem style={styles.item} leftIcon={<ActionRecordVoiceOver />} value='/manageTeacher' ><span >{N18.manageTeacher}</span></ListItem>
          <ListItem style={styles.item} leftIcon={<AvLibraryBooks />} value='/manageCourse' ><span >{N18.manageCours}</span></ListItem>
          <ListItem style={styles.item} leftIcon={<MapsLocalConvenienceStore />} value='/manageClass' ><span >{N18.manageClass}</span></ListItem>
          <ListItem style={styles.item} leftIcon={<CommunicationChat />} value='/manageNotification'><span >{N18.manageNotification}</span></ListItem>
          <ListItem style={styles.item} leftIcon={<ActionThumbUp />} value='/manageAchievement'><span >{N18.manageAchievement}</span></ListItem>
          <ListItem style={styles.item} leftIcon={<ActionDateRange />} value={'/schedual/' + this.props.user._id} ><span >{N18.mySchedual}</span></ListItem>
          <ListItem style={styles.item} leftIcon={<ActionThumbDown />} value='/managePunishment'><span >{N18.managePunishment}</span></ListItem>
          <ListItem style={styles.item} leftIcon={<PlacesSpa />} value="/manageCollect"><span >{N18.manageList}</span></ListItem>
        </SelectableList>
      </div>
    )

    let showNav = null;
    if (user.role == 'student') {
      showNav = studentNav;
    } else if (user.role == 'teacher') {
      showNav = teacherNav;
    } else if (user.role == 'admin' || user.role == 'superAdmin') {
      showNav = adminNav;
    }

    let sidebarWidth = 180;

    return (
      <div>
        <Drawer
          docked={this.props.docked}
          width={sidebarWidth}
          open={this.props.open}
          containerStyle={styles.drawer}
          onRequestChange={(open) => this.toggleDrawer(open)}
          >
          <div style={styles.profile} className="navbar">
            <span style={styles.username}><span >{user.name}</span></span>
          </div>
          {showNav}
          <List>
            <ListItem style={styles.item} leftIcon={<ActionPowerSettingsNew />} onTouchTap={this.logout}><span >{N18.logout}</span></ListItem>
          </List>
        </Drawer>
      </div>
    )
  }
}

Navbar.propTypes = {
  logoutRequest: React.PropTypes.func.isRequired,
  user: React.PropTypes.object.isRequired,
  open: React.PropTypes.bool.isRequired,
  toggleDrawer: React.PropTypes.func.isRequired,
  docked: React.PropTypes.bool.isRequired
}

Navbar.contextTypes = {
  router: React.PropTypes.object.isRequired,
}

export default withWidth()(Navbar);