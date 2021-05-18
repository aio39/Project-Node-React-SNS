import React, { useState } from 'react';
import axios from 'axios';
import useSWR from 'swr';
import Head from 'next/head';
import { Col, Row } from 'antd';
import AppLayout from '../components/layouts/AppLayout';
import { backUrl } from '../config/config';
import { generateDummyPost } from '../util/dummy';
import MainPostCard from '../components/MainPostCard';

// const fetcher = (url) => axios.get(url, { withCredentials: true }).then((result) => result.data);
const fakeFecther = (url) => Promise.resolve(generateDummyPost(10));

const Home = () => {
  const [postsLoadLimit, setPostsLoadLimit] = useState(10);

  const { data: postsData, error: postsError } = useSWR(
    `${backUrl}/user/followers?limit=${postsLoadLimit}`,
    fakeFecther,
  );

  if (!postsData) {
    return <div>로딩중</div>;
  }
  console.log(postsData[0]);

  return (
    <>
      <Head>
        <title>메인 홈</title>
      </Head>
      <AppLayout>
        <Row gutter={8} align="middle">
          {postsData.map((post) => (
            <MainPostCard post={post} />
          ))}
        </Row>
      </AppLayout>
    </>
  );
};
export default Home;
