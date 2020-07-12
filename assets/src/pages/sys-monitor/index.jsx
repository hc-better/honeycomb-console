/* eslint-disable no-unused-vars */
import React, {useState} from 'react';
import _ from 'lodash';
import {connect} from 'dva';
import CommonTitle from '@coms/common-title';
import {Button} from 'antd';
import BannerCard from '@coms/banner-card';
import TimeRangeSelector from '@coms/timeRangeSelector';
import TitleCard from './coms/titleCard/index';

const UserManager = () => {
  const [users, setUser] = useState([]);
  const [loading, setLoading] = useState(false);

  return (
    <div>
      <TitleCard></TitleCard>
      <Button type="primary" className="margin-b10">
        + 添加用户
      </Button>
      <BannerCard>
        <TimeRangeSelector />
      </BannerCard>
    </div>
  );
};

const mapStateProps = (state) => {
  const user = state.user;
  // const loading = state.loading;
  // const userLoading = _.get(loading.effects, 'user/getUsers');

  return {
    user,
    // loading: userLoading,
  };
};

export default connect(mapStateProps)(UserManager);
