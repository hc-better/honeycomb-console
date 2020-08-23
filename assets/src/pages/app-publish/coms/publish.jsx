import React, {useState} from 'react';
import {Button, Upload, Modal, message, Progress} from 'antd';
import PropTypes from 'prop-types';

import api from '@api/index';

import {UploadOutlined} from '@ant-design/icons';

const UploadModal = () => {

};

const Publish = (props) => {
  const {clusterCode, onFinish} = props;

  const [file, setFile] = useState(null);

  const onProgress = (loaded, total) => {

  };

  const uploadProps = {
    beforeUpload: (file) => {
      setFile(file);

      Modal.confirm({
        title: '确定要发布应用到当前集群？',
        onOk: async () => {
          if (!file) {
            message.error('当前尚未选择文件！');

            return;
          }

          await api.appApi.upload(clusterCode, file, onProgress);
        }
      });

      return false;
    },
    showUploadList: false
  };

  return (
    <div>
      <Upload
        {...uploadProps}
      >
        <Button type="primary">
          <UploadOutlined /> 应用发布
        </Button>
      </Upload>
    </div>
  );
};

Publish.propTypes = {
  clusterCode: PropTypes.string,
  onFinish: PropTypes.func        // 上传结束时的响应函数
};

export default Publish;

