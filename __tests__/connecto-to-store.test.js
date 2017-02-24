import React, { Component } from 'react'
import renderer from 'react-test-renderer';
import Store from '../lib/store'
import connectToStore from '../lib/connect-to-store'
// jest.mock('react-dom')


const appStore = Store({
  name: 'iflux'
})

appStore.init = function () {
  appStore.cursor().set('name', 'iflux-web');
};

appStore.setName = function (name) {
  appStore.cursor().set('name', name)
}

class HelloApp extends Component {
  componentDidMount() {
    appStore.init()
  }

  render() {
    const {store} = this.props;

    return (
      <div>{store.get('name')}</div>
    )
  }
}

const TestApp = connectToStore(appStore)(HelloApp);

describe('connectToStore test suite', () =>
  it('it initial render && store set name', () => {
    let Component = renderer.create(<TestApp />)
    expect(Component.toJSON()).toMatchSnapshot();

    appStore.setName('iflux2')
    expect(Component.toJSON()).toMatchSnapshot()
  })
)