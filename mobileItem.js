'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var e = React.createElement;
var n = React.createElement('br', null);

var MobileItem = function (_React$Component) {
  _inherits(MobileItem, _React$Component);

  function MobileItem(props) {
    _classCallCheck(this, MobileItem);

    var _this = _possibleConstructorReturn(this, (MobileItem.__proto__ || Object.getPrototypeOf(MobileItem)).call(this, props));

    _this.item = props.item;
    _this.no = props.no;
    _this.state = {
      imageIndex: 0,
      size: '',
      qty: 1,
      sizeError: false
    };
    return _this;
  }

  _createClass(MobileItem, [{
    key: 'handleSizeChange',
    value: function handleSizeChange(e) {
      this.setState({ size: e.target.value });
    }
  }, {
    key: 'handleQtyChange',
    value: function handleQtyChange(e) {
      this.setState({ qty: parseInt(e.target.value) });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      return React.createElement(
        'div',
        { className: 'mobileItem' },
        React.createElement(
          'div',
          { className: 'mid' },
          React.createElement('img', { src: './product/' + this.props.item.image_urls[this.state.imageIndex] + '.png' })
        ),
        React.createElement(
          'button',
          {
            type: 'button',
            onClick: function onClick() {
              if (_this2.state.size === '') {
                _this2.setState({ sizeError: true });
              } else {
                _this2.setState({ sizeError: false });
                _this2.props.add(_this2.state.size, _this2.state.qty);
              }
            } },
          'BUY \u2022 ',
          this.item.price
        )
      );
    }
  }]);

  return MobileItem;
}(React.Component);

export default MobileItem;