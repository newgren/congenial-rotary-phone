'use strict';

const e = React.createElement;

import Start from './start.js'
import Home from './home.js'
import Shop from './shop.js'


class Press extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mode: 'shop',
      homeEntered: 'false'
    };
  }

  render() {
    switch (this.state.mode) {
      case 'start':
        return <Start goToHome={() => this.setState({'mode': 'home'})}/>
        break;
      case 'shop':
        return <Shop goToBag={() => this.setState({mode: 'bag'})}
                     goToHome={() => this.setState({mode: 'home'})}/>
        break;
      case 'home':
      default: //default to home
        return <Home goToShop={() => this.setState({mode: 'shop'})}/>
    }
    /*
    if (this.state.liked) {
      return 'You liked this.';
    }

    return e(
      'button',
      { onClick: () => this.setState({ liked: true }) },
      'Press'
    );
    */
  }
}

const domContainer = document.querySelector('#press_container');
ReactDOM.render(e(Press), domContainer);
