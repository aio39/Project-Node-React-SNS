import React from 'react';
import useSWR from 'swr';
import { Col, Comment, Divider, Row, Skeleton } from 'antd';
import { useRouter } from 'next/router';
import Title from 'antd/lib/typography/Title';
import Paragraph from 'antd/lib/typography/Paragraph';
import Image from 'next/image';
import styled from 'styled-components';
import Avatar from 'antd/lib/avatar/avatar';
import AppLayout from '../../components/layouts/AppLayout';
import { generateDummyPost } from '../../util/dummy';

const ExampleComment = ({ comment }) => {
  const { User, sub } = comment;
  return (
    <Comment
      actions={[<span key="comment-nested-reply-to">Reply to</span>]}
      author={<a>{User.nickname}</a>}
      avatar={<Avatar src={User.avatar} alt={User.nickname} />}
      content={<p>{comment.content}</p>}
    >
      {sub ? sub.map((comment) => <ExampleComment comment={comment} />) : null}
    </Comment>
  );
};

const fetcher = (url) =>
  new Promise((resolve) =>
    setTimeout(() => resolve(generateDummyPost()), 1000),
  );

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
    {
      dedupingInterval: 10000,
    },
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
          <div>{postData.id}</div>
          <div>로딩완료</div>
          <div>{postid}</div>
          {postData.Images?.map((image) => (
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
          {postData.Comments.map((comment) => (
            <ExampleComment comment={comment} />
          ))}
        </Col>
      </Row>
    </AppLayout>
  );
};
export default Post;
