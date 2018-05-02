import pascalCase from 'pascal-case';
import camel2Dash from 'camel-2-dash';
import React from 'react';
import ReactDOM from 'react-dom';

const config = {
  webComponentsBase: 'bower_components'
};

const assign = Object.assign;
const defaults = {
  React,
  ReactDOM
};

// default base path of web components, read from config
const BASE_PATH = config.webComponentsBase.replace(/\/$/, '');
const ATTR_BINDING = /\$$/;

// Bind to an attribute
function syncAttribute(node, name, val) {
  const attrName = camel2Dash(name.replace(ATTR_BINDING, ''));
  const type = typeof val;
  if (type === 'object') {
    val = JSON.stringify(val);
  } else if (type === 'function') {
    throw new Error(`Unexpected attribute "${attrName}" of type ${type}`);
  }
  node.setAttribute(attrName, val);
}

function syncEvent(node, eventName, newEventHandler) {
  const eventNameLc = camel2Dash(eventName);
  const eventStore = node.__events || (node.__events = {});
  const oldEventHandler = eventStore[eventNameLc];
  // Remove old listener so they don't double up.
  if (oldEventHandler) {
    node.removeEventListener(eventNameLc, oldEventHandler);
  }
  // Bind new listener.
  if (newEventHandler) {
    node.addEventListener(eventNameLc, eventStore[eventNameLc] = function handler(e) {
      newEventHandler.call(this, e);
    });
  }
}

function isRegisteredInPolymer(elementName) {
  const list = Polymer.telemetry.registrations;
  // Mimics Array#find
  for (let i = 0, element, length = list.length; element = list[i], i < length; i++) {
    if (element.is === elementName) {
      return true;
    }
  }
  return false;
}

function isElementDefined(elementName) {
  // Custom Element v1 spec, works for Polymer 2.0
  if ('customElements' in window && window.customElements.get(elementName)) {
    return true;
  }

  // Polymer 1.0 registration check
  return isRegisteredInPolymer(elementName);
}

/**
 * ReactWebComponent - Creates a react component from a Polymer web component
 *
 * If you want to use Polymer components in your React application,
 * you need to add Polymer to your index.ejs file.
 * @example
 *
 * import wc from './components/WebComponent';
 * const PxGauge = wc('px-gauge');
 *
 *  <PxGauge
 *    value="30"
 *    min="0"
 *    max="100"
 *    bar-width="0"
 *    unit="unit"
 *    error='[[0,12],[79,100]]'
 *    abnormal='[[12,32],[68,79]]'
 *    anomaly='[[32,45],[54,68]]'
 *    normal='[[45,54]]'/>
 *
 * @param  {type} CustomElement description
 * @param  {type} opts          description
 * @param  {type} url           description
 * @return {type}               description
 */
function ReactWebComponent(CustomElement, opts, url) {
  opts = assign({}, defaults, opts);
  let tagName;
  if (typeof CustomElement === 'function') {
    tagName = (new CustomElement()).tagName;
  } else {
    tagName = CustomElement;
  }
  const displayName = pascalCase(tagName);
  const { React, ReactDOM } = opts;
  if (!React || !ReactDOM) {
    throw new Error('React and ReactDOM must be dependencies, globally on your `window` object or passed via opts.');
  }

  class ReactComponent extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        imported: false,
        mounted: false
      };
    }

    static get displayName() {
      return displayName;
    }

    componentWillMount() {
      if (!isElementDefined(tagName)) {
        if (!('Polymer' in window)) {
          throw new Error('This component requires global Polymer library API availability.');
        }
        // Load the component async
        Polymer.Base.importHref(url, this.componentDidImport.bind(this), (er) => {
          throw new Error(`Failed to import module:${url}`);
        }, true);
      } else {
        this.componentDidImport();
      }
    }

    componentDidMount() {
      this.setState({ mounted: true });

      // Import is already
      if (this.state.imported) {
        this.componentWillReceiveProps(this.props);
        this.distributeChildren();
      }
    }

    componentDidImport() {
      if (this.state.mounted) {
        this.setState({ imported: true });
        this.componentWillReceiveProps(this.props);
      } else {
        this.state.imported = true;
      }
    }

    componentDidUpdate(prevProps, prevState) {
      if (this.state.imported && !prevState.imported) {
        this.componentWillReceiveProps(prevProps);
        this.distributeChildren();
      }
    }

    componentWillReceiveProps(props) {
      const node = ReactDOM.findDOMNode(this);
      if (node) {
        Object.keys(props).forEach((name) => {
          if (name === 'children' || name === 'style') {
            return;
          }

          if (ATTR_BINDING.test(name)) {
            // Bind to an attribute
            syncAttribute(node, name, props[name]);
          } else if (name.indexOf('on') === 0 && name[2] === name[2].toUpperCase()) {
            // Add event listener
            syncEvent(node, name.substring(2), props[name]);
          } else {
            // Bind to a property
            node[name] = props[name];
          }
        });
      }
    }

    componentWillUnmount() {
      this.state.mounted = false;
    }

    shouldComponentUpdate(nextProps, nextState) {
      if (!this.state.mounted && nextState.mounted) { return false; }

      return true;
    }

    distributeChildren() {
      const node = ReactDOM.findDOMNode(this);
      if (this.props.children && node) {
        const shadowRoot = Polymer.dom(node.root);
        const lightRoot = Polymer.dom(node);
        Array.from(node.childNodes).filter(function (child) {
          return !shadowRoot.deepContains(child);
        }).forEach(function (newChild) {
          lightRoot.appendChild(newChild);
        });
      }
    }

    render() {
      if (!this.state.imported) {
        return null;
      }

      return React.createElement(tagName, {
        style: this.props.style
      }, this.props.children);
    }
  }
  return ReactComponent;
}

export default function ReactPolymerComponent(element, elementPath = `${BASE_PATH}/${element}`, opts) {
  const url = `${elementPath}/${element}.html`;
  return ReactWebComponent(element, opts, url);
}
