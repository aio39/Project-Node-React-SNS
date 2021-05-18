/* eslint-disable react/prop-types */
import { Card, Col } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import Meta from 'antd/lib/card/Meta';
import Text from 'antd/lib/typography/Text';
import Title from 'antd/lib/typography/Title';
import React from 'react';

const MainPostCard = ({ post }) => {
  const a = 0;
  return (
    <>
      <Col style={{ backgroundColor: '#f39' }} xs={24} md={12} xl={6}>
        <Card
          title="card title"
          hoverable
          style={{ width: '100%' }}
          cover={<img alt={post.title} src={post.Images[0].src} />}
        >
          <Meta
            avatar={<Avatar src={post.User.avatar} />}
            title={<Title level={3}>{post.title}</Title>}
            description={
              <Text>
                {post.content.length > 150
                  ? `${post.content.slice(0, 150)}...`
                  : post.content}
              </Text>
            }
          />
        </Card>
        ,
      </Col>
    </>
  );
};

export default MainPostCard;
