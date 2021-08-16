// @ts-check

import React from 'react';
import { connect } from 'react-redux';
import Menu from "./Menu";

const mapStateToProps = (state) => {
  const props = {};
  return props;
};

class App extends React.Component {

  render() {
    return (
      <>
        <div className="d-flex flex-column h-100">
          <Menu />
        </div>
      </>
    );
  }
}

export default connect(mapStateToProps)(App);