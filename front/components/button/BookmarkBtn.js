import React from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import axios from 'axios';

const BookmarkBtn = ({ isBookmarked, postid, userData, count }) => {
  const URL = `/user/${userData.id}/bookmarks/${postid}`;

  const handleClick = async () => {
    if (isBookmarked) {
      await axios.delete(URL);
    } else {
      await axios.patch(URL);
    }
  };

  return (
    <>
      <Button
        onClick={handleClick}
        type="ghost"
        shape="circle"
        icon={<InboxOutlined />}
      />
      {count}
    </>
  );
};

export default BookmarkBtn;
