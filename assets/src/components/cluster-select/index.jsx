<<<<<<< HEAD
import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import classnames from 'classnames';
import {Modal, message} from 'antd';
import {CheckCircleOutlined, DesktopOutlined} from '@ant-design/icons';

import WhiteSpace from '@coms/white-space';

import './index.less';

const ClusterSelect = (props) => {
  const clusters = props.clusters;
  const [visible, setVisible] = useState(true);
  const [clusterCode, setClusterCode] = useState(null);

  const onOk = () => {
    if (!clusterCode) {
      return message.warn('请选择一个集群');
    }

    props.onOk(clusterCode);
    setVisible(false);
  };

  const onClickCluster = (clusterCode) => {
    setClusterCode(clusterCode);
  };

  return (
    <Modal
      title="请选择一个集群"
      onOk={onOk}
      visible={visible}
      okText="确定"
      cancelButtonProps={{style: {display: 'none'}}}
      width={680}
      closeIcon={null}
    >
      <div className="cluster-select">
        {
          Object.keys(clusters).map(key => {
            const cluster = clusters[key];

            return (
              <div
                title={cluster.name}
                className={classnames('cluster-item', {active: clusterCode === key})}
                key={key}
                onClick={() => onClickCluster(key)}
              >
                <DesktopOutlined />
                <WhiteSpace />
                <WhiteSpace />
                {cluster.name}（key）
                <span className="active-icon">
                  <CheckCircleOutlined />
                </span>
              </div>
            );
          })
        }
      </div>
=======
import React from 'react';
import {Modal} from 'antd';

const ClusterSelect = () => {
  return (
    <Modal title="请选择一个集群">

>>>>>>> feat: 增加集群切换 & 常用集群功能
    </Modal>
  );
};

<<<<<<< HEAD
ClusterSelect.propTypes = {
  clusters: PropTypes.object,
  onOk: PropTypes.func
};

export default (clusters) => {
  return new Promise((res) => {
    const div = document.createElement('div');

    ReactDOM.render(
      <ClusterSelect
        clusters={clusters}
        onOk={res}
      />,
      div
    );

    document.body.appendChild(div);
  });
};
=======
export default ClusterSelect;
>>>>>>> feat: 增加集群切换 & 常用集群功能
