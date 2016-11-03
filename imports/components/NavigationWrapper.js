import React from 'react';
import AccountsUIWrapper from './accounts';

class NavigationWrapper extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className='sign-out'>
        <div onClick={ this.props.returnToNav } className='navigation-module left'>Back to dashboard</div>
        <div className='navigation-module'>
          <AccountsUIWrapper />
        </div>
      </div>    
    )
  }
}

export default NavigationWrapper;