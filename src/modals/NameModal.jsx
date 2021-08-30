import { Button, Form, Modal } from 'react-bootstrap';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
  const { channelsInfo: { channels } } = state;
  return { channels };
};
const actionCreators = {};

const NameModal = ({
  nameKey,
  onSubmit,
  onHide,
  inputRef,
  channels,
  initialName,
  testId,
}) => {
  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: {
      name: initialName,
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
    onSubmit: (values) => onSubmit(formik)(values),
  });

  return (
    <Modal show centered>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>{t(nameKey)}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group>
            <Form.Control
              onChange={formik.handleChange}
              className="mb-2"
              data-testid={testId}
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
export default connect(mapStateToProps, actionCreators)(NameModal);
