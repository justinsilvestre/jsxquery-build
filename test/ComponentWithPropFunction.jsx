import jsxQuery from 'jsxQuery';

class ComponentWithPropFunction extends jsxQuery.Component {
  static get defaultProps() {
    return {
      bloop(text) {
        return <span>{text}</span>;
      }
    }
  }

  render() {
    return <div id="component1">This component should generate a JS file in addition to JSP because it has a prop function.</div>
  }
}

module.exports = ComponentWithPropFunction;