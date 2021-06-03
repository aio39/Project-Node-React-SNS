import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, Divider, Row, Upload } from 'antd';
import Title from 'antd/lib/typography/Title';
import React from 'react';
import useSWR from 'swr';
import AppLayout from '../components/layouts/AppLayout';
import PostWriteButton from '../components/PostWriteButton';
import { generateDummyMyData } from '../util/dummy';
import fetcher from '../util/fetcher';

const fakeFecther = url =>
  new Promise(resolve => {
    const data = generateDummyMyData();
    setTimeout(() => resolve(data), 2000);
  });

const MyPage = () => {
  const { data: userData } = useSWR('/user', fetcher);

  const uploadOnchange = ({ file }) => {
    if (file.status === 'done') {
      console.log('업로드!');
    }
  };
  console.log(userData);
  if (!userData) return null;

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
            >
              <Button icon={<UploadOutlined />}>아바타 업로드</Button>
            </Upload>
          </Col>
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
