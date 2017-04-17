import React, {PropTypes} from 'react';
import {connect} from 'react-redux';

import {getData} from '../actions';

const style = {fontSize: '18px'};

class Async extends React.Component {
  componentDidMount() {
    const {asyncData, dispatchGetData, params} = this.props;
    if (!asyncData.data || params.option !== asyncData.option) {
      dispatchGetData(params);
    }
  }
  render() {
    const {asyncData} = this.props;
    return (
      <div style={style}>
        <p>
          My Data:
        </p>
        <p>
          {asyncData.data}
        </p>
        <p>
          with option:
        </p>
        <p>
          {asyncData.option || '<no option>'}
        </p>
      </div>
    );
  }
}

Async.propTypes = {
  asyncData: PropTypes.object,
  dispatchGetData: PropTypes.func.isRequired,
  params: PropTypes.object
};

const mapStateToProps = (state) => {
  return {
    asyncData: state.asyncData
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchGetData: (params) => {
      dispatch(getData(params));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Async);
