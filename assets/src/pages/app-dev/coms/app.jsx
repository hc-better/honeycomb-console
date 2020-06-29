import React from 'react';
import PropTypes from 'prop-types';

import './app.less';

const App = (props) => {
  const {app} = props;
  const {name} = app;

  return (
    <div className="app">
      {name}
    </div>
  );
};

App.propTypes = {
  app: PropTypes.shape({
    name: PropTypes.string
  })
};

export default App;

