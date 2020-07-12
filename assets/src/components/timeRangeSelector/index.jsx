import React, {useState} from 'react';
// import _ from 'lodash';
import {Dropdown, Form, Input, Button, Row, DatePicker} from 'antd';
import moment from 'moment';
// import BannerCard from '@coms/banner-card';
import {recentTimeRange} from './options';
import {translateTimeAliasToCh, getMsFromTimeAlias} from './util';

import './index.less';

const {RangePicker} = DatePicker;

const TimeRangeSelector = () => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);

  const recentTimeOpts = recentTimeRange.map((recentDuration) => ({
    label: `${'最近'} ${translateTimeAliasToCh(recentDuration)}`,
  }));

  // eslint-disable-next-line array-callback-return
  console.log('==>', recentTimeOpts);

  const handleVisibleChange = (flag) => {
    setVisible(flag);
  };

  const handleVisibleFalse = () => {
    setVisible(false);
  };

  const renderRecentOpts = () => {
    return (
      <div className="recentWrapper">
        <div className="timeRange-title">选择时间范围</div>
        <ul>
          {recentTimeOpts.map(({label}, index) => (
            <li key={label} data-value={index}>
              {`${label}`}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  function disabledDate(current) {
    // Can not select days before today and today
    return current && current > moment().endOf('day');
  }

  const renderCustomOpts = () => {
    return (
      <div className="customWrapper">
        <div className="timeRange-title">自定义时间范围</div>
        <Form
          layout={'vertical'}
          form={form}
          initialValues={{rangerPicker: [moment(), moment()]}}
        >
          <Form.Item label="时间范围">
            <RangePicker
              style={{width: '100%'}}
              name="rangerPicker"
              disabledDate={disabledDate}
              showTime={{format: 'HH:mm'}}
              format="YYYY-MM-DD HH:mm"
              placeholder={['开始时间', '结束时间']}
            />
          </Form.Item>
          <Form.Item>
            <Button
              htmlType="button"
              style={{marginRight: '8px'}}
              onClick={handleVisibleFalse}
            >
              取消
            </Button>
            <Button htmlType="submit" type="primary">
              确定
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  };

  const timeRange = () => {
    return (
      <div className="timeRange-dropdown">
        {renderRecentOpts()}
        {renderCustomOpts()}
      </div>
    );
  };

  return (
    <Dropdown
      overlay={timeRange()}
      trigger={['click']}
      visible={visible}
      onVisibleChange={handleVisibleChange}
    >
      <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
        Hover me
      </a>
    </Dropdown>
  );
};

export default TimeRangeSelector;
