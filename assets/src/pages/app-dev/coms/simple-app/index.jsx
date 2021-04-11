import React, {useState} from 'react';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import {notification, message, Divider} from 'antd';
import {CheckCircleOutlined} from '@ant-design/icons';


import api from '@api/index';
import PAGES from '@lib/pages';
import {ADMIN_APP_CODE} from '@lib/consts';
import {MENU_ACTIONS} from '../app/app-op';

import getProc from './lib/get-proc';
import AppStatus from './app-status';
import {getCurrentWorking} from '../../util';

import './index.less';

const APP_SYMBOL = Symbol('__app__');

const isVersionExcept = (version) => {
  const clusters = version.cluster;

  let expectWorkerNum = 0;

  // eslint-disable-next-line
  for (const cluster of clusters) {
    expectWorkerNum += cluster.expectWorkerNum || 0;
  }

  return !!expectWorkerNum;
};

/**
 * 统计信息
 * 1. 最近发布
 * 2. 总版本数
 * 3. 在线版本数
 * 4. 异常版本数：（1）机器不同步的发布 （2）有错误日志
 * @param {Object[]} versions
 */
const getStat = (versions) => {
  const total = versions.length;
  const online = versions.filter(version => version.isCurrWorking).length;
  const publishAt = moment(_.last(versions).publishAt).format('YYYY-MM-DD HH:mm:ss');
  let exceptNum = 0;

  // eslint-disable-next-line
  for (const version of versions) {
    if (isVersionExcept(version)) {
      exceptNum++;
    }
  }

  return {
    publishAt: publishAt,
    total: total,
    online: online,
    exception: exceptNum
  };
};


const SimpleApp = (props) => {
  const {app, zIndex, currentClusterCode} = props;
  const {name, versions} = app;
  const isAdminApp = ADMIN_APP_CODE === name;
  const [isActive, setActive] = useState(false);
  const [cfgAppName, setCfgAppName] = useState(null);

  const workingApp = getCurrentWorking(versions);

  const onAppAction = async (key, appName) => {
    if (!appName) {
      return message.error('没有选择应用，请重新操作!');
    }

    const action = async () => {
      if (appName === APP_SYMBOL) {
        if (workingApp) {
          appName = workingApp.appId;
        } else {
          appName = _.get(versions, '[0].appId');
        }
      }


      switch (key) {
        // 删除app
        case MENU_ACTIONS.DELETE: {
          await api.appApi.del(currentClusterCode, appName);
          break;
        }

        // 重启app
        case MENU_ACTIONS.RELOAD: {
          await api.appApi.reload(currentClusterCode, appName);
          break;
        }

        // 配置app
        case MENU_ACTIONS.CONFIG: {
          // eslint-disable-next-line
          setCfgAppName(name);
          break;
        }

        // 查看app的日志
        case MENU_ACTIONS.LOG: {
          window.open(`${PAGES.LOG}?appName=${name}&clusterCode=${currentClusterCode}`);
          break;
        }

        // 回滚app
        case MENU_ACTIONS.ROLLBACK: {
          if (!workingApp) {
            return message.warn('没有可以回滚的版本！');
          }

          await api.appApi.stop(currentClusterCode, workingApp.appId);
          break;
        }

        // 启动app
        case MENU_ACTIONS.START: {
          await api.appApi.start(currentClusterCode, appName);
          break;
        }

        // 停止app
        case MENU_ACTIONS.STOP: {
          await api.appApi.stop(currentClusterCode, appName);
          break;
        }

        case MENU_ACTIONS.EXPEND: {
          setActive(!isActive);
          break;
        }

        default:
          return;
      }
    };

    try {
      await action();
      if (![MENU_ACTIONS.EXPEND, MENU_ACTIONS.LOG, MENU_ACTIONS.CONFIG].includes(key)) {
        message.success('操作成功！');
      }
    } catch (e) {
      notification.error({
        message: '操作失败',
        description: e.message
      });
    }
  };

  return (
    <div
      className="app simple-app"
      style={{zIndex: zIndex}}
    >
      <div className="app-name">
        <span>{name}</span>
      </div>
      <div className="simple-versions">
        {
          versions.map(version => {
            const [work, expect] = getProc(version.cluster);
            const {isCurrWorking} = version;

            return (
              <div className="one-version" key={version.version + version.buildNum}>
                <span className="version">{version.version}_{version.buildNum}</span>
                <span className="proc">
                  {work} / {expect}
                </span>
                <span className="created-time">
                  {
                    moment(version.publishAt).format('YYYY-MM-DD HH:mm')
                  }
                  {
                    isCurrWorking && (
                      <span className="from-now">
                        （{moment(version.publishAt).fromNow()}）
                      </span>
                    )
                  }
                </span>
                <span className="status">
                  <AppStatus
                    isCurrWorking={isCurrWorking}
                    cluster={version.cluster}
                  />
                  {
                    isCurrWorking && <CheckCircleOutlined style={{color: '#389e0d'}} />
                  }
                </span>
                <span className="mem">

                </span>
                <span className="cpu">

                </span>
                {
                  !isAdminApp && (
                    <span className="version-op">
                      <a className="stop">停止</a>
                      <Divider type="vertical" />
                      <a color="blue">重载</a>
                    </span>
                  )
                }
              </div>
            );
          })
        }
      </div>
      {
        !isAdminApp && (
          <div className="one-app-op">
            <a className="stop">运维</a>
            <Divider type="vertical" />
            <a className="stop">日志</a>
            <Divider type="vertical" />
            <a className="stop">配置</a>
          </div>
        )
      }
    </div>
  );
};

SimpleApp.propTypes = {
  app: PropTypes.shape({
    name: PropTypes.string,
    versions: PropTypes.arrayOf(PropTypes.shape({

    }))
  }),
  usage: PropTypes.object,
  zIndex: PropTypes.number,
  currentClusterCode: PropTypes.string
};

export default SimpleApp;

