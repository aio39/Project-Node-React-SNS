import { Button, Form, Input, message, Upload } from 'antd';
import Title from 'antd/lib/skeleton/Title';
import Head from 'next/head';
import React, { useState } from 'react';
import styled from 'styled-components';
import { Controller, useForm } from 'react-hook-form';
import TextArea from 'antd/lib/input/TextArea';
import Axios from 'axios';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { UploadOutlined } from '@ant-design/icons';
import FormErrorMessage from '../components/FormErrorMessage';
import AppLayout from '../components/layouts/AppLayout';
import fetcher from '../util/fetcher';

const StyledPostForm = styled(Form)`
  > div:not(:first-child) {
    margin-top: 30px; // ID 인풋박스만 제외하고
  }
`;

const WritePage = () => {
  const router = useRouter();

  const { data: userData, error, revalidate } = useSWR('/user', fetcher);
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    mode: 'onBlur',
  });

  const [imageURLArray, setImageURLArray] = useState([]);

  const [isLoadingPost, setIsLoadingPost] = useState(false);
  const [isFailedPost, setIsFailedPost] = useState(false);

  const uploadOnchange = ({ file }) => {
    if (file.status === 'done') {
      setImageURLArray(p => [...p, file.response]);
    }
  };

  const onSubmit = handleSubmit(async data => {
    message.loading({ content: '포스트를 저장중입니다', key: 'A' });
    setIsLoadingPost(true);
    setIsFailedPost(false);
    data.image = imageURLArray;
    const result = await Axios.post('/post', data);
    setIsLoadingPost(false);
    console.log(result);
    if (result.statusText === 'Created') {
      console.log('성공', result);
      message.success({
        content: '포스트 저장 성공! 포스트로 이동합니다.',
        key: 'A',
        duration: 2,
      });

      setTimeout(() => {
        router.push(`/post/${result.data.id}`);
      }, 2000);
    } else {
      console.log('실패', result);
      message.success({
        content: '포스트 저장에 실패했니다. 다시 시도해주세요.',
        key: 'A',
        duration: 2,
      });
      setIsFailedPost(true);
    }
  });

  if (!userData) {
    router.push('/');
  }

  return (
    <AppLayout>
      <Head>
        <title>로그인</title>
      </Head>
      <StyledPostForm onFinish={onSubmit} size="large">
        <div>
          <label htmlFor="title">제목</label>
          <Controller
            name="title"
            type="title"
            control={control}
            placeholder="Title"
            defaultValue=""
            render={({ field }) => <Input {...field} />}
          />
          {errors.title && (
            <FormErrorMessage errorMessage={errors.title.message} />
          )}
        </div>
        <div>
          <Upload
            action="http://localhost:3005/post/1/image"
            listType="picture"
            withCredentials="true"
            name="image"
            accept="image/png, image/jpeg"
            onChange={uploadOnchange}
          >
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </div>
        <div>
          <label htmlFor="content">본문</label>
          <Controller
            render={({ field }) => <TextArea {...field} />}
            type="content"
            name="content"
            control={control}
            placeholder="본문을 입력해주세요."
            defaultValue=""
            autoSize={{ minRows: 10, maxRows: 100 }}
          />
          {errors.content && (
            <FormErrorMessage errorMessage={errors.content.message} />
          )}
        </div>

        <div>
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoadingPost}
            block
          >
            포스팅
          </Button>
        </div>
      </StyledPostForm>
    </AppLayout>
  );
};

export default WritePage;
