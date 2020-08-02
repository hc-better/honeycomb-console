/* eslint-disable react/display-name */
/* eslint-disable camelcase */
import React, {useState, useEffect, useCallback} from 'react';
import {Table, Button, Divider, Space, Tooltip, Tag, Modal, message} from 'antd';
import _ from 'lodash';
import moment from 'moment';
import {connect} from 'dva';
import PropTypes from 'prop-types';
import {aclApi, appApi} from '@api';
import CommonTitle from '@coms/common-title';
import notification from '@coms/notification';
import {tryParse, tryArrToStr} from '@lib/util';
import {USER_ROLE_TITLE} from '@lib/consts';
// import {clusterType} from '@lib/prop-types';

import ClusterSelector from './cluster-selector';
import authAdd from './auth-add';

const DEFAULT_APP = {
  name: '*',
  title: '*（所有APP）',
};

const ClusterAuth = (props) => {
  const {currentClusterCode, clusters, loading: clusterLoading} = props;

  const [loading, setLoading] = useState(true);
  const [aclList, setAclList] = useState([]);
  const [appList, setAppList] = useState([]);
  const [clusterCode, setClusterCode] = useState(currentClusterCode);
  const selectedCluster = {
    code: _.get(clusters, `${clusterCode}.code`),
    id: _.get(clusters, `${clusterCode}.id`),
    name: _.get(clusters, `${clusterCode}.name`),
  };

  const getAclList = async () => {
    try {
      setLoading(true);
      const list = await aclApi.aclList();

      setAclList(list.filter((item) => item.cluster_code === clusterCode));
    } catch (error) {
      notification.error({
        message: '请求权限列表失败',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const getAppList = async () => {
    try {
      const {success} = await appApi.appList(clusterCode);

      setAppList(success);
    } catch (error) {
      notification.error({
        message: '请求应用列表失败',
        description: error.message,
      });
    }
  };

  useEffect(() => {
    (async () => {
      if (!clusterCode) {
        return;
      }
      await getAppList();
      await getAclList();
    })();
  }, [clusterCode]);

  const handleAuthAdd = useCallback(() => {
    authAdd({getAclList, selectedCluster, appList});
  });

  const handleEdit = (row) => {
    authAdd({getAclList, selectedCluster, appList, row});
  };

  const handleConfirm = useCallback(row => {
    const values = {
      acl: {
        id: row.id,
        name: row.name,
        cluster_admin: row.cluster_admin,
        apps: tryArrToStr(row.apps),
        cluster_code: selectedCluster.code,
        cluster_id: selectedCluster.id,
        cluster_name: selectedCluster.name,
        gmt_create: row.gmt_create,
        gmt_modified: row.gmt_modified,
      },
      clusterCode: selectedCluster.code,
    };

    Modal.confirm({
      title: `确定要删除该权限吗？`,
      content: `无法复原，请谨慎操作`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          await aclApi.deleteAcl(row.id, values);
          message.success('权限删除成功');
          getAclList();
        } catch (error) {
          notification.error({
            message: '权限删除失败',
            description: error.message,
          });
        }
      },
    });
  });

  const cols = () => [
    {
      title: '用户',
      dataIndex: 'name',
      render: (text) => {
        const maxLength = _.size(text);

        return maxLength >= 25 ? (
          <Tooltip trigger={['hover']} title={text} placement="topLeft">
            <span>{text}</span>
          </Tooltip>
        ) : (
          <span>{text}</span>
        );
      },
    },
    {
      title: '权限',
      dataIndex: 'cluster_admin',
      render: (text) => {
        return <Tag color="#55bc8a">{USER_ROLE_TITLE[text]}</Tag>;
      },
    },
    {
      title: '拥有的APP',
      dataIndex: 'apps',
      render: (text) => {
        const apps = tryParse(text, []);

        return apps.map((app) => {
          if (app === '__ADMIN__') {
            return null;
          }

          if (app === '*')
            return <Tag key={DEFAULT_APP.name}>{DEFAULT_APP.title}</Tag>;

          return <Tag key={app}>{app}</Tag>;
        });
      },
    },
    {
      title: '创建时间',
      dataIndex: 'gmt_create',
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '更新时间',
      dataIndex: 'gmt_modified',
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (text, record) => {
        const style = {padding: '0px'};

        return (
          <div>
            <Button
              style={style}
              type="link"
              onClick={() => handleEdit(record)}
            >
              编辑
            </Button>
            <Divider type="vertical" />
            <Button
              style={style}
              type="link"
              onClick={() => handleConfirm(record)}
            >
              删除
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <CommonTitle>集群授权</CommonTitle>
      <Space style={{marginBottom: '10px'}}>
        <ClusterSelector
          clusters={clusters}
          value={clusterCode}
          onChange={(clusterCode) => setClusterCode(clusterCode)}
        />
        <Button type="primary" onClick={handleAuthAdd}>
          + 添加权限
        </Button>
      </Space>
      <Table
        loading={clusterLoading || loading}
        columns={cols()}
        dataSource={aclList}
        rowKey="id"
      />
    </div>
  );
};

ClusterAuth.propTypes = {
  loading: PropTypes.bool,
  dispatch: PropTypes.func,
  // clusters: PropTypes.arrayOf(clusterType),
  clusters: PropTypes.object,
  currentClusterCode: PropTypes.string,
};

const mapStateProps = (state) => {
  const loading = state.loading;
  const clusterLoading = _.get(loading.effects, 'global/getCluster');

  return {
    ...state.global,
    loading: clusterLoading,
  };
};

export default connect(mapStateProps)(ClusterAuth);
