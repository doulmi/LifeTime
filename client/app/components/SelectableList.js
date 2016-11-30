import React, { Component } from 'react'
import { List, makeSelectable } from 'material-ui/List'

let SelectableList = makeSelectable(List);

function wrapState(ComposedComponent) {
  return class SelectableList extends Component {
    constructor(props) {
      super(props);

      this.state = {
        selectedIndex: props.defaultValue
      }

      this.handleRequestChange = this.handleRequestChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
      this.setState({
        selectedIndex: nextProps.defaultValue
      })
    }

    handleRequestChange(event, index) {
      this.setState({
        selectedIndex: index,
      });
      this.props.handleSelect(event, index);
    }

    render() {
      return (
        <ComposedComponent
          value={this.state.selectedIndex}
          onChange={this.handleRequestChange} >
          {this.props.children}
        </ComposedComponent>
      );
    }
  };
}

SelectableList = wrapState(SelectableList)

export default SelectableList;