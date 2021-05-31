/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable operator-linebreak */
/* eslint-disable react/prop-types */
import { Card, Col, Skeleton, Space } from 'antd';
import React, { memo } from 'react';

const MainPostCardSkeleton = () => (
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
      <>
        <Card
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
              alt="loading"
              src="/not_image.png"
              style={{
                maxHeight: '25vh',
                objectFit: 'cover',
                objectPosition: 'center',
              }}
            />
          }
        >
          <Space direction="vertical">
            <Skeleton avatar paragraph={{ rows: 4 }} />
          </Space>
        </Card>
      </>
    </Col>
  </>
);

export default memo(MainPostCardSkeleton);
