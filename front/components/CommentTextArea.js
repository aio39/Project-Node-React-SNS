import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Form, message, Spin } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import Axios from 'axios';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import useSWR, { mutate } from 'swr';
import { commentValidation } from '../util/validation/yup';
import PostComment from './PostComment';
import fetcher from '../util/fetcher';

const CommentTextArea = ({
  PostId,
  CommentId,
  setRootReplyOn,
  setReplyTurnOn,
}) => {
  const { data: userData } = useSWR('/user', fetcher);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(commentValidation),
    mode: 'onBlur',
  });

  const onSubmit = handleSubmit(async data => {
    if (CommentId) data.superCommentId = CommentId;
    setIsSubmitting(true);
    const result = await Axios.post(`/post/${PostId}/comment`, data);
    if (result.statusText === 'Created') {
      await mutate(`/post/${PostId}`);
      if (setRootReplyOn) setRootReplyOn(false);
      if (setReplyTurnOn) setReplyTurnOn(false);
    } else {
      message.error('덧글 등록에 실패했습니다');
    }
    setIsSubmitting(false);
  });

  return (
    <Spin spinning={isSubmitting}>
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
    </Spin>
  );
};

export default CommentTextArea;
