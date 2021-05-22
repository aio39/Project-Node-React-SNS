import { Button, Form } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import React from 'react';

const CommentTextArea = () => (
  <>
    <Form.Item>
      <TextArea rows={4} />
    </Form.Item>
    <Form.Item>
      <Button htmlType="submit" type="primary">
        Add Comment
      </Button>
    </Form.Item>
  </>
);

export default CommentTextArea;
