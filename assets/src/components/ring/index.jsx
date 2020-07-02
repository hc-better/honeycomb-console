import React from 'react';
import PropTypes from 'prop-types';
import {
  Chart,
  Annotation,
  Axis,
  Tooltip,
  Interval,
  Interaction,
  Coordinate,
} from 'bizcharts';

import {PRIMARY_COLOR} from '@lib/color';

import './index.less';

const Ring = (props) => {
  const {total, success} = props;

  const data = [
    {
      type: '正常应用数',
      value: success,
    },
    {
      type: '异常应用数',
      value: total - success,
    }
  ];

  return (
    <div className="ring-card">
      <Chart data={data} height={120} width={120} pure autoFit>
        <Annotation.Text
          position={['50%', '50%']}
          content={`${success}/${total}`}
          style={{
            lineHeight: '240px',
            fontSize: '20',
            fill: 'white',
            textAlign: 'center',
          }}
        />
        <Coordinate
          type="theta"
          radius={0.8}
          innerRadius={0.75}
        />
        <Axis visible={false} />
        <Tooltip showTitle={false} />
        <Interval
          adjust="stack"
          position="value"
          // color="type"
          shape="sliceShape"
          color={['type', [PRIMARY_COLOR, 'rgb(255, 255, 255)']]}
        />
        <Interaction type="element-single-selected" />
      </Chart>
      <div>
        <h3 style={{color: 'white'}}>当前集群应用：</h3>
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

