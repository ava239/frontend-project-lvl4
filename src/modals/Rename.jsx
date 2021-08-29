import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { useSocket } from '../hooks';
import { chatLogger } from '../logger';
import NameModal from './NameModal.jsx';

const mapStateToProps = (state) => {
  const { channelsInfo: { channels }, modal: { extra: { channelId } } } = state;
  const channel = _.find(channels, ({ id }) => channelId === id);
  return { channel, channelId };
};

const actionCreators = {};

const Rename = ({
  channel,
  onHide,
  channelId,
}) => {
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current.select();
  }, []);
  const socket = useSocket();

  const onSubmit = (formik) => (values) => {
    const onError = () => {
      chatLogger('channel.rename.error');
      formik.setSubmitting(false);
      inputRef.current.select();
    };

    const sendData = { ...values, id: channelId };

    socket.volatile.emit('renameChannel', sendData, socket.withTimeout(({ status }) => {
      if (status !== 'ok') {
        onError();
        return;
      }
      chatLogger('channel.rename');
      onHide();
    }, onError));
  };

  return <NameModal onHide={onHide} initialName={channel.name} nameKey="popup.title.rename" onSubmit={onSubmit} inputRef={inputRef} />;
};
export default connect(mapStateToProps, actionCreators)(Rename);
