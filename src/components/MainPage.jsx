// @ts-check

import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import * as actions from '../actions';
import routes from '../routes.js';
import Channels from './Channels.jsx';
import Chat from './Chat.jsx';
import { useSocket } from '../hooks';
import getModal from '../modals/index.js';
import { socketLogger } from '../logger';

const mapStateToProps = (state) => {
  const { modal } = state;
  return { modal };
};

const actionCreators = {
  setInitialState: actions.setInitialState,
  addMessage: actions.addMessage,
  addChannel: actions.addChannel,
  removeChannel: actions.removeChannel,
  renameChannel: actions.renameChannel,
  openModal: actions.openModal,
  closeModal: actions.closeModal,
};

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (user && user.token) {
    return { Authorization: `Bearer ${user.token}` };
  }

  return {};
};

const renderModal = ({ modalInfo, closeModal }) => {
  if (!modalInfo.isOpened) {
    return null;
  }

  const Component = getModal(modalInfo.type);
  return <Component modalInfo={modalInfo} onHide={() => closeModal()} />;
};

const MainPage = ({
  setInitialState,
  addMessage,
  addChannel,
  modal,
  closeModal,
  removeChannel,
  renameChannel,
  openModal,
}) => {
  const [loaded, setLoaded] = useState(false);
  const { t } = useTranslation();
  const socket = useSocket();

  const chatRef = useRef(null);
  const messageRef = useRef(null);
  const scroll = () => {
    if (!chatRef || !chatRef.current.scrollTo) {
      return;
    }
    chatRef.current.scrollTo(0, chatRef.current.scrollHeight);
  };

  useEffect(() => {
    // eslint-disable-next-line functional/no-let
    let fetched = false;
    const fetchContent = async () => {
      const { data, status } = await axios.get(routes.dataPath(), { headers: getAuthHeader() });
      if (status !== 200 || fetched) {
        return;
      }
      setInitialState(data);
      setLoaded(true);
      scroll();
      if (socket.connect) {
        socket.connect();
      }
      socket.on('newMessage', (message) => {
        addMessage({ message });
        socketLogger('newMessage', message);
        scroll();
      });
      socket.on('newChannel', (channel) => {
        addChannel({ channel });
        socketLogger('newChannel', channel);
      });
      socket.on('removeChannel', (channel) => {
        removeChannel({ channelId: channel.id });
        socketLogger('removeChannel', channel);
      });
      socket.on('renameChannel', (channel) => {
        renameChannel(channel);
        socketLogger('renameChannel', channel);
      });
    };

    fetchContent();
    return () => { fetched = true; };
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
    <>
      <div className="container h-100 my-4 overflow-hidden rounded shadow">
        <div className="row h-100 bg-white flex-md-row">
          <div className="col-4 col-md-2 border-end pt-5 px-0 bg-light">
            <Channels showModal={openModal} messageInput={messageRef} />
          </div>
          <div className="col p-0 h-100">
            <Chat chatBox={chatRef} messageInput={messageRef} />
          </div>
        </div>
      </div>
      {renderModal({ modalInfo: modal, closeModal })}
    </>
  );
};

export default connect(mapStateToProps, actionCreators)(MainPage);
