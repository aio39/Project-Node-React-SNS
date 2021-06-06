import { FormOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons';
import {
  Affix,
  Avatar,
  Button,
  Col,
  Divider,
  Input,
  message,
  Row,
  Upload,
} from 'antd';
import Text from 'antd/lib/typography/Text';
import Title from 'antd/lib/typography/Title';
import React, { useState } from 'react';
import useSWR from 'swr';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import Form from 'antd/lib/form/Form';
import axios from 'axios';
import styled from 'styled-components';
import AppLayout from '../components/layouts/AppLayout';
import PostWriteButton from '../components/PostWriteButton';
import fetcher from '../util/fetcher';

import { editMyUserDataValidation } from '../util/validation/yup';
import FormErrorMessage from '../components/FormErrorMessage';
import PostList from '../components/myPage/PostList';

const StyledSignUpForm = styled(Form)`
  .ant-col > {
    div:not(:first-child) {
      margin-top: 30px;
    }

    div {
      position: relative;
      padding-bottom: 8px;
    }
  }
`;

function isAnyEditing(obj) {
  return Object.values(obj).includes(true);
}

const notEditing = {
  nickname: false,
  description: false,
  password: false,
};

const MyPage = () => {
  const { data: userData, revalidate, mutate } = useSWR('/user', fetcher);

  const [isLoadingPatch, setIsLoadingPatch] = useState(false);
  const [isFailedPatch, setIsFailedPatch] = useState(false);
  const [arrayOfEditing, setArrayOfEditing] = useState(notEditing);
  const uploadOnchange = ({ file }) => {
    if (file.status === 'done') {
      console.log('업로드!');
      revalidate();
    }
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(editMyUserDataValidation),
    mode: 'onBlur',
  });

  const onSubmit = handleSubmit(async editData => {
    setIsFailedPatch(false);
    setIsLoadingPatch(true);

    try {
      mutate({ ...userData, ...editData }, false);
      await axios.patch('/user', editData);
      revalidate();
      setArrayOfEditing({ ...notEditing });
      message.success('성공적으로 수정되었습니다.');
    } catch (error) {
      message.error('수정에 실패하였습니다. 다시 시도해 주세요.');
      message.error(`${error.response.data}`);
      setIsFailedPatch(true);
    } finally {
      setIsLoadingPatch(false);
    }
  });

  const handleIsEditingChange = e => {
    const { key } = e.currentTarget.dataset;
    setArrayOfEditing(p => ({ ...p, [key]: !p[key] }));
    return null;
  };

  if (!userData) return null;

  return (
    <>
      <AppLayout>
        <Row justify="center">
          <Col>
            <Title>{`${userData.nickname}의 마이페이지`}</Title>
          </Col>
        </Row>

        <Row align="top" justify="center">
          <Col xl={8} sm={24}>
            <Avatar
              size={64}
              src={userData?.avatar || '/not_avatar.jpg'}
              icon={<UserOutlined />}
            />
            <Upload
              name="image"
              withCredentials="true"
              action="http://localhost:3005/user/avatar"
              onChange={uploadOnchange}
              showUploadList={false}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />} />
            </Upload>
          </Col>
          <StyledSignUpForm onFinish={onSubmit} size="large">
            <Col xl={8} sm={24}>
              <div>
                <Controller
                  name="nickname"
                  type="text"
                  control={control}
                  defaultValue={userData.nickname}
                  render={({ field }) => (
                    <Input
                      disabled={!arrayOfEditing.nickname}
                      prefix={
                        <>
                          <Text>이름</Text> <Divider type="vertical" />
                        </>
                      }
                      suffix={
                        <Button
                          shape="circle"
                          onClick={handleIsEditingChange}
                          icon={<FormOutlined />}
                          data-key="nickname"
                        />
                      }
                      {...field}
                    />
                  )}
                />
              </div>
              {errors.nickname && (
                <FormErrorMessage errorMessage={errors.nickname.message} />
              )}
              <div>
                <Controller
                  name="description"
                  control={control}
                  defaultValue={userData.description}
                  render={({ field }) => (
                    <Input
                      disabled={!arrayOfEditing.description}
                      prefix={
                        <>
                          <Text>설명</Text> <Divider type="vertical" />
                        </>
                      }
                      suffix={
                        <Button
                          shape="circle"
                          onClick={handleIsEditingChange}
                          icon={<FormOutlined />}
                          data-key="description"
                        />
                      }
                      {...field}
                    />
                  )}
                />
              </div>
              <div>
                <Controller
                  name="oldPassword"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="password"
                      placeholder="현재 비밀번호를 입력해주세요"
                      disabled={!arrayOfEditing.password}
                      prefix={
                        <Divider>
                          <Text>비밀번호</Text> <Divider type="vertical" />
                        </Divider>
                      }
                      suffix={
                        <Button
                          shape="circle"
                          onClick={handleIsEditingChange}
                          icon={<FormOutlined />}
                          data-key="password"
                        />
                      }
                      {...field}
                    />
                  )}
                />
              </div>
              {arrayOfEditing.password && (
                <>
                  <div>
                    <Controller
                      name="newPassword"
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="password"
                          placeholder="새로운 비밀번호를 입력해주세요."
                          prefix={
                            <>
                              <Text>새 비밀번호</Text>{' '}
                              <Divider type="vertical" />
                            </>
                          }
                          {...field}
                        />
                      )}
                    />
                    {errors.newPassword && (
                      <FormErrorMessage
                        errorMessage={errors.newPassword.message}
                      />
                    )}
                  </div>
                  <div>
                    <Controller
                      name="newPasswordEqual"
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="password"
                          placeholder="새로운 비밀번호를 한번더 입력해주세요."
                          prefix={
                            <>
                              <Text>비밀번호 확인</Text>{' '}
                              <Divider type="vertical" />
                            </>
                          }
                          {...field}
                        />
                      )}
                    />
                    {errors.newPasswordEqual && (
                      <FormErrorMessage
                        errorMessage={errors.newPasswordEqual.message}
                      />
                    )}
                  </div>
                </>
              )}
              {isAnyEditing(arrayOfEditing) ? (
                <Affix
                  target={() => window}
                  style={{
                    position: 'fixed',
                    bottom: '20px',
                    left: 0,
                    right: 0,
                    margin: 'auto',
                    width: '200px',
                  }}
                >
                  <Button
                    block
                    type="primary"
                    htmlType="submit"
                    loading={isLoadingPatch}
                    size="large"
                  >
                    {`${
                      isLoadingPatch
                        ? 'Saving'
                        : isFailedPatch
                        ? 'Retry, '
                        : 'SAVE'
                    }  `}
                  </Button>
                </Affix>
              ) : null}
            </Col>
          </StyledSignUpForm>
        </Row>
        <Row>
          <Col xl={8} md={12} xs={24}>
            <Divider orientation="left">북마크</Divider>
          </Col>

          <Col xl={8} md={12} xs={24}>
            <Divider orientation="left">나의 포스터</Divider>
            <PostList path="posts" userId={userData.id} />
          </Col>

          <Col xl={8} md={12} xs={24}>
            <Divider orientation="left">임시 저장</Divider>
          </Col>
        </Row>
      </AppLayout>
    </>
  );
};
export default MyPage;
