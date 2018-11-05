'use strict';

import catalog from './product/catalog.js';
import BagItem from './bagItem.js'

import Payment from './payment.js'


const e = React.createElement;

let state = {
  invalidShippingAddressError: false,
  invalidBillingAddressError: false,
  invalidEmailAddressError: false,
  shippingInfoIsValidated: false,
  sameAddress: true,
  paymentLoaded: false,
  finalClick: false,
  ship: {
    email: '',
    firstName: '',
    lastName: '',
    street1: '',
    street2: '',
    city: '',
    state: '',
    zip5: '',
    country: 'USA'
  },
  bill: {
    firstName: '',
    lastName: '',
    street1: '',
    street2: '',
    city: '',
    state: '',
    zip5: '',
    country: 'USA'
  }
};

class Checkout extends React.Component {
  constructor(props) {
    super(props);
    this.cart = props.cart;
    this.remove = props.remove;
    this.buttonRef = React.createRef();
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePaymentSuccess = this.handlePaymentSuccess.bind(this);
    this.mode = props.mode; // 'shipping' | 'payment'
    this.setCheckoutMode = props.setMode;
    this.completeCheckout = props.completeCheckout;
    this.state = state;
  }

  componentWillUnmount() {
    // Remember state for the next mount
    state = this.state;
  }

  formatMoney(val) {
    return Math.round(val * 100) / 100;
  }

  getSubtotal() {
    //TODO: this function seems to be called way more times than it should...
        // potential problem with state update
    let cart = this.cart;
    let keys = Object.keys(cart);
    let subtotal = 0;
    keys.forEach((key) => {
      let price = catalog.items[key].price;
      let shirt = cart[key];
      let shirtKeys = Object.keys(shirt);
      shirtKeys.forEach((shirtkey) => {
        subtotal += shirt[shirtkey] * price;
      });
    });
    return subtotal;
  }

  getShipping() {
    return 2.05;
  }

  getTotal() {
    return this.getSubtotal() + this.getShipping();
  }

  verifyAddress(callback) {
    let shippingAddress = this.state.ship;
    let billingAddress = this.state.bill;
    let userid = "711WELCO2258"; //"[userid]";

    // secondAddress if needed

    // ugly but strings in JS are weird!
    let url =
      this.state.sameAddress ?
        `https://secure.shippingapis.com/ShippingAPI.dll\
        ?API=Verify\
        &XML=\
        <AddressValidateRequest USERID="${userid}">\
          <Address ID="0">\
            <Address1>${shippingAddress.street1}</Address1>\
            <Address2>${shippingAddress.street2}</Address2>\
            <City>${shippingAddress.city}</City>\
            <State>${shippingAddress.state}</State>\
            <Zip5>${shippingAddress.zip5}</Zip5>\
            <Zip4></Zip4>\
          </Address>\
        </AddressValidateRequest>`
        :
        `https://secure.shippingapis.com/ShippingAPI.dll\
        ?API=Verify\
        &XML=\
        <AddressValidateRequest USERID="${userid}">\
          <Address ID="0">\
            <Address1>${shippingAddress.street1}</Address1>\
            <Address2>${shippingAddress.street2}</Address2>\
            <City>${shippingAddress.city}</City>\
            <State>${shippingAddress.state}</State>\
            <Zip5>${shippingAddress.zip5}</Zip5>\
            <Zip4></Zip4>\
          </Address>\
          <Address ID="1">\
            <Address1>${billingAddress.street1}</Address1>\
            <Address2>${billingAddress.street2}</Address2>\
            <City>${billingAddress.city}</City>\
            <State>${billingAddress.state}</State>\
            <Zip5>${billingAddress.zip5}</Zip5>\
            <Zip4></Zip4>\
          </Address>\
        </AddressValidateRequest>`;

    console.log(url);
    const http = new XMLHttpRequest();
    http.open("GET", url);
    http.send();
    http.onreadystatechange = (e) => {
      // console.log('HTTP STATUS: ' + http.status);
      // console.log('HTTP RDYSTATE: ' + http.readyState);
      if(http.readyState === 4 && http.status === 200) {
        let xml = http.responseXML;
        let addresses = xml.getElementsByTagName("Address");
        let validShipping = addresses[0].getElementsByTagName("Error").length == 0;
        let validBilling =
          this.state.sameAddress ? true
          : addresses[1].getElementsByTagName("Error").length == 0;
        callback(validShipping, validBilling);
      }
    }
  }

  validateEmail(email) {
    let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(String(email).toLowerCase());
  }

  handleInputChange(type, event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    if(type == 'shipping') {
      let ship = this.state.ship;
      ship[name] =  value;
      this.setState({ship: ship});
    } else {
      let bill = this.state.bill;
      bill[name] =  value;
      this.setState({bill: bill});
    }
  }

  handleCheckbox(event) {
    this.setState({sameAddress: !this.state.sameAddress});
  }

  // **** * ****
  // ***** TODO async


  handleSubmit(event) {
    event.preventDefault();
    this.setState({shippingInfoIsValidated: false}); // just in case
    if(this.validateEmail(this.state.ship.email)) {
      this.setState({invalidEmailAddressError: false});
      console.log('VALID EMAIL');
    } else {
      this.setState({invalidEmailAddressError: true});
      console.log('INVALID EMAIL');
      return;
    }
    let valid = this.verifyAddress((validShipping, validBilling) => {
      if(validShipping && validBilling) {
        // all info validated only at this point
        this.setState({
          shippingInfoIsValidated: true,
          invalidShippingAddressError: false
        });
        this.setCheckoutMode('payment');
        console.log('VALID SHIPPING and BILLING ADDRESS');
      } else {
        this.setState({
          shippingInfoIsValidated: false,
          invalidShippingAddressError: !validShipping,
          invalidBillingAddressError: !validBilling,
        });
        console.log('INVALID SHIPPING ADDRESS');
      }
    });
  }

  handlePaymentSubmit() {
    console.log("CLICK");
    this.setState({finalClick: true});
  }

  handlePaymentSuccess() {
   this.completeCheckout();
  }

  handlePaymentFailure() {
   alert('Payment did not complete properly. Please try again.');
  }

  render() {
    return (
      <div className='checkout'>
        <div className='left'>
        {
          this.props.mode == 'shipping' ?
            // SHIPPING
            <div>
              <div className='formform shipping'>
                <div className='title'>SHIPPING ADDRESS</div>
                <form id='shippingForm' onSubmit={this.handleSubmit}>
                  email*<br/>
                  <input
                    type="text"
                    name="email"
                    value={this.state.ship.email}
                    onChange={(e) => this.handleInputChange('shipping', e)}/><br/>
                  <div className='twofer'>
                    <div className='one'>
                      first name*<br/>
                      <input
                        type="text"
                        name="firstName"
                        value={this.state.ship.firstName}
                        onChange={(e) => this.handleInputChange('shipping', e)}/>
                    </div>
                    <div className='two'>
                      last name*<br/>
                      <input
                        type="text"
                        name="lastName"
                        value={this.state.ship.lastName}
                        onChange={(e) => this.handleInputChange('shipping', e)}/>
                    </div>
                  </div>
                  street address*<br/>
                <input type="text" name="street1"
                    value={this.state.ship.street1}
                    onChange={(e) => this.handleInputChange('shipping', e)}/><br/>
                  address 2<br/>
                  <input type="text" name="street2"
                    value={this.state.ship.street2}
                    onChange={(e) => this.handleInputChange('shipping', e)}/><br/>
                  <div className='twofer'>
                    <div className='one'>
                      city*<br/>
                      <input type="text" name="city"
                        value={this.state.ship.city}
                        onChange={(e) => this.handleInputChange('shipping', e)}/>
                    </div>
                    <div className='two'>
                      state*<br/>
                      <input type="text" name="state"
                        value={this.state.ship.state}
                        onChange={(e) => this.handleInputChange('shipping', e)}/>
                    </div>
                  </div>
                  <div className='twofer'>
                    <div className='one'>
                      zip code*<br/>
                      <input type="text" name="zip5"
                        value={this.state.ship.zip5}
                        onChange={(e) => this.handleInputChange('shipping', e)}/>
                    </div>
                    <div className='two'>
                      country*<br/>
                      <select value='USA'
                              onChange={(e) => this.handleInputChange('shipping', e)}>
                        <option
                          value='USA'>USA</option>
                      </select>
                    </div>
                  </div>
                  <div className='checkbox'>
                    <input type='checkbox'
                           checked={this.state.sameAddress}
                           onChange={this.handleCheckbox.bind(this)} />
                    <div>My billing address is the same.</div>
                  </div>
                  <input type="submit" style={{display: "none"}} />
                </form>
                {
                this.state.invalidEmailAddressError ?
                  <span>The email address you entered is invalid. Please try again.</span> :
                <span></span>
                }
                {
                this.state.invalidShippingAddressError ?
                  <span>The shipping address you entered is invalid. Please try again.</span> :
                <span></span>
                }
              </div>
            {
              !this.state.sameAddress ?
              <div className='formform billing'>
                <div className='title'>BILLING ADDRESS</div>
                <form id='billingForm' onSubmit={this.handleSubmit}>
                  <div className='twofer'>
                    <div className='one'>
                      first name*<br/>
                      <input
                        type="text"
                        name="firstName"
                        value={this.state.bill.firstName}
                        onChange={(e) => this.handleInputChange('billing', e)}/>
                    </div>
                    <div className='two'>
                      last name*<br/>
                      <input
                        type="text"
                        name="lastName"
                        value={this.state.bill.lastName}
                        onChange={(e) => this.handleInputChange('billing', e)}/>
                    </div>
                  </div>
                  street address*<br/>
                <input type="text" name="street1"
                    value={this.state.bill.street1}
                    onChange={(e) => this.handleInputChange('billing', e)}/><br/>
                  address 2<br/>
                  <input type="text" name="street2"
                    value={this.state.bill.street2}
                    onChange={(e) => this.handleInputChange('billing', e)}/><br/>
                  <div className='twofer'>
                    <div className='one'>
                      city*<br/>
                      <input type="text" name="city"
                        value={this.state.bill.city}
                        onChange={(e) => this.handleInputChange('billing', e)}/>
                    </div>
                    <div className='two'>
                      state*<br/>
                      <input type="text" name="state"
                        value={this.state.bill.state}
                        onChange={(e) => this.handleInputChange('billing', e)}/>
                    </div>
                  </div>
                  <div className='twofer'>
                    <div className='one'>
                      zip code*<br/>
                      <input type="text" name="zip5"
                        value={this.state.bill.zip5}
                        onChange={(e) => this.handleInputChange('billing', e)}/>
                    </div>
                    <div className='two'>
                      country*<br/>
                      <select value='USA'
                              onChange={(e) => this.handleInputChange('billing', e)}>
                        <option
                          value='USA'>USA</option>
                      </select>
                    </div>
                  </div>
                  <input type="submit" style={{display: "none"}} />
                </form>
                {
                this.state.invalidBillingAddressError ?
                  <span>The billing address you entered is invalid. Please try again.</span> :
                <span></span>
                }
              </div>
              : (null)
            }
            </div>

          : // PAYMENT
            <div className='payAndVerify'>
              <div className='shippingVerification'>
                <div className='title'>Make sure this info is correct!</div>
                {
                  Object.keys(this.state.ship).map((a)=> {
                    return this.state.ship[a] ?
                      <div key={a} className='bit'>{this.state.ship[a]}</div>
                    :
                      (null)
                  })
                }
              </div>
              <Payment
                amount={this.getTotal()}
                data={this.state.ship}
                buttonRef={this.buttonRef}
                paymentLoaded={this.state.paymentLoaded}
                setPaymentLoaded={() => this.setState({paymentLoaded: true})}
                handlePaymentSuccess={this.handlePaymentSuccess}
                handlePaymentFailure={this.handlePaymentFailure}
                finalClick={this.state.finalClick}
                flipFinalClick={() => this.setState({finalClick: false})}/>
            </div>
        }
        </div>
        <div className='summary'>
          <span className='title'>ORDER SUMMARY</span>
          <div className='bar'>
            <span className='key'>subtotal</span>
            <span className='val'>${this.getSubtotal().toFixed(2)}</span>
          </div>
          <div className='bar'>
            <span className='key'>shipping</span>
            <span className='val'>${this.getShipping().toFixed(2)}</span>
          </div>
          <div className='bar'>
            <span className='key'>total</span>
            <span className='val'>${this.getTotal().toFixed(2)}</span>
          </div>
          <button type='button'
                  ref={this.buttonRef}
                  disabled={this.props.mode == 'payment' && !this.state.paymentLoaded}
                  onClick={(e) => this.props.mode == 'shipping' ?
                    this.handleSubmit(e)
                  :
                    this.handlePaymentSubmit()
                  }>
            {
              this.props.mode == 'shipping' ?
                "CONTINUE TO PAYMENT"
              :
                'CONFIRM ORDER'
            }
          </button>
        </div>
      </div>
    );
  }
}
export default Checkout
