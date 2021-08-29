import React, { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import _ from 'lodash';
import { useSocket } from '../hooks';
import { chatLogger } from '../logger';
import NameModal from './NameModal.jsx';

const mapStateToProps = (state) => {
  const { channelsInfo: { channels }, modal: { extra: { channelId } } } = state;
  const channel = _.find(channels, ({ id }) => channelId === id);
  return { channel, channels, channelId };
};

const actionCreators = {};

const Rename = ({
  channel,
  channels,
  onHide,
  channelId,
}) => {
  const { t } = useTranslation();
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current.select();
  }, []);
  const socket = useSocket();

  const formik = useFormik({
    initialValues: {
      name: channel.name,
    },
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: yup.object().shape({
      name: yup.string()
        .required(t('validation.required_field'))
        .min(3, t('validation.username_length'))
        .max(20, t('validation.username_length'))
        .test('unique', t('validation.should_be_unique'), (element) => !channels.map(({ name }) => name).includes(element)),
    }),
    onSubmit: (values) => {
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
    },
  });

  return <NameModal onHide={onHide} name="popup.title.rename" formik={formik} inputRef={inputRef} />;
};
export default connect(mapStateToProps, actionCreators)(Rename);
