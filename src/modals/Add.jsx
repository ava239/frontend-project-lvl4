import React, { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { Modal, Form, Button } from 'react-bootstrap';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useSocket } from '../hooks';
import { chatLogger } from '../logger';
import * as actions from '../actions';

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

  return (
    <Modal show centered>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>{t('popup.title.add')}</Modal.Title>
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
export default connect(mapStateToProps, actionCreators)(Add);
