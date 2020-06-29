import React, {useEffect, useState} from 'react';
import {connect} from 'dva';
import api from '@api/index';
import {notification} from 'antd';
import PropTypes from 'prop-types';
import {withRouter} from 'dva/router';
import {FolderOpenOutlined} from '@ant-design/icons';

import setQuery from '@lib/set-query';
import s2q from '@lib/search-to-query';
import msgParser from '@lib/msg-parser';
import filepaths2tree from '@lib/filepath-to-tree';

import FileTree from './coms/file-tree';
import LogPanel from './coms/log-panel';
import './index.less';

const DEFAULT_ACTIVE_LOG = 'server.{year}-{month}-{day}.log';

// 日志模块
const Log = (props) => {
  const {currentClusterCode, currentCluster} = props;
  const [filesLoading, setFileLoading] = useState(false);
  const [tree, setTree] = useState([]);
  const [activeLog, setActiveLog] = useState(DEFAULT_ACTIVE_LOG);

  // 获取日志列表
  const getLogFiles = async (currentClusterCode) => {
    if (!currentClusterCode) {
      return;
    }

    setFileLoading(true);
    try {
      const files = await api.logApi.getLogFiles(currentClusterCode);
      const tree = filepaths2tree(files);

      tree.forEach(item => {
        if (!item.parent) {
          item.icon = <FolderOpenOutlined />;
        }
      });

      setTree(tree);

      return tree;
    } catch (e) {
      notification.error({
        message: '获取日志列表失败',
        description: msgParser(e.message)
      });
    } finally {
      setFileLoading(false);
    }
  };

  const readHistoryLogFilepath = (tree) => {
    const query = s2q(props.location.search);
    const historyLogFp = query.logFilepath;

    if (!historyLogFp) {
      return;
    }

    if (!Array.isArray(tree)) {
      return;
    }


    if (!tree.some(item => item.key === historyLogFp)) {
      return;
    }

    onSelectFile(historyLogFp);
  };

  useEffect(() => {
    (async () => {
      const tree = await getLogFiles(currentClusterCode);

      await readHistoryLogFilepath(tree);
    })();
  }, [currentClusterCode]);

  const onSelectFile = (filepath) => {
    setQuery(props.location, props.dispatch, {logFilepath: filepath});

    setActiveLog(filepath);
  };

  return (
    <div>
      <div className="log-left-side">
        <div className="file-list-title">日志列表</div>
        <FileTree
          tree={tree}
          loading={filesLoading}
          onSelectFile={onSelectFile}
          activeKey={activeLog}
        />
      </div>
      <div className="log-right-side">
        <LogPanel
          clusterCode={currentClusterCode}
          logFileName={activeLog}
          currentCluster={currentCluster}
        />
      </div>
    </div>
  );
};

const mapState2Props = (state) => {
  return {
    currentClusterCode: state.global.currentClusterCode,
    currentCluster: state.global.currentCluster
  };
};

Log.propTypes = {
  currentClusterCode: PropTypes.string,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  currentCluster: PropTypes.object
};

export default withRouter(connect(mapState2Props)(Log));
