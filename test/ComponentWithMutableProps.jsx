import jsxQuery from 'jsxQuery';

class ComponentWithPropFunction extends jsxQuery.Component {
  static get defaultProps() {
    return {
      bloop: 'bloop!'
    }
  }

  static get actionNames() {
    return ['setBloop']
  }

  render() {
    const { bloop } = this.props;
    const { setBloop } = this.actions;

    return <div id="component1" onClick={() => setBloop('bleep!')}>
    <span>This component should generate a JS file in addition to JSP because it has a mutable prop.</span>
    <span id="bloop-text">{bloop}</span></div>
  }
}

module.exports = ComponentWithPropFunction;