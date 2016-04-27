import jsxQuery from 'jsxQuery';

class ComponentWithJustMarkup extends jsxQuery.Component {
  static get defaultProps() {
    return {
      one: 'fish',
      two: 'fish',
    }
  }

  render() {
    return <div id="component1">This component should only generate markup because it has no mutable or funcion props.</div>
  }
}

module.exports = ComponentWithJustMarkup;