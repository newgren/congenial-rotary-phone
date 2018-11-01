'use strict';


const e = React.createElement;

class Sidescroll extends React.Component {
  constructor(props) {
    super(props);
    this.mobile = props.mobile;
  }

  componentDidMount() {
    let thing = document.getElementById('sidescroll');
    //TODO: MAKE THESE USE 'VH' INSTEAD OF 'PX' so that animation speed is constant when changing broswer size
    // let shopHeight = document.getElementById('shopBox').clientHeight;
    let amt = -1 * (thing.clientHeight/2);
    thing.style.top = amt + 'px';

    let increment = this.mobile ? 1 : 3;
    window.setInterval(() => {
      if(amt > 0) {
        amt = -1 * (thing.clientHeight/4);
      }
      thing.style.top = amt + 'px';
      amt += increment;
    },
    10);
  }

  render() {
    return (
      <div id='sidescroll'>
        <img id='scrollimg' src='./iconImages/sidescroll.png'/>
        <img src='./iconImages/sidescroll.png'/>
        <img src='./iconImages/sidescroll.png'/>
        <img src='./iconImages/sidescroll.png'/>
      </div>
    );
  }
}
export default Sidescroll
