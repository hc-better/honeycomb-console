import React, {useState, useEffect} from 'react';
import {connect} from 'dva';
import PropTypes from 'prop-types';
import Q from 'queue';
import {Spin} from 'antd';

import api from '@api/index';
import Ring from '@coms/ring';
import BannerCard from '@coms/banner-card';
import useInterval from '@lib/use-interval';

import App from './coms/app';

const q = new Q({
  autostart: true,
  concurrency: 1
});

const AppDev = (props) => {
  const {currentClusterCode} = props;
  const [appList, setAppList] = useState([]);
  const [errCount, setErrCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const getApiList = async () => {
    if (!currentClusterCode) {
      return;
    }

    try {
      const {success} = await api.appApi.appList(currentClusterCode);

      setAppList(success);
      setLoading(false);
    } catch (e) {
      setErrCount(errCount + 1);
    }
  };

  useInterval(() => {
    q.push(getApiList);
  }, 1000);

  useEffect(() => {
    setErrCount(0);
    setAppList([]);
    setLoading(false);
  }, [currentClusterCode]);

  return (
    <div>
      <BannerCard>
        <Ring
          total={10}
          success={7}
        />
      </BannerCard>

      应用列表
      <div className="app-list">
        <Spin spinning={loading}>
          {
            appList.map(app => {
              return (
                <App
                  key={app.name}
                  app={app}
                />
              );
            })
          }
        </Spin>
      </div>
    </div>
  );
};


AppDev.propTypes = {
  currentClusterCode: PropTypes.string,
};

const mapState2Props = (state) => {
  return {
    currentClusterCode: state.global.currentClusterCode
  };
};

export default connect(mapState2Props)(AppDev);
