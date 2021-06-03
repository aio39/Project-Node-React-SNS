import { FormOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons';
import { Affix, Avatar, Button, Col, Divider, Input, Row, Upload } from 'antd';
import Text from 'antd/lib/typography/Text';
import Title from 'antd/lib/typography/Title';
import React, { useState } from 'react';
import useSWR from 'swr';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import Form from 'antd/lib/form/Form';
import axios from 'axios';
import AppLayout from '../components/layouts/AppLayout';
import PostWriteButton from '../components/PostWriteButton';
import { generateDummyMyData } from '../util/dummy';
import fetcher from '../util/fetcher';

import { loginValidation } from '../util/validation/yup';

const fakeFecther = url =>
  new Promise(resolve => {
    const data = generateDummyMyData();
    setTimeout(() => resolve(data), 2000);
  });

const MyPage = () => {
  const { data: userData, revalidate } = useSWR('/user', fetcher);

  const [isLoadingPostSingUp, setIsLoadingPatch] = useState(false);
  const [isFailedPost, setIsFailedPatch] = useState(false);

  const uploadOnchange = ({ file }) => {
    if (file.status === 'done') {
      console.log('업로드!');
      revalidate();
    }
  };
  console.log(userData);
  if (!userData) return null;

  const {
    control,
    // formState: { errors },
    handleSubmit,
  } = useForm({
    // resolver: yupResolver(loginValidation),
    mode: 'onBlur',
  });

  const onSubmit = handleSubmit(async data => {
    console.log(data);
    // console.log(errors);
    setIsLoadingPatch(true);
    setIsFailedPatch(false);
    const result = await axios.patch('/user', data);
    setIsLoadingPatch(false);
    console.log(result);
    if (result.statusText === 'OK') {
      console.log('성공', result);
      const res = await revalidate();
      console.log(res);
    } else {
      console.log('실패', result);
      setIsFailedPatch(true);
    }
  });

  const [isEditingName, setIsEditingName] = useState(false);

  const handleNameChange = () => {
    setIsEditingName(p => !p);
    return null;
  };

  return (
    <>
      <PostWriteButton
        styled={{
          backgroundColor: '#39c5bb',
          position: 'absolute',
          left: '5vw',
          bottom: '5vh',
        }}
      />
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
          <Form onFinish={onSubmit} size="large">
            <Col xl={8} sm={24}>
              <Controller
                name="nickname"
                type="text"
                control={control}
                defaultValue={userData.nickname}
                render={({ field }) => (
                  <Input
                    disabled={!isEditingName}
                    prefix={
                      <>
                        <Text>이름</Text> <Divider type="vertical" />
                      </>
                    }
                    suffix={
                      <Button
                        shape="circle"
                        onClick={handleNameChange}
                        icon={<FormOutlined />}
                      />
                    }
                    {...field}
                  />
                )}
              />

              {isEditingName ? (
                <Affix
                  target={() => window}
                  style={{ position: 'fixed', bottom: '10px' }}
                >
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isLoadingPostSingUp}
                  >
                    SAVE
                  </Button>
                </Affix>
              ) : null}
            </Col>
          </Form>
        </Row>
        <Row>
          <Col>
            <Divider orientation="left">북마크</Divider>
          </Col>
        </Row>
        <Row>
          <Col>
            <Divider orientation="left">나의 포스터</Divider>
          </Col>
        </Row>
        <Row>
          <Divider orientation="left">임시 저장</Divider>
        </Row>
      </AppLayout>
    </>
  );
};
export default MyPage;
