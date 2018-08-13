'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var e = React.createElement;

import Countdown from './countdown.js';

var Home = function (_React$Component) {
  _inherits(Home, _React$Component);

  function Home(props) {
    _classCallCheck(this, Home);

    var _this = _possibleConstructorReturn(this, (Home.__proto__ || Object.getPrototypeOf(Home)).call(this, props));

    _this.onclick = props.onclick;
    return _this;
  }

  _createClass(Home, [{
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'home center' },
        React.createElement(
          'div',
          null,
          React.createElement(
            'div',
            { className: 'welcome shadow' },
            'welcome'
          ),
          React.createElement(
            'div',
            { className: 'press shadow' },
            'PRESS'
          ),
          React.createElement(Countdown, null),
          React.createElement(
            'div',
            null,
            React.createElement(
              'button',
              { className: 'shopbutton disabled', onClick: function onClick() {
                  alert("getgot");alert("fr just come back later");
                }
                /*this.props.onclick*/
              },
              'shop'
            )
          )
        )
      );
    }
  }]);

  return Home;
}(React.Component);

export default Home;