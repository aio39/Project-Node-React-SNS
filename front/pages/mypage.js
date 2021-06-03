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
function isAnyEditing(obj) {
  return Object.values(obj).includes(true);
}

const notEditing = {
  nickname: false,
  description: false,
  password: false,
};

const MyPage = () => {
  const { data: userData, revalidate } = useSWR('/user', fetcher);

  const [isLoadingPatch, setIsLoadingPatch] = useState(false);
  const [isFailedPatch, setIsFailedPatch] = useState(false);
  const [arrayOfEditing, setArrayOfEditing] = useState(notEditing);

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
    setIsFailedPatch(false);
    setIsLoadingPatch(true);
    const result = await axios.patch('/user', data);
    setIsLoadingPatch(false);
    console.log(result);
    if (result.statusText === 'Created') {
      console.log('성공', result);
      const res = await revalidate();
      console.log(res);
      setArrayOfEditing({ ...notEditing });
    } else {
      console.log('실패', result);
      setIsFailedPatch(true);
    }
  });

  const handleNameChange = e => {
    console.log(e);
    setArrayOfEditing(p => ({ ...p, nickname: !p.nickname }));
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
                    disabled={!arrayOfEditing.nickname}
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

              {isAnyEditing(arrayOfEditing) ? (
                <Affix
                  target={() => window}
                  style={{ position: 'fixed', bottom: '10px' }}
                >
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isLoadingPatch}
                  >
                    {`${
                      isLoadingPatch
                        ? 'Saving'
                        : isFailedPatch
                        ? '실패'
                        : 'save'
                    }  `}
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
