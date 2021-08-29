import React, { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useSocket } from '../hooks';
import { chatLogger } from '../logger';
import * as actions from '../actions';
import NameModal from './NameModal.jsx';

const mapStateToProps = (state) => {
  const { channelsInfo: { channels } } = state;
  return { channels };
};

const actionCreators = {
  setCurrentChannel: actions.setCurrentChannel,
};

const Add = ({ channels, onHide, setCurrentChannel }) => {
  const { t } = useTranslation();
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current.focus();
  }, []);
  const socket = useSocket();

  const formik = useFormik({
    initialValues: {
      name: '',
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
        chatLogger('channel.create.error');
        formik.setSubmitting(false);
        inputRef.current.focus();
      };

      const channel = { ...values };

      socket.volatile.emit('newChannel', channel, socket.withTimeout(({ status, data }) => {
        if (status !== 'ok') {
          onError();
          return;
        }
        chatLogger('channel.create', data);
        setCurrentChannel({ currentChannelId: data.id });
        onHide();
      }, onError));
    },
  });

  return <NameModal onHide={onHide} name="popup.title.add" formik={formik} inputRef={inputRef} />;
};
export default connect(mapStateToProps, actionCreators)(Add);
