import { Avatar, Comment } from 'antd';
import React, { useCallback, useState } from 'react';

import Axios from 'axios';
import CommentTextArea from './CommentTextArea';
import DeleteBtn from './button/PostDeleteBtn';

const PostComment = ({ comment, loginUserId }) => {
  const { User, Reply, PostId, id: CommentId, isDeleted } = comment;
  const [replyTurnOn, setReplyTurnOn] = useState(false);
  const onClickReply = useCallback(() => {
    setReplyTurnOn(!replyTurnOn);
  }, []);
  return (
    <Comment
      actions={[
        <span key="comment-nested-reply-to" onClick={onClickReply}>
          Reply to
        </span>,
      ]}
      author={<a>{User.nickname}</a>}
      avatar={<Avatar src={User.avatar} alt={User.nickname} />}
      content={<p>{comment.content}</p>}
    >
      {User.id === loginUserId && !isDeleted ? (
        <DeleteBtn
          requestObj={{
            target: '덧글',
            kind: 'comment',
            postId: PostId,
            commentId: CommentId,
          }}
        />
      ) : null}
      {replyTurnOn ? (
        <CommentTextArea PostId={PostId} CommentId={CommentId} />
      ) : null}
      {Reply?.map(comment => (
        <PostComment comment={comment} loginUserId={loginUserId} />
      ))}
    </Comment>
  );
};

export default PostComment;
