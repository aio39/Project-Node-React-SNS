import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSWRInfinite } from 'swr';
import Head from 'next/head';
import { Button, Row, Spin } from 'antd';
import AppLayout from '../components/layouts/AppLayout';
import { backUrl } from '../config/config';
import { generateDummyPosts } from '../util/dummy';
import MainPostCard from '../components/MainPostCard';
import PostWriteButton from '../components/PostWriteButton';

const fetcher = (url) =>
  axios.get(url, { withCredentials: true }).then((result) => {
    console.log('fetcher', result);
    return result.data;
  });
const fakeFecther = (url) =>
  new Promise((resolve) => {
    const data = generateDummyPosts(12);
    setTimeout(() => resolve(data), 2000);
  });
const getKey = (pageIndex, previousPageData) => {
  if (previousPageData && !previousPageData.length) return null; // reached the end
  // return `/posts?lastId=${pageIndex}&limit=12`; // SWR key
  return `http://localhost:3005/posts?lastId=12?index=${pageIndex}`; // SWR key
};

const Home = () => {
  const [postsLoadLimit, setPostsLoadLimit] = useState(12);

  const {
    data: postsDataArray,
    error: postsError,
    size,
    setSize,
  } = useSWRInfinite(
    (pageIndex, previousPageData) => {
      console.log('pageindex:', pageIndex);
      console.log('이전 데이터', previousPageData);
      if (previousPageData && !previousPageData.length) return null; // reached the end
      // return `/posts?lastId=${pageIndex}&limit=12`; // SWR key
      let lastId = null;
      if (previousPageData) {
        lastId = previousPageData[previousPageData.length - 1].id;
      }
      return `http://localhost:3005/posts?${
        lastId ? `lastId=${lastId}?` : ''
      }indx=${pageIndex + 1}`; // SWR key
    },
    fetcher,
    {
      // focusThrottleInterval: 3000,
      // dedupingInterval: 3000,
    },
  );

  const hasMorePosts = true;
  useEffect(() => {
    function onScroll() {
      if (
        window.pageYOffset + document.documentElement.clientHeight >
        document.documentElement.scrollHeight - 100
      ) {
        if (postsDataArray && postsDataArray.length === size) {
          console.log('온 스크롤 동작');
          setSize(size + 1);
        }
      }
    }
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [postsDataArray]);

  const loadMorePosts = () => {
    setSize(size + 1);
  };

  console.log(postsDataArray);
  return (
    <>
      <Head>
        <title>메인 홈</title>
      </Head>
      <PostWriteButton />
      <AppLayout>
        {!postsDataArray ? (
          <Spin size="large" />
        ) : (
          <>
            <Row gutter={8} align="middle">
              {postsDataArray.map((arr) =>
                arr.map((post) => <MainPostCard post={post} />),
              )}
            </Row>
            <Button type="primary" onClick={loadMorePosts}>
              불러오기
            </Button>
          </>
        )}
      </AppLayout>
    </>
  );
};
export default Home;
