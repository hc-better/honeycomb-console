import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import MonacoEditor, {MonacoDiffEditor} from 'react-monaco-editor';
import {Button} from 'antd';

const Editor = ({appId}) => {
  const [editStatus, setEditStatus] = useState(false);
  const [diffStatus, setDiffStatus] = useState(false);
  const [code, setCurrentCode] = useState('const a = "Hello Monaco"');
  const [original, setOriginal] = useState('const a = "Hello World"');

  useEffect(() => {
    // TODO 获取当前APP配置
    return () => {
      setOriginal('const a = "Hello useEffect code"');
    };
  }, [appId]);

  return (
    <div className="editor-wrap">
      <div className="editor-wrap-code">
        {diffStatus ? (
          <MonacoDiffEditor
            value={code}
            original={original}
          />
        ) : (
          <MonacoEditor
            value={code}
            onChange={(value) => {
              setCurrentCode(value);
            }}
          />
        )}
      </div>
      <div>
        {editStatus ? (
          <Button onClick={() => setEditStatus(true)}>
          保存并发布
          </Button>
        ) : null}
        <Button onClick={() => setEditStatus(true)}>
          {editStatus ? '保存配置' : '编辑配置'}
        </Button>
        <Button onClick={() => setDiffStatus(true)}>配置对比</Button>
      </div>
    </div>
  );
};

Editor.propTypes = {
  appId: PropTypes.string
};
export default Editor;
