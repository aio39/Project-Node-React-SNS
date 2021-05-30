import { Avatar, Comment } from 'antd';
import { useCallback, useState } from 'react';

import Axios from 'axios';
import CommentTextArea from './CommentTextArea';

const PostComment = ({ comment }) => {
  const { User, sub } = comment;
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
      {replyTurnOn ? <CommentTextArea /> : null}
      {sub ? sub.map(comment => <postComment comment={comment} />) : null}
    </Comment>
  );
};

export default PostComment;