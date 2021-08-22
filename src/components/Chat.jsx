import { useFormik } from 'formik';
import * as yup from 'yup';
import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';

const mapStateToProps = (state) => {
  const { messagesInfo: { messages }, channelsInfo: { channels, currentChannelId } } = state;
  const channel = _.find(channels, ({ id }) => id === currentChannelId);
  const messagesByChannel = _.filter(
    messages,
    ({ channelId }) => channelId === currentChannelId,
  );
  return { channel, messagesByChannel };
};

const actionCreators = {};

const Chat = ({
  channel = { name: '' },
  messagesByChannel,
}) => {
  const { t } = useTranslation();
  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const formik = useFormik({
    initialValues: {
      body: '',
    },
    validationSchema: yup.object().shape({
      body: yup.string().required(),
    }),
    onSubmit: () => {},
  });

  const renderMessage = (message) => (
    <div key={message.id} className="text-break mb-2">
      <b>{message.username}</b>
      :
      {message.body}
    </div>
  );

  return (
    <div className="d-flex flex-column h-100">
      <div className="bg-light mb-4 p-3 shadow-sm small">
        <p className="m-0">
          <b>{t('channel_name', { name: channel.name })}</b>
        </p>
        <span className="text-muted">
          {t('messages', { count: messagesByChannel.length })}
        </span>
      </div>
      <div id="messages-box" className="chat-messages overflow-auto px-5 ">
        {messagesByChannel.map(renderMessage)}
      </div>
      <div className="mt-auto px-5 py-3">
        <Form noValidate className="py-1 border rounded-2">
          <InputGroup className="has-validation">
            <Form.Control
              onChange={formik.handleChange}
              value={formik.values.body}
              type="text"
              data-testid="new-message"
              name="body"
              placeholder={t('enter_message')}
              id="body"
              className="border-0 p-0 ps-2"
              ref={inputRef}
            />
            <Button variant="" disabled={formik.isValid} type="submit" className="btn-group-vertical">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"
                />
              </svg>
              <span className="visually-hidden">{t('send')}</span>
            </Button>
          </InputGroup>
        </Form>
      </div>
    </div>
  );
};
export default connect(mapStateToProps, actionCreators)(Chat);
