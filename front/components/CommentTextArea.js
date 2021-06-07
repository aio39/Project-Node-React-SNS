import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Form } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import Axios from 'axios';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { mutate } from 'swr';

import { commentValidation } from '../util/validation/yup';
import PostComment from './PostComment';

const CommentTextArea = ({ PostId, CommentId, setRootReplyOn }) => {
  const [comment, setComment] = useState(null);
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(commentValidation),
    mode: 'onBlur',
  });
  console.log(errors);

  const onSubmit = handleSubmit(async data => {
    console.log(errors);
    if (CommentId) data.superCommentId = CommentId;
    console.log(CommentId);
    console.log(data);
    const result = await Axios.post(`/post/${PostId}/comment`, data);
    console.log('axios 결과', result);
    if (result.statusText === 'Created') setComment(result.data);
    if (setRootReplyOn) {
      setRootReplyOn(p => !p);
      mutate(`/post/${PostId}`);
    }
  });

  if (comment) return <PostComment key={comment.id} comment={comment} />;

  return (
    <Form onFinish={onSubmit}>
      <Form.Item>
        <Controller
          name="content"
          type="text"
          control={control}
          defaultValue=""
          rows={4}
          render={({ field }) => <TextArea {...field} />}
        />
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit" type="primary">
          Add Comment
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CommentTextArea;
