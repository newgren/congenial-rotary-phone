'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var e = React.createElement;
var server = 'welcomepresspayment.tk';
var port = '443';
var dropinInstance;
var braintreeErrorMessage = 'Something went wrong :/ Try refreshing the page.';

var production = true;

var Payment = function (_React$Component) {
  _inherits(Payment, _React$Component);

  function Payment(props) {
    _classCallCheck(this, Payment);

    var _this = _possibleConstructorReturn(this, (Payment.__proto__ || Object.getPrototypeOf(Payment)).call(this, props));

    _this.parentType = props.parentType;
    _this.amount = props.amount;
    _this.cart = props.cart;
    _this.shipData = props.shipData;
    _this.billData = props.billData;
    // props has payment loaded (from checkout state)
    _this.setButtonEnabled = props.setButtonEnabled;
    _this.handlePaymentSuccess = props.handlePaymentSuccess;
    _this.handlePaymentFailure = props.handlePaymentFailure;
    _this.finalClick = props.finalClick;
    _this.flipFinalClick = props.flipFinalClick;
    _this.state = {
      selfLoaded: false
    };
    return _this;
  }

  _createClass(Payment, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      braintree.dropin.create({
        authorization: production ? 'production_g559bcnn_ch4gpnw7bcm4tpmb' : 'sandbox_48psd8gz_36dbhbmvhvv9cpjd',
        container: '#dropin-container',
        // paypal: {
        //   flow: 'vault'
        // },
        venmo: {}
      }, function (err, instance) {
        if (err) {
          // Handle any errors that might've occurred when creating Drop-in
          console.error(err);
          // alert(braintreeErrorMessage);
          return;
        }
        _this2.setButtonEnabled(true);
        _this2.setState({ selfLoaded: true });
        _this2.displayDropin();
        console.log("loaded braintree dropin");
        dropinInstance = instance;
      });
    }
  }, {
    key: 'displayDropin',
    value: function displayDropin() {
      document.getElementById('choosePay').style.display = 'inherit';
      document.getElementById('dropin-container').style.display = 'inherit';
    }
  }, {
    key: 'hideDropin',
    value: function hideDropin() {
      document.getElementById('choosePay').style.display = 'none';
      document.getElementById('dropin-container').style.display = 'none';
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      var _this3 = this;

      // onclick for final checkout button
      if (this.props.finalClick === true) {
        if (Object.keys(this.cart).length < 1) {
          alert('Add something to your cart to checkout.');
          //return;
        }

        // prevents spamming
        this.setButtonEnabled(false);
        this.hideDropin();
        this.setState({ selfLoaded: false });

        this.flipFinalClick();

        // deactivate button
        dropinInstance.requestPaymentMethod(function (err, payload) {
          console.log('transaction initiated');
          if (err) {
            // Handle errors in requesting payment method
            if (err == 'DropinError: No payment method is available.') {
              alert('Please enter your payment information.');
            } else {
              alert('An unknown error occured. Please try again.');
            }
            console.log("requestPaymentMethodError: " + err);
            _this3.setButtonEnabled(true);
            _this3.displayDropin();
            _this3.setState({ selfLoaded: true });
            return;
          }

          var shipObj = {
            firstName: _this3.shipData.firstName,
            lastName: _this3.shipData.lastName,
            street1: _this3.shipData.street1,
            street2: _this3.shipData.street2,
            city: _this3.shipData.city,
            state: _this3.shipData.state,
            zip5: _this3.shipData.zip5,
            country: _this3.shipData.country
          };

          var params = {
            amount: _this3.amount,
            cart: _this3.cart,
            nonce: payload.nonce,
            email: _this3.shipData.email,
            ship: shipObj,
            bill: _this3.billData ? {
              firstName: _this3.billData.firstName,
              lastName: _this3.billData.lastName,
              street1: _this3.billData.street1,
              street2: _this3.billData.street2,
              city: _this3.billData.city,
              state: _this3.billData.state,
              zip5: _this3.billData.zip5,
              country: _this3.billData.country
            } : shipObj // use shipping if no seperate billing info
          };

          var req = new XMLHttpRequest();
          var url = 'https://' + server + ':' + port + '/checkout';
          req.open("POST", url);
          req.send(JSON.stringify(params));
          req.onreadystatechange = function (e) {
            if (req.readyState === 4) {
              _this3.setButtonEnabled(true);
              _this3.displayDropin();
              _this3.setState({ selfLoaded: true });
              if (req.status === 200) {
                fbq('track', 'Purchase', {
                  value: _this3.amount,
                  currency: 'USD'
                });
                ga('send', {
                  hitType: 'event',
                  eventCategory: 'product',
                  eventAction: 'transactionSuccess',
                  eventLabel: _this3.parentType == 'checkout' ? 'desktop' : 'mobile'
                });
                console.log('GOOD transaction');
                _this3.handlePaymentSuccess();
              } else {
                ga('send', {
                  hitType: 'event',
                  eventCategory: 'product',
                  eventAction: 'transactionFailure',
                  eventLabel: _this3.parentType == 'checkout' ? 'desktop' : 'mobile'
                });
                console.log('BAD transaction');
                _this3.handlePaymentFailure();
              }
            }
          };
        });
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      // this is important so we don't lock the button
      this.setButtonEnabled(true);
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'payment' },
        React.createElement(
          'div',
          { id: 'choosePay' },
          'choose a way to pay'
        ),
        React.createElement('div', { id: 'dropin-container' }),
        this.state.selfLoaded ? null : React.createElement(
          'div',
          { id: 'loadingBox' },
          React.createElement('img', { src: './logos/loading.gif' })
        )
      );
    }
  }]);

  return Payment;
}(React.Component);

export default Payment;