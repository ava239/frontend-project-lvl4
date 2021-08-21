// @ts-check

import axios from 'axios';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import routes from '../routes.js';
import Channels from './Channels.jsx';
import Chat from './Chat.jsx';

const mapState = (state) => state;

const actionCreators = {
  initData: actions.initData,
};

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (user && user.token) {
    return { Authorization: `Bearer ${user.token}` };
  }

  return {};
};

const MainPage = ({ initData }) => {
  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await axios.get(routes.dataPath(), { headers: getAuthHeader() });
      initData(data);
    };

    fetchContent();
  }, []);

  return (
    <div className="container h-100 my-4 overflow-hidden rounded shadow">
      <div className="row h-100 bg-white flex-md-row">
        <div className="col-4 col-md-2 border-end pt-5 px-0 bg-light">
          <Channels />
        </div>
        <div className="col p-0 h-100">
          <Chat />
        </div>
      </div>
    </div>
  );
};

export default connect(mapState, actionCreators)(MainPage);
