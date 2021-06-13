/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable operator-linebreak */
/* eslint-disable react/prop-types */
import { Card, Col, Divider, Space, Tag } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import Meta from 'antd/lib/card/Meta';
import Text from 'antd/lib/typography/Text';
import Title from 'antd/lib/typography/Title';
import React, { memo } from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import { randomColorSel } from '../util/randomColor';

const MainPostCard = ({ post }) => (
  <>
    <Col
      style={{
        alignSelf: 'stretch',
        alignItems: 'stretch',
        marginBottom: '1vh',
      }}
      xs={24}
      md={12}
      xl={6}
    >
      <Link href={`/post/${post.id}`}>
        <Card
          title={<Title level={3}>{`${post.title}`}</Title>}
          hoverable
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            boxShadow: 'rgba(0, 0, 0, 0.14) 0px 4px 16px 0px',
          }}
          cover={
            <img
              alt={post.title}
              src={post.Images[0]?.src || '/not_image.png'}
              style={{
                maxHeight: '25vh',
                objectFit: 'cover',
                objectPosition: 'center',
              }}
            />
          }
        >
          <Meta
            avatar={<Avatar src={post.User.avatar || '/not_avatar.jpg'} />}
            title={<Title level={3}>{post.User.nickname}</Title>}
          />
          <Space direction="vertical">
            <Text>
              {post.content.length > 150
                ? `${post.content.slice(0, 150)}...`
                : post.content}
            </Text>
            <Text type="secondary">
              {dayjs(post.createAt).format('YYYY/MM/DD')}
            </Text>
          </Space>
          {post.Hashtags.length > 0 && (
            <>
              <Divider orientation="left">Tags</Divider>
              {post.Hashtags.map(tag => (
                <Link key={tag.name} href={`/?tag=${tag.name}`}>
                  <Tag style={{ weight: 600 }} color={randomColorSel()}>
                    {' '}
                    {tag.name}
                  </Tag>
                </Link>
              ))}
            </>
          )}
        </Card>
      </Link>
    </Col>
  </>
);

export default memo(MainPostCard);
