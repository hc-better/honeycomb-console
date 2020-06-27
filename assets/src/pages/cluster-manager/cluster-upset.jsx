import React, {useState, useCallback} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {Modal, Form, Input, message, Select} from 'antd';
import {clusterApi} from '@api';
import notification from '@coms/notification';
import _ from 'lodash';

// eslint-disable-next-line max-len
const ipRegex = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;
// eslint-disable-next-line max-len
const httpIpPortRegex = /^(http[s]?)?:\/\/(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]):[0-9]+$/;
const layout = {
  labelCol: {span: 4},
  wrapperCol: {span: 20},
};

const ClusterUpset = (props) => {
  const [form] = Form.useForm();
  const [comfirmLoading, setComfirmLoading] = useState(false);
  const [visible, setVisible] = useState(true);

  const isAdd = _.get(props, 'row') === undefined;

  const onSubmit = () => {
    form.validateFields().then(async (value) => {
      setComfirmLoading(true);

      try {
        let ips = _.get(value, 'ips');

        /* 添加和编辑 是 ips 一个为数组一个为字符串，需要转换 */
        _.isArray(ips) ? (ips = _.join(ips, ',')) : ips;

        const iplist = ips.split(/[\n,]/g);

        for (let i = 0; i < iplist.length; i++) {
          if (iplist[i] === '') {
            iplist.splice(i, 1);
            // 删除数组索引位置应保持不变
            i--;
          }
        }

        const values = {
          name: _.get(value, 'name').trim(),
          code: _.get(value, 'code').trim(),
          endpoint: _.get(value, 'endpoint').trim(),
          token: _.get(value, 'token').trim(),
          ips: iplist,
          env: _.get(value, 'env'),
          isUpdate: !isAdd,
        };

        await clusterApi.create(values);

        message.success('集群添加成功');
      } catch (error) {
        notification.error({
          message: '添加失败',
          description: error.message,
        });
      } finally {
        setComfirmLoading(false);
        onClose();
      }
    });
  };
  const onClose = useCallback(() => {
    setVisible(false);
    _.isFunction(props.getCluster) && props.getCluster();
  });

  return (
    <Modal
      okText="确定"
      cancelText="取消"
      onOk={onSubmit}
      confirmLoading={comfirmLoading}
      title={isAdd ? '添加集群' : '编辑集群'}
      visible={visible}
      onCancel={onClose}
      destroyOnClose={true}
    >
      <Form form={form} {...layout}>
        <Form.Item
          label="集群显示名:"
          name="name"
          initialValue={_.get(props, 'row.name')}
          rules={[{required: true, message: '集群显示名不能为空！'}]}
        >
          <Input placeholder="请填写集群显示名" />
        </Form.Item>
        <Form.Item
          label="集群Code:"
          name="code"
          initialValue={_.get(props, 'row.code')}
          rules={[{required: true, message: '集群Code不能为空！'}]}
        >
          <Input placeholder="请填写集群Code，英文字母" disabled={!isAdd} />
        </Form.Item>
        <Form.Item
          label="endpoint:"
          name="endpoint"
          initialValue={_.get(props, 'row.endpoint')}
          rules={[
            {required: true, message: 'endpoint不能为空！'},
            () => ({
              validator(rule, value) {
                if (!value || value.match(httpIpPortRegex) !== null) {
                  return Promise.resolve();
                }

                return Promise.reject('请按照 http(s):IP:端口号 输入');
              },
            }),
          ]}
        >
          <Input placeholder="集群中任意一台机器都可以, 格式: 'http://$ip:9999'" />
        </Form.Item>
        <Form.Item
          label="token:"
          name="token"
          initialValue={_.get(props, 'row.token')}
          rules={[{required: true, message: 'token不能为空！'}]}
        >
          {isAdd ? (
            <Input placeholder="请填写token，来自server.config.admin.token" />
          ) : (
            <Input.Password placeholder="请填写token，来自server.config.admin.token" />
          )}
        </Form.Item>
        <Form.Item
          label="ip 列表:"
          name="ips"
          initialValue={_.get(props, 'row.ips')}
          rules={[
            {required: true, message: 'ip 列表不能为空！'},
            () => ({
              validator(rule, value) {
                if (value) {
                  _.isArray(value) ? (value = _.join(value, ',')) : value;

                  const ips = value.trim().split(/[\n,]/g);
                  const errArr = [];

                  ips.forEach((ip) => {
                    if (ip.match(ipRegex) === null) {
                      errArr.push(ip);
                    }
                  });

                  if (errArr.length === 0) {
                    return Promise.resolve();
                  }

                  return Promise.reject('ip 存在格式错误');
                }

                return Promise.reject();
              },
            }),
          ]}
        >
          <Input.TextArea
            rows={4}
            placeholder="集群机器的ip列表，每行一个或逗号间隔"
          />
        </Form.Item>
        <Form.Item
          label="集群环境"
          name="env"
          initialValue={_.get(props, 'row.env', 'dev')}
        >
          <Select>
            <Select.Option value="dev">开发(dev)</Select.Option>
            <Select.Option value="pre">预发(pre)</Select.Option>
            <Select.Option value="prod">生产(prod)</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

ClusterUpset.propTypes = {
  getCluster: PropTypes.func
};

export default (props) => {
  const div = document.createElement('div');

  ReactDOM.render(<ClusterUpset {...props} />, div);

  document.body.appendChild(div);
};
