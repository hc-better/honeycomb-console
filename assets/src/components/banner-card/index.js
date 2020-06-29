import React from 'react';
import PropTypes from 'prop-types';

import './index.less';

const BannerCard = (props) => {
  return (
    <div className="banner-card">
      {
        props.children
      }
    </div>
  );
};

BannerCard.propTypes = {
  children: PropTypes.element
};

export default BannerCard;
