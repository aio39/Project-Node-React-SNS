import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSWRInfinite } from 'swr';
import Head from 'next/head';
import { Row, Spin } from 'antd';
import AppLayout from '../components/layouts/AppLayout';
import { backUrl } from '../config/config';
import { generateDummyPosts } from '../util/dummy';
import MainPostCard from '../components/MainPostCard';
import PostWriteButton from '../components/PostWriteButton';

// const fetcher = (url) => axios.get(url, { withCredentials: true }).then((result) => result.data);
// const fakeFecther = (url) => Promise.resolve(generateDummyPosts(12));
const fakeFecther = (url) =>
  new Promise((resolve) => {
    const data = generateDummyPosts(12);
    setTimeout(() => resolve(data), 2000);
  });
const getKey = (pageIndex, previousPageData) => {
  if (previousPageData && !previousPageData.length) return null; // reached the end
  return `/posts?page=${pageIndex}&limit=12`; // SWR key
};

const Home = () => {
  const [postsLoadLimit, setPostsLoadLimit] = useState(10);

  const {
    data: postsDataArray,
    error: postsError,
    size,
    setSize,
  } = useSWRInfinite(getKey, fakeFecther);

  const hasMorePosts = true;
  useEffect(() => {
    function onScroll() {
      if (
        window.pageYOffset + document.documentElement.clientHeight >
        document.documentElement.scrollHeight - 100
      ) {
        if (postsDataArray && postsDataArray.length === size) {
          setSize(size + 1);
        }
      }
    }
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [postsDataArray]);

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
          <Row gutter={8} align="middle">
            {postsDataArray.map((arr) =>
              arr.map((post) => <MainPostCard post={post} />),
            )}
          </Row>
        )}
      </AppLayout>
    </>
  );
};
export default Home;
