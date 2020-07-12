import React from 'react';
// import _ from 'lodash';
import {Card} from 'antd';
// import BannerCard from '@coms/banner-card';
import './index.less';

const TitleCard = () => {
  return (
    <div className="title-card">
      <Card
        bordered={false}
        style={{
          marginBottom: '10px',
        }}
        bodyStyle={{ padding: 0 }}
      >
        <div className="cover">
          <div className="title">
            <div className="h">集群状态监控</div>
            <p>监控集群的运行状态</p>
          </div>
        </div>
        <p>Card Select</p>
      </Card>
    </div>
  );
};

export default TitleCard;
