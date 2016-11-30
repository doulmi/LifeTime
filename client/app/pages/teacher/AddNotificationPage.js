import React, { Component } from 'react'
import { connect } from 'react-redux'
import { IconButton, SelectField, MenuItem, TextField, Paper, RaisedButton, FlatButton } from 'material-ui'
import { cyan500 } from 'material-ui/styles/colors'
import { serverUrlNotApi } from '../../constants'
import { addNotification, updateNotification } from '../../actions/notificationActions'
import { addToastr } from '../../actions/toastrActions'
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back'
import N18 from '../../constants/string'
import { validNotificationData } from '../../utils/validators'

require('../../ueditor/ueditor.config.js');
require('../../ueditor/ueditor.all.min.js');
require('../../ueditor/lang/zh-cn/zh-cn.js');

const styles = {
  container: {
    padding: 30
  },

  title: {
    fontSize: 30,
    marginBottom: 20
  },

  submitBtn: {
    marginTop: 30
  },

  head: {
    marginBottom: 20
  },

  toolbar: {
    padding: 10,
    background: cyan500,
  },

}


const AddNotificationPage = React.createClass({
  // 设置默认的属性值
  getDefaultProps: function () {

    return {
      disabled: false,
      height: 400,
      content: '',
      id: 'editor'
    };
  },

  getInitialState() {
    if (this.props.params.id) {
      let notification = this.props.notifications.filter(notification => {
        return notification._id == this.props.params.id
      })

      return {
        errors: {},
        isUpdate: true,
        notification: notification[0],
        title: notification[0].title,
        to: notification[0].to
      };
    } else {
      return {
        errors: {},
        isUpdate: false,
        title: '',
        to: 'student',
      };
    }
  },


  changeTitle(e) {
    this.setState({
      title: e.target.value
    })
  },

  //调用初始化方法
  componentDidMount: function () {
    this.initEditor();
  },

  //编辑器配置项初始化
  initEditor: function () {
    var id = this.props.id;
    var ue = UE.getEditor(id, {
      // 工具栏，不配置有默认项目
      toolbars: [[
        'fullscreen', '|', 'undo', 'redo', '|',
        'bold', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch',
        '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
        'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
        'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
        'indent', '|',
        'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'touppercase', 'tolowercase', '|',
        'emotion',
        'horizontal', //'|', 'date', 'time', '|', 'insertimage'
      ]],
      lang: 'zh-cn',

      // 为编辑器实例添加一个路径，必需项
      'UEDITOR_HOME_URL': '../ueditor/',

      // 上传图片时后端提供的接口
      // serverUrl: window.api_host + '/innerMessage/uploadImage',
      serverUrl: serverUrlNotApi + 'ueditor/ue',
      enableAutoSave: false,
      autoHeightEnabled: false,
      initialFrameHeight: this.props.height,
      initialFrameWidth: '100%',

      // 是否允许编辑
      // readonly: this.props.disabled
    });
    this.editor = ue;
    var self = this;

    this.editor.ready(function (ueditor) {
      if (!ueditor) {
        // 如果初始化后ueditor不存在删除后重新调用
        UE.delEditor(self.props.id);
        self.initEditor();
      }

      this.setContent(self.state.notification && self.state.notification.content, false);
    });
  },
  // 获取编辑器的内容
  getContent: function () {
    if (this.editor) {
      return this.editor.getContent();
    }
    return '';
  },
  /**
   * 写入内容｜追加内容
   * @param {Boolean} isAppendTo    [是否是追加]
   * @param {String}  appendContent [内容]
   */
  setContent: function (appendContent, isAppendTo) {
    if (this.editor) {
      this.editor.setContent(appendContent, isAppendTo);
    }
  },
  // 获取纯文本
  getContentTxt: function () {
    if (this.editor) {
      return this.editor.getContentTxt();
    }
    return '';
  },
  // 获得带格式的纯文本
  getPlainTxt: function () {
    if (this.editor) {
      return this.editor.getPlainTxt();
    }
    return '';
  },
  // 判断是否有内容
  hasContent: function () {
    if (this.editor) {
      return this.editor.hasContents();
    }
    return false;
  },
  // 插入给定的html
  insertHtml: function (content) {
    if (this.editor) {
      this.editor.execCommand('insertHtml', content);
    }
  },
  // 使编辑器获得焦点
  setFocus: function () {
    if (this.editor) {
      this.editor.focus();
    }
  },
  // 设置高度
  setHeight: function (height) {
    if (this.editor) {
      this.editor.setHeight(height);
    }
  },

  handleChange: function (event, index, value) {
    this.setState({ to: value });
  },

  publish: function () {
    let notification = {
      title: this.state.title,
      content: this.getContent(),
      to: this.state.to
    }

    // let {errors, isValid} = validNotificationData(notification);
    // if (isValid) {
      if (this.state.isUpdate) {
        notification._id = this.state.notification._id;
        this.props.updateNotification(notification);
      } else {
        this.props.addNotification(notification);
      }
      this.context.router.push('/manageNotification');
    // } else {
      // this.setState({ errors });
    // }
  },

  goBack: function () {
    this.context.router.goBack();
  },

  render: function () {
    return (
      <Paper>
        <div style={styles.toolbar}>
          <IconButton tooltip={N18.back} onTouchTap={this.goBack} >
            <NavigationArrowBack color="white" />
          </IconButton>
        </div>
        <div className="box">
          <div style={styles.title}>{N18.publishNotification}</div>

          <div style={styles.head}>
            <TextField
              hintText={N18.notificationTitle}
              fullWidth={true}
              value={this.state.title}
              errorText={this.state.errors.title}
              onChange={this.changeTitle}
              floatingLabelText={N18.notificationTitle}>
            </TextField>

            <SelectField
              floatingLabelText={N18.sendTo}
              value={this.state.to}
              onChange={this.handleChange}
              >
              <MenuItem value='student' key='student' primaryText={N18.student} />
              <MenuItem value='teacher' key='teacher' primaryText={N18.teacher} />
            </SelectField>
          </div>

          <script id={this.props.id} name="content" type="text/plain"></script>

          <div style={styles.submitBtn}>
            <RaisedButton
              label={N18.publish}
              primary={true}
              onTouchTap={this.publish}
              />
          </div>
        </div>
      </Paper>
    );
  }
});

AddNotificationPage.propTypes = {
  addNotification: React.PropTypes.func.isRequired,
  updateNotification: React.PropTypes.func.isRequired,
  addToastr: React.PropTypes.func.isRequired,
  notifications: React.PropTypes.array
}

AddNotificationPage.contextTypes = {
  router: React.PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
  return {
    notifications: state.notifications.notifications,
  }
}

export default connect(mapStateToProps, { addNotification, updateNotification, addToastr })(AddNotificationPage)