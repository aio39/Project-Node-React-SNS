import { UserOutlined } from '@ant-design/icons';
import { Avatar, Divider } from 'antd';
import React from 'react';
import useSWR from 'swr';
import AppLayout from '../components/layouts/AppLayout';
import PostWriteButton from '../components/PostWriteButton';
import { generateDummyMyData } from '../util/dummy';

const fakeFecther = (url) =>
  new Promise((resolve) => {
    const data = generateDummyMyData();
    setTimeout(() => resolve(data), 2000);
  });

const MyPage = () => {
  const { data: UserData, isValidating } = useSWR('key', fakeFecther);

  console.log(UserData);
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
        <div>마이 페이지</div>
        <Avatar size={64} src={UserData.avatar} icon={<UserOutlined />} />

        <Divider orientation="left">북마크</Divider>
        <Divider orientation="left">나의 포스터</Divider>
        <Divider orientation="left">임시 저장</Divider>
      </AppLayout>
    </>
  );
};
export default MyPage;
