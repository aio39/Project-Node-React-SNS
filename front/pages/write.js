import { Button, Form, Input, List, message, Upload } from 'antd';
import Title from 'antd/lib/skeleton/Title';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Controller, useForm } from 'react-hook-form';
import TextArea from 'antd/lib/input/TextArea';
import Axios from 'axios';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import Avatar from 'antd/lib/avatar/avatar';
import FormErrorMessage from '../components/FormErrorMessage';
import AppLayout from '../components/layouts/AppLayout';
import fetcher from '../util/fetcher';

const StyledPostForm = styled(Form)`
  > div:not(:first-child) {
    margin-top: 30px;
  }
`;

const WritePage = () => {
  const router = useRouter();
  const { isupdate, postid } = router.query;
  const isUpdate = isupdate === 'true';
  const {
    data: userData,
    error: userError,
    revalidate: userRevalidate,
  } = useSWR('/user', fetcher);
  const {
    data: postData,
    error: postError,
    revalidate: postRevalidate,
  } = useSWR(isUpdate ? `/post/${router.query.postid}` : null, fetcher, {
    revalidateOnFocus: false,
    revalidateOnMount: true,
    revalidateOnReconnect: false,
    onSuccess: postData => {
      console.log('swr 성공', postData);
      setBeforeImageURLArray([
        ...postData.Images.map(image => ({
          src: image.src,
          id: image.id,
        })),
      ]);
    },
  });
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    mode: 'onBlur',
  });
  const [imageURLArray, setImageURLArray] = useState([]);
  const [beforeImageURLArray, setBeforeImageURLArray] = useState([]);

  const [isLoadingPost, setIsLoadingPost] = useState(false);
  const [isFailedPost, setIsFailedPost] = useState(false);
  const [deletedImagesId, setDeletedImagesId] = useState([]);
  const uploadOnchange = ({ file }) => {
    if (file.status === 'done') {
      setImageURLArray(p => [...p, file.response]);
    }
  };

  let isTemp = false;
  const onSubmit = handleSubmit(async (data, e) => {
    console.log('e', e);
    message.loading({ content: '포스트를 저장중입니다', key: 'A' });
    setIsLoadingPost(true);
    setIsFailedPost(false);
    data.isTemp = isTemp;
    data.image = imageURLArray;
    data.deletedImagesId = deletedImagesId;
    try {
      let result;
      if (isUpdate) {
        result = await Axios.patch(`/post/${postid}`, data);
      } else {
        result = await Axios.post('/post', data);
      }
      setIsLoadingPost(false);
      message.success({
        content: '포스트 저장 성공! 포스트로 이동합니다.',
        key: 'A',
        duration: 2,
      });
      setTimeout(() => {
        router.push(`/post/${result.data.id}`);
      }, 2000);
    } catch (error) {
      console.log('실패', error);
      message.success({
        content: '포스트 저장에 실패했습니다. 다시 시도해주세요.',
        key: 'A',
        duration: 2,
      });
      setIsFailedPost(true);
    }
  });

  useEffect(() => {
    postRevalidate();
  }, []);

  console.log(beforeImageURLArray);

  const onClickSaveTemp = e => {
    console.log('save temp');
    isTemp = true;
  };

  const handleDeleteImage = e => {
    console.log(e.currentTarget);
    console.log(e.currentTarget.dataset.index);
    console.log(e.target);
    setBeforeImageURLArray(p => [
      ...p.filter((image, index) => {
        if (index != e.currentTarget.dataset.index) return true;
        setDeletedImagesId(p => [...p, image.id]);
        return false;
      }),
    ]);
  };

  if (!userData || userError || postError) {
    return null;
  }

  if (isUpdate && !postData) {
    return null;
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
            defaultValue={postData?.title}
            render={({ field }) => <Input {...field} />}
          />
          {errors.title && (
            <FormErrorMessage errorMessage={errors.title.message} />
          )}
        </div>
        <div>
          {beforeImageURLArray.length > 0 && (
            <List
              itemLayout="horizontal"
              dataSource={beforeImageURLArray}
              renderItem={(image, index) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={image.src} />}
                    title={image.src.substr(
                      image.src.indexOf('original/') + 'original/'.length,
                    )}
                  />
                  <DeleteOutlined
                    data-index={index}
                    onClick={handleDeleteImage}
                  />
                </List.Item>
              )}
            />
          )}
        </div>
        <div>
          <Upload
            action={`${
              process.env.NODE_ENV === 'production'
                ? process.env.PROD_HOST
                : process.env.DEV_HOST
            }/post/${postid}/image`}
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
            defaultValue={postData?.content}
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
          {postData?.isTemp === false || (
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoadingPost}
              block
              onClick={onClickSaveTemp}
            >
              임시저장
            </Button>
          )}
        </div>
      </StyledPostForm>
    </AppLayout>
  );
};

export default WritePage;
