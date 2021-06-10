import { Avatar, Comment } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import Axios from 'axios';
import styled from 'styled-components';
import CommentTextArea from './CommentTextArea';
import DeleteBtn from './button/DeleteBtn';

const DeleteBtnWrapper = styled('div')`
  position: absolute;
  top: 20px;
  right: 10px;
  color: red;
`;

const PostComment = ({ comment, loginUserId }) => {
  const { User, Reply, PostId, id: CommentId, isDeleted } = comment;
  const [replyTurnOn, setReplyTurnOn] = useState(false);
  const onClickReply = useCallback(() => {
    setReplyTurnOn(!replyTurnOn);
  }, []);

  const requestObj = useMemo(
    () => ({
      target: '덧글',
      kind: 'comment',
      postId: PostId,
      commentId: CommentId,
    }),
    [PostId, CommentId],
  );

  return (
    <Comment
      actions={[
        loginUserId ? (
          <span key="comment-nested-reply-to" onClick={onClickReply}>
            Reply to
          </span>
        ) : null,
      ]}
      author={<a>{User.nickname}</a>}
      avatar={<Avatar src={User.avatar} alt={User.nickname} />}
      content={<p>{comment.content}</p>}
    >
      {User.id === loginUserId && !isDeleted ? (
        <DeleteBtnWrapper>
          <DeleteBtn requestObj={requestObj} />
        </DeleteBtnWrapper>
      ) : null}
      {replyTurnOn ? (
        <CommentTextArea PostId={PostId} CommentId={CommentId} />
      ) : null}
      {Reply?.map(comment => (
        <PostComment
          key={comment.id}
          comment={comment}
          loginUserId={loginUserId}
        />
      ))}
    </Comment>
  );
};

export default PostComment;
