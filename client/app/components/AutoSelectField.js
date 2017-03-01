import React, { Component, PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import Popover from 'material-ui/Popover/Popover'
import TextField from 'material-ui/TextField/TextField'
import Menu from 'material-ui/Menu/Menu'
import MenuItem from 'material-ui/MenuItem/MenuItem'
import SelectionsPresenter from './SelectionsPresenter'
import UnCheckedIcon from 'material-ui/svg-icons/toggle/check-box-outline-blank'

class AutoSelectField extends Component {
  constructor(props) {
    super(props);
    this.closeMenu = this.closeMenu.bind(this);
    this.openMenu = this.openMenu.bind(this);
    this.clearTextField = this.clearTextField.bind(this);
    this.focusTextField = this.focusTextField.bind(this);
    this.focusFirstMenuItem = this.focusFirstMenuItem.bind(this);
    this.focusLastMenuItem = this.focusLastMenuItem.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handlePopoverClose = this.handlePopoverClose.bind(this);
    this.handleTextFieldKeyDown = this.handleTextFieldKeyDown.bind(this);
    this.handleTextFieldAutocompletionFiltering = this.handleTextFieldAutocompletionFiltering.bind(this);
    this.handleMenuEscKeyDown = this.handleMenuEscKeyDown.bind(this);
    this.handleMenuSelection = this.handleMenuSelection.bind(this);
    this.handleMenuKeyDown = this.handleMenuKeyDown.bind(this);
  }

  componentWillMount() {
    this.setState({ isOpen: false, searchText: '' })
  }

  // for debugging/styling purposes, set this to null
  // to disable list autoclosing on clickAway
  closeMenu() {
    this.setState({ isOpen: false, searchText: '' }, () => {
      findDOMNode(this.root).focus()
    })
  }

  openMenu() {
    this.setState({ isOpen: true }, () => {
      this.focusTextField()
    })
  }

  clearTextField(callback) {
    this.setState({ searchText: '' }, callback)
  }

  focusTextField() {
    const input = findDOMNode(this.searchTextField).querySelector('input')
    input.focus()
  }

  focusFirstMenuItem() {
    const firstMenuItem = findDOMNode(this.menu).querySelector('[tabindex="0"]')
    firstMenuItem.focus()
  }

  focusLastMenuItem() {
    const menuItems = findDOMNode(this.menu).querySelectorAll('[tabindex]')
    const lastMenuItem = menuItems[menuItems.length - 1]
    lastMenuItem.focus()
  }

  /**
   * Main Component Wrapper methods
   */
  handleClick() {
    this.openMenu() // toggle instead of close ? (in case user changes  targetOrigin/anchorOrigin)
  }

  handleKeyDown(event) {
    if (/ArrowDown|Enter/.test(event.key)) this.openMenu()
  }

  /*
    handleBlur = (event) => {
      const hasFocus = document.activeElement === findDOMNode(this)
      console.debug('hasFocus', hasFocus)
    }
  */

  /**
   * Popover methods
   */
  handlePopoverClose(reason) {
    this.closeMenu() // toggle instead of close ? (in case user changes targetOrigin/anchorOrigin)
  }

  /**
   * SelectionPresenter methods
   */
  handleTextFieldAutocompletionFiltering(event, searchText) {
    this.setState({ searchText }, () => this.focusTextField())
  }

  handleTextFieldKeyDown(event) {
    switch (event.key) {
      case 'ArrowDown':
        this.focusFirstMenuItem()
        break

      case 'Escape':
        this.clearTextField()
        this.closeMenu()
        break

      default: break
    }
  }

  /**
   * Menu methods
   */
  handleMenuEscKeyDown() {
    this.closeMenu()
  }

  handleMenuSelection(event, selectedMenuItem) {
    const { multiple, onSelect, name } = this.props
    onSelect(name, selectedMenuItem)
    multiple
      ? this.clearTextField(() => this.focusTextField())
      : this.closeMenu()
  }

  handleMenuKeyDown(event) {
    // TODO: this solution propagates and triggers double onKeyDown
    // if event.stopPropagation(), nothing works, so the correct trigger is the 2nd one
    switch (event.key) {
      case 'ArrowUp':
        // TODO: add Shift+Tab
        // TODO: add if current MenuItem === firstChild
        this.focusTextField()
        break

      case 'ArrowDown':
        // TODO: if current MenuItem === lastChild, this.focusFirstMenuItem()
        break

      case 'PageUp':
        // TODO: this.focusFirstMenuItem()
        break

      case 'PageDown':
        // TODO: this.focusLastMenuItem()
        this.focusLastMenuItem()
        break

      default: break
    }
  }

  render() {
    const { value, hintText, multiple, children, style, menuProps,
      autocompleteFilter, displaySelectionsRenderer } = this.props

    const menuItems = this.state.isOpen && children &&
      children.map((child, index) => {
        if (!autocompleteFilter(this.state.searchText, child.props.label)) return
        const isSelected = value && value.includes(child.props.value)
        return (
          <MenuItem
            key={index}
            tabIndex={index}
            value={child.props.value}
            checked={multiple && isSelected}
            leftIcon={(multiple && !isSelected) ? <UnCheckedIcon /> : null}
            primaryText={child}
            disableFocusRipple
            />)
      })

    // TODO: set autoWidth to false automatically if width prop has a value
    const menuWidth = this.root ? this.root.clientWidth : null
    // const menuWidth = 100;

    // TODO: check rendering performance with 200 MenuItems (integrate react-virtualized ?)

    // TODO: add props.disableAutoComplete (default: false)

    // TODO: implement a checkboxRenderer for MenuItem (or expose 2 properties CheckIconFalse & CheckIconTrue)

    // TODO: make SelectionsPresenter appears only if current numMenuItems > this.maxMenuItems

    // TODO: add a css rule for this.root :focus { outline: 'none' }, and :hover { darken }

    return (
      <div
        ref={ref => (this.root = ref)}
        tabIndex='0'
        style={{ cursor: 'pointer', ...style }}
        onKeyDown={this.handleKeyDown}
        onClick={this.handleClick}
        onBlur={this.handleBlur}
        >

        <SelectionsPresenter
          hintText={hintText}
          value={value}
          displaySelectionsRenderer={displaySelectionsRenderer}
          />

        <Popover
          open={this.state.isOpen}
          anchorEl={this.root}
          canAutoPosition={false}
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          useLayerForClickAway={false}
          onRequestClose={this.handlePopoverClose}
          >
          <TextField
            ref={ref => (this.searchTextField = ref)}
            value={this.state.searchText}
            hintText={hintText}
            onChange={this.handleTextFieldAutocompletionFiltering}
            onKeyDown={this.handleTextFieldKeyDown}
            style={{ marginLeft: 16, marginBottom: -8, width: menuWidth - 16 * 2 }}
            />
          <Menu
            ref={ref => (this.menu = ref)}
            value={value}
            multiple={multiple}
            initiallyKeyboardFocused
            onChange={this.handleMenuSelection}
            onEscKeyDown={this.handleMenuEscKeyDown}
            onKeyDown={this.handleMenuKeyDown}
            desktop
            autoWidth={false}
            {...menuProps}
            width={menuWidth}
            >
            {menuItems}
          </Menu>
        </Popover>
      </div>
    )
  }
}

AutoSelectField.propTypes = {
  style: PropTypes.object,
  children: PropTypes.any,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ]),
  autocompleteFilter: PropTypes.func,
  displaySelectionsRenderer: PropTypes.func,
  name: PropTypes.string.isRequired,
  hintText: PropTypes.string,
  multiple: PropTypes.bool,
  disableSearch: PropTypes.bool,
  onSelect: PropTypes.func
}

// noinspection JSUnusedGlobalSymbols
AutoSelectField.defaultProps = {
  multiple: false,
  disableSearch: false,
  autoComplete: false,
  // eslint-disable-next-line no-unused-vars
  autocompleteFilter: (searchText, text) => {
    searchText = searchText.trim();
    return !text || text.toLowerCase().includes(searchText.toLowerCase()) || text.includes(searchText);
  }
}

export default AutoSelectField
