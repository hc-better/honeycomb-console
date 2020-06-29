import React from 'react';
import ReactEcharts from 'echarts-for-react';
import PropTypes from 'prop-types';

import './index.less';

const Ring = (props) => {
  const {total, success} = props;
  const options = {
    series: [
      {
        name: '应用总数',
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: 'center',
          formatter: `${success}/${total}`,
        },
        labelLine: {
          show: false
        },
        data: [
          {value: total, name: 'total'},
          {value: success, name: 'success'},
        ]
      }
    ]
  };

  return (
    <div className="ring-card">
      <ReactEcharts
        option={options}
        style={{height: '120px', width: '120px'}}
      />
      <div>
        <h3>当前集群应用：</h3>
        <p>异常数：{total - success}</p>
        <p>总应用数：{total}</p>
      </div>
    </div>
  );
};

Ring.propTypes = {
  total: PropTypes.number,
  success: PropTypes.number
};

export default Ring;

