import React from 'react';
import { Col, Row } from 'antd';

const ResponsiveLayout = ({ children }) => (
  <>
    <Row justify="center">
      <Col lg={12} md={18} xs={24}>
        {children}
      </Col>
    </Row>
  </>
);

export default ResponsiveLayout;
