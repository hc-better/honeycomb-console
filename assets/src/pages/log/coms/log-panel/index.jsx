import React, {useEffect, useState, useCallback} from 'react';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {CopyOutlined, CloudDownloadOutlined, InfoCircleOutlined} from '@ant-design/icons';
import {
  DatePicker, Select, InputNumber,
  Input, Tooltip, TimePicker, Button, Spin,
  Empty, Switch, message
} from 'antd';
import api from '@api/index';
import msgParser from '@lib/msg-parser';
import {downloadText} from 'download.js';
import WhiteSpace from '@coms/white-space';
import notification from '@coms/notification';

const DEFAULT_MAX_LINE = 200;

const defaultFilter = {
  line: DEFAULT_MAX_LINE,
  day: moment().format('YYYY-MM-DD'),
  time: null,
  keyword: null,
  ips: []
};

const timeFormat = 'HH:mm:ss';
const dayFormat = 'YYYY-MM-DD';

/**
 * 模板文件解析到实际日期
 * @param {String} templateFileName 模板文件名 sys.{year}-{month}-{day}.log
 * @param {Moment} time 时间
 */
const getLogFileName = (templateFileName, time) => {
  let filename = templateFileName;
  const now = moment(time).format('YYYY-MM-DD').split('-');

  ['year', 'month', 'day'].forEach((key, ind) => {
    filename = filename.replace(`{${key}}`, now[ind]);
  });

  return filename;
};

const getLogLevel = (log) => {
  const m = log.match(/^\d+-\d+:\d+:\d+\.\d+ (\w+)/);

  return m;
};

const LogPanel = (props) => {
  const {logFileName, clusterCode} = props;

  const [filter, setFilter] = useState(defaultFilter);
  const [logs, setLog] = useState({success: [], error: []});
  const [loading, setLoading] = useState(false);
  const [streamMode, setStreamMode] = useState(false);

  const day = moment(filter.day, dayFormat);
  const time = filter.time ? moment(filter.time, timeFormat) : null;

  const filename = getLogFileName(logFileName, day);

  // 获取日志详情
  const getLogDetail = useCallback(async (filter) => {
    try {
      const {day, time, ips, line, keyword} = filter;

      setLoading(true);

      const result = await api.logApi.getLogDetail({
        fileName: getLogFileName(logFileName, moment(day, dayFormat)),
        clusterCode,
        startTime: time,
        ips,
        lines: line,
        filter: keyword
      });

      setLog(result);
    } catch (e) {
      notification.error({
        message: '获取日志失败',
        description: msgParser(e.message)
      });
    } finally {
      setLoading(false);
    }
  }, [clusterCode, logFileName]);

  useEffect(() => {
    setFilter(defaultFilter);
    getLogDetail(defaultFilter);
  }, [logFileName, clusterCode]);

  /**
   * 设置filter的值
   * @param {String} key 属性名
   * @param {Boolean} autoSearch 是否自动搜索
   */
  const setFilterKey = (key) => {
    return (v) => {
      if (key === 'day') {
        v = v ? v.format(dayFormat) : v;
      }

      if (key === 'time') {
        v = v ? v.format(timeFormat) : v;
      }

      filter[key] = v;
      setFilter(_.clone(filter));
    };
  };

  const onCallSearch = () => {
    getLogDetail(filter);
  };

  const onSetStreamMode = (value) => {
    setStreamMode(value);
  };

  const getLogString = () => {
    if (!logs) {
      return '';
    }

    return logs.success.join('\n');
  };

  const onDownload = () => {
    downloadText(`${filename}.log`, getLogString());
  };

  return (
    <div>
      <div className="log-filter">
        <div>
          <span className="log-filename">日志文件: {filename}</span>
          <WhiteSpace />
          <WhiteSpace />
          <span>
            持续刷新
            <Tooltip title={`持续刷新时将持续读取日志最后的${filter.line}行信息`}>
              <InfoCircleOutlined />：
            </Tooltip>
          </span>
          <Switch
            size="small"
            checked={streamMode}
            onChange={onSetStreamMode}
          />
        </div>
        <div className="log-filter-box">
          <DatePicker
            placeholder="开始日期"
            value={day}
            onChange={setFilterKey('day')}
          />
          <TimePicker
            placeholder="开始时间"
            value={time}
            format={timeFormat}
            onChange={setFilterKey('time')}
          />
          <Select
            style={{width: 200}}
            mode="multiple"
            placeholder="机器选择"
            onChange={setFilterKey('ips')}
            value={filter.ips}
          >
            {
              ['127.0.0.1'].map(ip => {
                return (
                  <Select.Option key={ip} value={ip}>
                    {ip}
                  </Select.Option>
                );
              })
            }
          </Select>
          <InputNumber
            placeholder="最大行数"
            value={filter.line}
            onChange={setFilterKey('line')}
            onPressEnter={onCallSearch}
          />
          <Input.Search
            style={{width: 200}}
            placeholder="关键词"
            onChange={setFilterKey('keyword')}
            onPressEnter={onCallSearch}
          />
          <Button
            type="primary"
            onClick={onCallSearch}
            loading={loading}
          >
            搜索
          </Button>
        </div>
      </div>
      <div className="log-box-op">
        <div className="left">
          <Tooltip title="复制">
            <CopyToClipboard
              text={getLogString()}
              onCopy={() => message.success(`复制成功！共${getLogString().length}个字符`)}
            >
              <CopyOutlined />
            </CopyToClipboard>
          </Tooltip>
          <Tooltip title="下载">
            <CloudDownloadOutlined onClick={onDownload} />
          </Tooltip>
        </div>
      </div>
      <div className="log-box">
        <Spin spinning={loading}>
          <code>
            {
              !logs.success.length && <Empty description="无日志数据" />
            }
            {
              logs.success.map((log, ind) => {
                const level = getLogLevel(log);

                return (
                  <pre className={`log-code log-${_.lowerCase(level)}`} key={ind}>
                    {log}
                  </pre>
                );
              })
            }
          </code>
        </Spin>
      </div>
    </div>
  );
};

LogPanel.propTypes = {
  logFileName: PropTypes.string,
  clusterCode: PropTypes.string
};

export default LogPanel;

