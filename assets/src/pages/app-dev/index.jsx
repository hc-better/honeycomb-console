import React from 'react';
import BannerCard from '@coms/banner-card';
import Ring from '@coms/ring';

const UserDev = () => {
  return (
    <div>
      <BannerCard>
        <Ring
          total={10}
          success={7}
        />
      </BannerCard>
    </div>
  );
};

export default UserDev;
