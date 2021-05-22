import { Affix, Button } from 'antd';
import React from 'react';
import Link from 'next/link';
import { EditOutlined } from '@ant-design/icons';

const PostWriteButton = () => (
  <Affix offsetTop={50}>
    <Button
      size="large"
      icon={<EditOutlined />}
      styled={{
        backgroundColor: '#39c5bb',
      }}
    />
  </Affix>
);
export default PostWriteButton;
