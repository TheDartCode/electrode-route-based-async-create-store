import React, {PropTypes} from 'react';
import {connect} from 'react-redux';

const style = {fontSize: '18px'};

class Static extends React.Component {
  render() {
    const {staticData} = this.props;
    return (
      <div style={style}>
        Some other component here, needing the following (static) data in the `initialState`:
        <p>
          {staticData}
        </p>
      </div>
    );
  }
}

Static.PropTypes = {
  staticData: PropTypes.string.isRequired
};

const mapStateToProps = (state) => {
  return {
    staticData: state.staticData
  };
};

export default connect(mapStateToProps)(Static);
