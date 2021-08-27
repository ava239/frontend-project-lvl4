import React from 'react';
import { connect } from 'react-redux';
import { Button, ButtonGroup, Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import * as actions from '../actions';

const mapStateToProps = (state) => {
  const { channelsInfo: { channels, currentChannelId } } = state;
  return { channels: Object.values(channels), currentChannelId };
};

const actionCreators = {
  setCurrentChannel: actions.setCurrentChannel,
};

const Channels = ({
  channels,
  currentChannelId,
  setCurrentChannel,
  showModal,
  messageInput,
}) => {
  const { t } = useTranslation();

  const openAddChannelModal = () => showModal({ type: 'addChannel' });
  const openRemoveChannelModal = ({ id }) => showModal({ type: 'removeChannel', extra: { channelId: id } });
  const openRenameChannelModal = ({ id }) => showModal({ type: 'renameChannel', extra: { channelId: id } });

  const renderChannel = (channel) => {
    const currentVariant = channel.id === currentChannelId ? 'secondary' : null;
    const changeChannel = () => {
      setCurrentChannel({ currentChannelId: channel.id });
      messageInput.current.focus();
    };

    if (!channel.removable) {
      return (
        <li key={channel.id} className="nav-item w-100">
          <Button className="w-100 rounded-0 text-start" variant={currentVariant} onClick={changeChannel}>
            <span className="me-1">#</span>
            {channel.name}
          </Button>
        </li>
      );
    }

    return (
      <li key={channel.id} className="nav-item w-100">
        <Dropdown as={ButtonGroup} className="d-flex">
          <Button
            className="w-100 rounded-0 text-start text-truncate"
            variant={currentVariant}
            onClick={changeChannel}
          >
            <span className="me-1">#</span>
            {channel.name}
          </Button>
          <Dropdown.Toggle split variant={currentVariant} />

          <Dropdown.Menu>
            <Dropdown.Item onClick={() => openRemoveChannelModal(channel)}>{t('remove')}</Dropdown.Item>
            <Dropdown.Item onClick={() => openRenameChannelModal(channel)}>{t('rename')}</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </li>
    );
  };

  return (
    <>
      <div className="d-flex justify-content-between mb-2 ps-4 pe-2">
        <span>Каналы</span>
        <button type="button" className="p-0 text-primary btn btn-group-vertical" onClick={openAddChannelModal}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
          </svg>
          <span className="visually-hidden">+</span>
        </button>
      </div>
      <ul className="nav flex-column nav-pills nav-fill px-2">
        {channels.map(renderChannel)}
      </ul>
    </>
  );
};
export default connect(mapStateToProps, actionCreators)(Channels);
