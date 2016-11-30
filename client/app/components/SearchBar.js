import React, { Component } from 'react'
import { cyan500, grey500, grey900 } from 'material-ui/styles/colors'
import { TextField, IconButton } from 'material-ui'
import ActionSearch from 'material-ui/svg-icons/action/search'
import ContentClear from 'material-ui/svg-icons/content/clear';
import N18 from '../constants/string'

const styles = {
  white: {
    color: 'white'
  }
}
class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchInput: this.props.searchInput,
    }

    this.changeSearchInput = this.changeSearchInput.bind(this);
    this.search = this.search.bind(this);
    this.clear = this.clear.bind(this);
  }

  changeSearchInput(e) {
    this.setState({
      searchInput: e.target.value
    })
  }

  search() {
    this.props.searchCallback(this.state.searchInput);
  }

  clear() {
    this.setState({
      searchInput: ''
    }, () => this.props.clearCallback());
  }
  render() {
    return (
      <div>
        <TextField
          value={this.state.searchInput}
          floatingLabelText={N18.searchInput}
          inputStyle={styles.white}
          hintStyle={styles.white}
          style={{width: "cal(100% - 120px)"}}
          floatingLabelStyle={styles.white}
          underlineFocusStyle={{borderColor: 'white'}}
          onChange={this.changeSearchInput} />
        <IconButton
          onTouchTap={this.search}
          style={{ top: 10}} 
          >
          <ActionSearch 
            color='white'
          />
        </IconButton>
        {this.state.searchInput.trim() != '' ? <IconButton onTouchTap={this.clear} style={{ top: 10 }}><ContentClear color='white'/></IconButton> : null}
      </div>
    )
  }
}

SearchBar.propTypes = {
  searchCallback: React.PropTypes.func.isRequired,
  clearCallback: React.PropTypes.func.isRequired,
  searchInput: React.PropTypes.string.isRequired
}

export default SearchBar