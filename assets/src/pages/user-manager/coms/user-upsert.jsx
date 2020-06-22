import React, { useCallback, useState } from 'react';
import _ from 'lodash';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Modal, Form, Input } from 'antd';
import { userApi } from '@api';
import notification from '@coms/notification';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const UserUpsert = (props) => {
  const [form] = Form.useForm();
  const [comfirmLoading, setComfirmLoading] = useState(false);
  const [visible, setVisible] = useState(true);

  const onSubmit = () => {
    form.validateFields().then(async (value) => {
      // TODO: 调用 API，触发用户创建, 回调组件, 刷新用户列表
      const { username, password } = value;
      setComfirmLoading(true);
      try {
        const data = await userApi.createUser({ username, password });
        console.log('data =>', data);

        message.success('用户添加成功');
      } catch (error) {
        notification.error({
          message: '添加失败',
          description: error.message,
        });
      } finally {
        setComfirmLoading(false);
        _.isFunction(props.getUser) && props.getUser();
        onClose();
      }
    });
  };

  const onClose = useCallback(() => {
    setVisible(false);

    _.isFunction(props.onClose) && props.onClose();
  });

  return (
    <Modal
      okText="确定"
      cancelText="取消"
      onOk={onSubmit}
      confirmLoading={comfirmLoading}
      title="新建用户"
      visible={visible}
      onCancel={onClose}
    >
      <Form form={form} {...layout}>
        <Form.Item
          label="用户名"
          name="username"
          rules={[{ required: true, message: '用户名不能为空！' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: '密码不能为空！' }]}
        >
          <Input.Password />
        </Form.Item>
      </Form>
    </Modal>
  );
};

UserUpsert.propTypes = {
  onClose: PropTypes.func,
  getUser: PropTypes.func,
};

// FIXME: 关闭时请将我从父元素中移除
export default (props) => {
  const div = document.createElement('div');

  ReactDOM.render(<UserUpsert {...props} />, div);

  document.body.appendChild(div);
};
