import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Snackbar, Chip, Avatar, Paper, TextField, RaisedButton, FlatButton, Dialog } from 'material-ui'
import { CirclePicker } from 'react-color'

import LoadingProgress from '../components/LoadingProgress'
import { loadTags, addTag, updateTag, deleteTag } from '../actions/tagActions'
import N18 from '../constants/string'
import { validTag } from '../utils/validators'

const styles = {
  wrapper: {
    marginTop: 30,
    display: 'flex',
    flexWrap: 'wrap',
  },
}

class TagsPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tagname: '',
      tagcolor: '#000000',
      open: false,
      errors: {},
      currentTagName: '',
      currentTagColor: '',
      currentTagId: ''
    }

    this.onChangeNewTagColor = this.onChangeNewTagColor.bind(this);
    this.onChangeNewTagText = this.onChangeNewTagText.bind(this);
    this.saveNewTag = this.saveNewTag.bind(this);
    this.modifyTag = this.modifyTag.bind(this);
    this.deleteTag = this.deleteTag.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this.onChangeModifyTagColor = this.onChangeModifyTagColor.bind(this);
    this.onChangeModifyTagName = this.onChangeModifyTagName.bind(this);
    this.updateTag = this.updateTag.bind(this);
  }

  componentWillMount() {
    if (this.props.tags.length == 0) {
      this.props.loadTags();
    }
  }

  //改变新建颜色
  onChangeNewTagColor(color) {
    this.setState({ tagcolor: color.hex });
  }

  onChangeNewTagText(e) {
    this.setState({ tagname: e.target.value })
  }

  saveNewTag() {
    let newTag = {
      name: this.state.tagname,
      color: this.state.tagcolor
    }

    let {errors, isValid} = validTag(newTag);
    if (isValid) {
      this.props.addTag(newTag).then(
        res => { this.setState({ tagname: '', errors: {}, tagcolor: '#000000', openSnack: true, message: N18.saveSuccess }) },
        err => { this.setState({ openSnack: true, message: N18.saveFail }) }
      );
    } else {
      this.setState({ errors })
    }
  }

  modifyTag(tag) {
    this.setState({
      open: true,
      currentTagName: tag.name,
      currentTagColor: tag.color,
      currentTagId: tag._id,
      errors: {}
    })
  }

  /**
   * 删除标签
   */
  deleteTag(tag) {
    this.props.deleteTag(tag).then(
      res => { this.setState({ openSnack: true, message: N18.deleteSuccess })},
      err => { this.setState({ openSnack: true, message: N18.deleteFail }) }
    );
  }


  closeDialog() {
    this.setState({ open: false, errors: {} })
  }

  //改变新建标签的名字
  onChangeModifyTagName(e) {
    this.setState({ currentTagName: e.target.value })
  }

  /**
   * 改变新建标签的颜色
   */
  onChangeModifyTagColor(color) {
    this.setState({ currentTagColor: color.hex })
  }

  /**
   * 发送更送请求
   */
  updateTag() {
    let tag = {
      name: this.state.currentTagName,
      id: this.state.currentTagId,
      color: this.state.currentTagColor
    }

    let {errors, isValid} = validTag(tag);
    if (isValid) {
      this.props.updateTag(tag).then(
        res => { this.setState({ openSnack: true, message: N18.saveSuccess, open: false }) },
        err => { this.setState({ openSnack: true, message: N18.saveFail }) }
      )
    } else {
      this.setState({ errors })
    }
  }

  render() {
    const actions = [
      <FlatButton
        label={N18.cancel}
        primary={true}
        onTouchTap={this.closeDialog}
        />,
      <RaisedButton
        label={N18.submit}
        backgroundColor={this.state.currentTagColor}
        labelColor="#FFFFFF"
        keyboardFocused={true}
        onTouchTap={this.updateTag}
        />,
    ];

    return (
      <Paper>
        <div className="box">
          {this.props.isLoading ? <LoadingProgress /> :
            <div>
              <div className="col-md-9 col-xs-12">
                <TextField
                  hintText={N18.tagname}
                  name="newTagName"
                  fullWidth={true}
                  floatingLabelText={N18.tagname}
                  floatingLabelStyle={{ color: this.state.tagcolor }}
                  errorText={this.state.errors.name}
                  inputStyle={{ color: this.state.tagcolor }}
                  onChange={this.onChangeNewTagText}
                  value={this.state.tagname} />
              </div>
              <div className="col-md-3 col-xs-12">
                <RaisedButton
                  label={N18.new}
                  fullWidth={true}
                  labelColor='#FFFFFF'
                  style={{ marginTop: 28 }}
                  backgroundColor={this.state.tagcolor}
                  onTouchTap={this.saveNewTag}
                  />,
          </div>
              <Dialog
                title={N18.modifyTag}
                actions={actions}
                modal={false}
                open={this.state.open}
                onRequestClose={this.closeDialog}
                >
                <TextField
                  hintText={N18.newTag}
                  floatingLabelText={N18.newTag}
                  fullWidth={true}
                  errorText={this.state.errors.name}
                  onChange={this.onChangeModifyTagName}
                  inputStyle={{ color: this.state.currentTagColor }}
                  floatingLabelStyle={{ color: this.state.currentTagColor }}
                  value={this.state.currentTagName} >
                </TextField>
                <CirclePicker width="100%" onChange={this.onChangeModifyTagColor} />
              </Dialog>
              <CirclePicker width="100%" onChange={this.onChangeNewTagColor} />
              <div style={styles.wrapper}>
                {this.props.tags.map(tag => (
                  <Chip
                    key={tag._id}
                    style={{ margin: 6, border: "2px solid " + tag.color }}
                    onTouchTap={() => this.modifyTag(tag)}
                    onRequestDelete={() => this.deleteTag(tag)} >
                    {tag.name}
                  </Chip>
                ))}
              </div>
            </div>
          }
        </div>
        <Snackbar
          open={this.state.openSnack}
          message={this.state.message}
          autoHideDuration={4000}
          onRequestClose={this.handleRequestClose}
        />
      </Paper>
    )
  }
}

TagsPage.propTypes = {
  loadTags: React.PropTypes.func.isRequired,
  addTag: React.PropTypes.func.isRequired,
  updateTag: React.PropTypes.func.isRequired,
  deleteTag: React.PropTypes.func.isRequired
}


const mapStateToProps = (state) => {
  return {
    tags: state.tags.tags,
    isLoading: state.tags.isLoading
  }
}
export default connect(mapStateToProps, { addTag, loadTags, updateTag, deleteTag })(TagsPage)