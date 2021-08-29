import { useFormik } from 'formik';
import * as yup from 'yup';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import { useAuth, useSocket } from '../hooks';
import { chatLogger } from '../logger';
import { withTimeout } from '../contexts';

const mapStateToProps = (state) => {
  const { messagesInfo: { messages }, channelsInfo: { channels, currentChannelId } } = state;
  const channel = _.find(channels, ({ id }) => id === currentChannelId);
  const messagesByChannel = _.filter(
    messages,
    ({ channelId }) => channelId === currentChannelId,
  );
  return { channel, messagesByChannel, currentChannelId };
};

const actionCreators = {};

const Chat = ({
  channel,
  messagesByChannel,
  currentChannelId,
  chatBox,
  messageInput,
}) => {
  const { t } = useTranslation();
  const auth = useAuth();
  const socket = useSocket();

  useEffect(() => {
    messageInput.current.focus();
  }, []);

  const formik = useFormik({
    initialValues: {
      body: '',
    },
    validationSchema: yup.object().shape({
      body: yup.string().required().min(1),
    }),
    validateOnMount: true,
    onSubmit: (values) => {
      const onError = () => {
        chatLogger('message.send.error');
        formik.setSubmitting(false);
        messageInput.current.focus();
      };

      const message = { ...values, channelId: currentChannelId, username: auth.username };
      chatLogger('message.send');

      socket.volatile.emit('newMessage', message, withTimeout(({ status }) => {
        if (status !== 'ok') {
          onError();
          return;
        }
        formik.resetForm({ isSubmitting: false });
        messageInput.current.focus();
      }, onError));
    },
  });

  const renderMessage = (message) => (
    <div key={message.id} className="text-break mb-2">
      <b>{message.username}</b>
      {`: ${message.body}`}
    </div>
  );

  return (
    <div className="d-flex flex-column h-100">
      <div className="bg-light mb-4 p-3 shadow-sm small">
        <p className="m-0">
          <b>{t('chat.channel_name', { name: channel && channel.name })}</b>
        </p>
        <span className="text-muted">{t('chat.message_count.messages', { count: messagesByChannel.length })}</span>
      </div>
      <div id="messages-box" ref={chatBox} className="chat-messages overflow-auto px-5">
        {messagesByChannel.map(renderMessage)}
      </div>
      <div className="mt-auto px-5 py-3">
        <Form noValidate className="py-1 border rounded-2" onSubmit={formik.handleSubmit}>
          <InputGroup className="has-validation">
            <Form.Control
              onChange={formik.handleChange}
              value={formik.values.body}
              type="text"
              data-testid="new-message"
              name="body"
              placeholder={t('chat.placeholder')}
              id="body"
              className="border-0 p-0 ps-2"
              ref={messageInput}
              disabled={formik.isSubmitting}
            />
            <Button variant="" disabled={!formik.dirty || formik.isSubmitting} type="submit" className="btn-group-vertical">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"
                />
              </svg>
              <span className="visually-hidden">{t('chat.send')}</span>
            </Button>
          </InputGroup>
        </Form>
      </div>
    </div>
  );
};
export default connect(mapStateToProps, actionCreators)(Chat);
