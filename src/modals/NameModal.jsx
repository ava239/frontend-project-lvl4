import { Button, Form, Modal } from 'react-bootstrap';
import React from 'react';
import { useTranslation } from 'react-i18next';

const NameModal = ({
  name,
  formik,
  onHide,
  inputRef,
}) => {
  const { t } = useTranslation();
  return (
    <Modal show centered>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>{t(name)}</Modal.Title>
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
export default NameModal;
