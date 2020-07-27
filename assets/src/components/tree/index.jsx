import React, {useState} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {Spin} from 'antd';
import {FolderOpenOutlined, FolderOutlined} from '@ant-design/icons';

import './index.less';


const getMaster = (tree, nodeKey) => {
  if (!tree || !nodeKey) {
    return null;
  }

  const index = tree.findIndex(node => node.key === nodeKey);

  for (let i = index; i >= 0; i--) {
    if (tree[i].level === 0) {
      return tree[i];
    }
  }

  return null;
};

// 获取自己所属master的状态
const getMasterStatus = (tree, statusMap, nodeKey) => {
  const master = getMaster(tree, nodeKey);

  if (master === null) {
    console.warn(`节点${nodeKey}无父节点，树形结构可能有误，请检查`);

    return true;
  }

  const masterKey = master.key;

  return !!statusMap[masterKey];
};

// 两层树结构
// |- Folder
//    |- Node-1
//    |- Node-2
// |- Folder
const Tree = (props) => {
  const {
    tree = [], loading, activeKey, onSelect
  } = props;

  // 文件夹的开关状态，默认所有都是关
  const [folderStatus, setFolderStatus] = useState({});

  return (
    <Spin spinning={loading} className="file-tree">
      <ul className="tree-ul">
        {
          tree.map(item => {
            const isMaster = item.level === 0;
            const isSlave = item.level === 1;

            if (isSlave) {
              const isOpen = getMasterStatus(tree, folderStatus, item.key);

              if (!isOpen) {
                return true;
              }
            }

            return (
              <li
                key={item.key}
                onClick={() => {
                  if (isMaster) {
                    folderStatus[item.key] = !folderStatus[item.key];
                    setFolderStatus({...folderStatus});

                    return;
                  }
                  item.key && onSelect(item.key);
                }}
                className={
                  classnames({
                    master: isMaster,
                    slave: isSlave,
                    active: activeKey === item.key
                  })
                }
              >
                {
                  (isMaster && folderStatus[item.key]) && (
                    <FolderOpenOutlined />
                  )
                }
                {
                  (isMaster && !folderStatus[item.key]) && (
                    <FolderOutlined />
                  )
                }
                <span className="title">
                  {
                    item.title
                  }
                </span>
              </li>
            );
          })
        }
      </ul>
    </Spin>
  );
};

Tree.propTypes = {
  loading: PropTypes.bool,
  tree: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    level: PropTypes.number,
    icon: PropTypes.string,
    key: PropTypes.string
  })),
  activeKey: PropTypes.string,
  onSelect: PropTypes.func
};

export default Tree;
