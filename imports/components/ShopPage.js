import React from 'react';
import NavigationWrapper from './NavigationWrapper';

class ShopPage extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className='notes-page'>
        <NavigationWrapper returnToNav={ this.props.returnToNav } />
      </div>    
    )
  }
}

export default ShopPage