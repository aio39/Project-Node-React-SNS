import React, { useCallback, useState } from 'react';
import useSWR from 'swr';
import { Button, Col, Divider, Row, Skeleton } from 'antd';
import { useRouter } from 'next/router';
import Paragraph from 'antd/lib/typography/Paragraph';
import styled from 'styled-components';
import Axios from 'axios';
import Title from 'antd/lib/typography/Title';
import Link from 'next/link';
import AppLayout from '../../components/layouts/AppLayout';
import PostComment from '../../components/PostComment';
import CommentTextArea from '../../components/CommentTextArea';
import DeleteBtn from '../../components/button/DeleteBtn';

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
  const URL = `/post/${postid}`;

  const { data: postData, errors: postError } = useSWR(URL, fetcher);
  const { data: userData } = useSWR('/user', fetcher);
  const [replyTurnOn, setReplyTurnOn] = useState(false);
  const onClickReply = useCallback(() => {
    setReplyTurnOn(!replyTurnOn);
  }, []);
  console.log(postData);

  const handleRouterPushUpdate = () => {
    router.push(`/write?isupdate=true&postid=${postid}`);
  };

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
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Title>{postData.title}</Title>
            {userData?.id === postData.UserId && (
              <div>
                <DeleteBtn
                  requestObj={{
                    target: '게시물',
                    kind: 'post',
                    postId: postData.id,
                    goMain: true,
                  }}
                />
                <Button type="primary">
                  <Link href={`/write?isupdate=true&postid=${postid}`}>
                    수정
                  </Link>
                </Button>
              </div>
            )}
          </div>
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
          <Paragraph>{postData.content}</Paragraph>
        </Col>
        <Col style={{ maxHeight: '100%' }} xs={24} md={24} xl={6}>
          <Divider orientation="left">덧글</Divider>
          {postData.Comments.length > 0 ? (
            postData.Comments.map(comment => (
              <PostComment
                key={comment.id}
                comment={comment}
                loginUserId={userData.id}
              />
            ))
          ) : (
            <>
              <Title level={3}>덧글이 없습니다.</Title>
            </>
          )}
          {userData &&
            (replyTurnOn ? (
              <CommentTextArea
                PostId={postid}
                setRootReplyOn={setReplyTurnOn}
              />
            ) : (
              <Button type="primary" onClick={onClickReply} block>
                코멘트 작성
              </Button>
            ))}
        </Col>
      </Row>
    </AppLayout>
  );
};
export default Post;
