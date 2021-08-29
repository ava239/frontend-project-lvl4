import React, { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { Modal, Form, Button } from 'react-bootstrap';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import _ from 'lodash';
import { useSocket } from '../hooks';
import { chatLogger } from '../logger';

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

  return (
    <Modal show centered>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>{t('popup.title.rename')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group>
            <Form.Control
              onChange={formik.handleChange}
              className="mb-2"
              data-testid="input-body"
              name="name"
              required
              value={formik.values.name}
              ref={inputRef}
              isInvalid={!formik.isValid}
              disabled={formik.isSubmitting}
            />
            <Form.Control.Feedback type="invalid">{formik.errors.name}</Form.Control.Feedback>
            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" type="button" onClick={onHide}>
                {t('popup.button.cancel')}
              </Button>
              <Button variant="primary" type="submit" disabled={formik.isSubmitting}>
                {t('popup.button.send')}
              </Button>
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
export default connect(mapStateToProps, actionCreators)(Rename);
