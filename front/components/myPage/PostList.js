import { List, Avatar } from 'antd';
import axios from 'axios';
import React, { useState } from 'react';
import { useSWRInfinite } from 'swr';

const PostList = ({ path, userId }) => {
  const [showSkeleton, setShowSkeleton] = useState(false);
  const fetcher = url => {
    setShowSkeleton(true);
    return axios.get(url).then(result => {
      console.log('fetcher', result);
      setShowSkeleton(false);
      return result.data;
    });
  };

  const {
    data: postsDataArray,
    error: postsError,
    size,
    setSize,
  } = useSWRInfinite(
    (pageIndex, previousPageData) => {
      if (previousPageData && !previousPageData.length) return null; // reached the end
      let lastId = null;
      if (previousPageData) {
        lastId = previousPageData[previousPageData.length - 1].id;
      }
      if (lastId !== null && lastId < 2) return null;
      return `http://localhost:3005/user/${userId}/${path}?${
        lastId ? `lastId=${lastId}?` : ''
      }`; // SWR key
    },
    fetcher,
    {
      // focusThrottleInterval: 3000,
      // dedupingInterval: 3000,
    },
  );
  if (!postsDataArray) return null;
  return (
    <List
      itemLayout="vertical"
      size="large"
      loading={false}
      dataSource={postsDataArray.flat()}
      renderItem={post => (
        <List.Item
          key={post.id}
          extra={
            <img
              alt="logo"
              src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
            />
          }
        >
          <List.Item.Meta
            avatar={<Avatar src={post.User?.avatar || '/not_avatar.jpg'} />}
            title={<a>{post.title}</a>}
          />
          {post.title}
        </List.Item>
      )}
    />
  );
};

export default PostList;
