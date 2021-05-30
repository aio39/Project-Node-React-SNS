import React, { useCallback, useState } from 'react';
import useSWR from 'swr';
import { Col, Divider, Row, Skeleton } from 'antd';
import { useRouter } from 'next/router';
import Paragraph from 'antd/lib/typography/Paragraph';
import styled from 'styled-components';
import Axios from 'axios';
import Title from 'antd/lib/typography/Title';
import AppLayout from '../../components/layouts/AppLayout';
import PostComment from '../../components/PostComment';

const fetcher = async url => {
  const result = await Axios.get(url);
  return result.data;
};

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: auto;
  margin: 1vw 0;
`;

const Post = () => {
  const router = useRouter();
  const { postid } = router.query;

  const { data: postData, errors: postError } = useSWR(
    `/post/${postid}`,
    fetcher,
  );

  console.log(postData);

  if (!postData) {
    return (
      <AppLayout>
        <div>포스터</div>
        <Skeleton />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Row justify="center" align="top">
        <Col style={{ backgroundColor: '##CCCCCC' }} xs={24} md={24} xl={18}>
          {postData.Images?.map(image => (
            <ImageWrapper>
              <img
                src={image.src}
                alt={image.title}
                style={{
                  width: '100%',
                }}
              />
            </ImageWrapper>
          ))}
          <Title>{postData.title}</Title>
          <Paragraph>{postData.content}</Paragraph>
        </Col>
        <Col
          style={{ backgroundColor: '#39c5bb', maxHeight: '100%' }}
          xs={24}
          md={24}
          xl={6}
        >
          <Divider orientation="left">덧글</Divider>
          {postData.Comments.length > 0 ? (
            postData.Comments.map(comment => <PostComment comment={comment} />)
          ) : (
            <>
              <Title level={3}>덧글이 없습니다.</Title>
            </>
          )}
        </Col>
      </Row>
    </AppLayout>
  );
};
export default Post;
