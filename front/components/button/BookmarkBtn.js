import React, { memo, useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import axios from 'axios';

const BookmarkBtn = ({ isBookmarked, postid, userData, count }) => {
  const URL = `/user/${userData.id}/bookmarks/${postid}`;
  const [isBooked, setIsBooked] = useState(isBookmarked);
  const [bookCount, setBookCount] = useState(count);
  console.log(isBookmarked);

  const handleClick = async () => {
    try {
      setIsBooked(p => !p);
      if (isBooked) {
        setBookCount(p => p - 1);
        await axios.delete(URL);
      } else {
        setBookCount(p => p + 1);
        await axios.patch(URL);
      }
    } catch (error) {
      console.log(error);
      setIsBooked(p => !p);
      if (isBooked) {
        setBookCount(p => p + 1);
      } else {
        setBookCount(p => p - 1);
      }

      message.error('북마크 저장에 실패했습니다.');
    }
  };

  return (
    <>
      <Button
        onClick={handleClick}
        type={isBooked ? 'primary' : 'ghost'}
        shape="circle"
        icon={<InboxOutlined />}
        size="large"
      />
      {bookCount}
    </>
  );
};

export default BookmarkBtn;
