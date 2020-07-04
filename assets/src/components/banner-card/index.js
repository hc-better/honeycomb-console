import React from 'react';
import PropTypes from 'prop-types';

import './index.less';

const BannerCard = (props) => {
  return (
    <div
      {...props}
      className={`banner-card ${props.className}`}
    >
      {
        props.children
      }
    </div>
  );
};

BannerCard.propTypes = {
  children: PropTypes.element,
  style: CSSStyleSheet,
  className: PropTypes.string
};

export default BannerCard;
