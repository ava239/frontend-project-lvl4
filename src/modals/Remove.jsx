import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useSocket } from '../hooks';
import { chatLogger } from '../logger';

const mapStateToProps = (state) => {
  const { modal: { extra: { channelId: id } } } = state;
  return { id };
};

const actionCreators = {};

const Remove = ({
  onHide,
  id,
}) => {
  const { t } = useTranslation();
  const socket = useSocket();
  const [submitting, setSubmitting] = useState(false);

  const handleRemove = () => {
    const onError = () => {
      chatLogger('channel.remove.error');
      setSubmitting(false);
    };

    setSubmitting(true);
    socket.volatile.emit('removeChannel', { id }, socket.withTimeout(({ status }) => {
      if (status !== 'ok') {
        onError();
        return;
      }
      chatLogger('channel.delete');
      onHide();
    }, onError));
  };

  return (
    <Modal show centered>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>{t('remove_channel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="lead">{t('confirm')}</p>
        <div className="d-flex justify-content-end">
          <Button variant="secondary" disabled={submitting} className="me-2" type="button" onClick={onHide}>{t('cancel')}</Button>
          <Button variant="danger" disabled={submitting} type="submit" onClick={handleRemove}>{t('remove')}</Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};
export default connect(mapStateToProps, actionCreators)(Remove);
