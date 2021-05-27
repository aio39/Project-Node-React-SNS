/* eslint-disable react/prop-types */
import { Card, Col, Divider, Tag } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import Meta from 'antd/lib/card/Meta';
import Text from 'antd/lib/typography/Text';
import Title from 'antd/lib/typography/Title';
import React from 'react';
import Link from 'next/link';

const MainPostCard = ({ post }) => (
  <>
    <Col style={{ backgroundColor: '#f39' }} xs={24} md={12} xl={6}>
      <Link href={`/post/${post.id}`}>
        <Card
          title={`${post.title}`}
          hoverable
          style={{ width: '100%' }}
          cover={
            <img
              alt={post.title}
              src={
                post.Images[0]?.src ||
                'https://source.unsplash.com/user/avatar/100x100'
              }
            />
          }
        >
          <Meta
            avatar={
              <Avatar
                src={
                  post.User.avatar ||
                  'https://source.unsplash.com/user/avatar/100x100'
                }
              />
            }
            title={<Title level={3}>{post.title}</Title>}
            description={
              <Text>
                {post.content.length > 150
                  ? `${post.content.slice(0, 150)}...`
                  : post.content}
              </Text>
            }
          />
          <Divider orientation="left">Tags</Divider>
          {post.Hashtags.map((tag) => (
            <Link href={`/tag/${tag.name}`}>
              <Tag> {tag.name}</Tag>
            </Link>
          ))}
        </Card>
      </Link>
    </Col>
  </>
);

export default MainPostCard;
