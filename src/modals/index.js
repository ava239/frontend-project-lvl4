import Add from './Add.jsx';
import Remove from './Remove.jsx';
import Rename from './Rename.jsx';

const modals = {
  addChannel: Add,
  removeChannel: Remove,
  renaming: Rename,
};

export default (modalName) => modals[modalName];
