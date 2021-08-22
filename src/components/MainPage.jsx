// @ts-check

import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import { debug } from 'debug';
import * as actions from '../actions';
import routes from '../routes.js';
import Channels from './Channels.jsx';
import Chat from './Chat.jsx';
import { useSocket } from '../hooks/index.jsx';

const mapState = (state) => state;

const actionCreators = {
  setInitialState: actions.setInitialState,
  addMessage: actions.addMessage,
};

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (user && user.token) {
    return { Authorization: `Bearer ${user.token}` };
  }

  return {};
};

const MainPage = ({ setInitialState, addMessage }) => {
  const [loaded, setLoaded] = useState(false);
  const { t } = useTranslation();
  const socket = useSocket();
  const socketLogger = debug('chat:socket');

  const chatBoxRef = useRef(null);

  useEffect(() => {
    const scroll = () => chatBoxRef.current.scrollTo(0, chatBoxRef.current.scrollHeight);
    const fetchContent = async () => {
      const { data, status } = await axios.get(routes.dataPath(), { headers: getAuthHeader() });
      if (status !== 200) {
        return;
      }
      setInitialState(data);
      setLoaded(true);
      socket.connect();
      socket.on('newMessage', (message) => {
        addMessage({ message });
        socketLogger('newMessage', message);
        scroll();
      });
      socket.on('newChannel', _.noop);
      socket.on('removeChannel', _.noop);
      socket.on('renameChannel', _.noop);
      scroll();
    };

    fetchContent();
  }, []);

  if (!loaded) {
    return (
      <div className="h-100 d-flex justify-content-center align-items-center">
        <div role="status" className="spinner-border text-primary">
          <span className="visually-hidden">{t('loading')}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container h-100 my-4 overflow-hidden rounded shadow">
      <div className="row h-100 bg-white flex-md-row">
        <div className="col-4 col-md-2 border-end pt-5 px-0 bg-light">
          <Channels />
        </div>
        <div className="col p-0 h-100">
          <Chat chatBox={chatBoxRef} />
        </div>
      </div>
    </div>
  );
};

export default connect(mapState, actionCreators)(MainPage);
