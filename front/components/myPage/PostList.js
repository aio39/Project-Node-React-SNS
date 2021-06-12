import { List, Avatar } from 'antd';
import Text from 'antd/lib/typography/Text';
import Title from 'antd/lib/typography/Title';
import axios from 'axios';
import Link from 'next/link';
import React, { useState } from 'react';
import { useSWRInfinite } from 'swr';
import useMediaQuery from 'use-media-antd-query';

const PostList = ({ path, userId, linkToWrite }) => {
  const [showSkeleton, setShowSkeleton] = useState(false);
  const colSize = useMediaQuery();
  const fetcher = url => {
    setShowSkeleton(true);
    return axios.get(url).then(result => {
      console.log('fetcher', result);
      setShowSkeleton(false);
      return result.data;
    });
  };

  const imageSize = colSize => {
    switch (colSize) {
      case 'xxl':
      case 'xl':
        return { width: '180px', height: '120px' };
      case 'lg':
      case 'md':
      case 'sm':
        return { width: '120px', height: '80px' };
      case 'xs':
      default:
        return { width: '120px', height: '80px' };
    }
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
      return `/user/${userId}/${path}?${lastId ? `lastId=${lastId}?` : ''}`; // SWR key
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
        <Link
          href={
            linkToWrite
              ? `/write?isupdate=true&postid=${post.id}`
              : `/post/${post.id}/`
          }
        >
          <List.Item
            style={{
              display: 'flex',
              flexDirection: 'row-reverse',
              marginBottom: '10px',
              padding: '0px',
            }}
            key={post.id}
            extra={
              <img
                style={{ ...imageSize(colSize), margin: '0px 15px 0px 0px' }}
                alt="logo"
                src={
                  post.Images.length > 0 ? post.Images[0].src : '/not_image.png'
                }
              />
            }
          >
            <List.Item.Meta
              style={{
                overflow: 'hidden',
              }}
              avatar={<Avatar src={post.User?.avatar || '/not_avatar.jpg'} />}
              title={<Text>{post.User.nickname}</Text>}
            />
            <Title level={3}>{post.title}</Title>
          </List.Item>
        </Link>
      )}
    />
  );
};

export default PostList;
