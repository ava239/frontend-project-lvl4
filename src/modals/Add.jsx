import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { useSocket } from '../hooks';
import { chatLogger } from '../logger';
import * as actions from '../actions';
import NameModal from './NameModal.jsx';
import { withTimeout } from '../contexts';

const mapStateToProps = () => ({});

const actionCreators = {
  setCurrentChannel: actions.setCurrentChannel,
};

const Add = ({ onHide, setCurrentChannel }) => {
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current.focus();
  }, []);
  const socket = useSocket();

  const onSubmit = (formik) => (values) => {
    const onError = () => {
      chatLogger('channel.create.error');
      formik.setSubmitting(false);
      inputRef.current.focus();
    };

    socket.volatile.emit('newChannel', { ...values }, withTimeout(({ status, data }) => {
      if (status !== 'ok') {
        onError();
        return;
      }
      chatLogger('channel.create', data);
      setCurrentChannel({ currentChannelId: data.id });
      onHide();
    }, onError));
  };

  return <NameModal onHide={onHide} initialName="" testId="add-channel" nameKey="popup.title.add" onSubmit={onSubmit} inputRef={inputRef} />;
};
export default connect(mapStateToProps, actionCreators)(Add);
