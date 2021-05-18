import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Layout, Menu } from 'antd';

import { HomeOutlined, UserOutlined, SubnodeOutlined } from '@ant-design/icons';

const { Header, Content, Footer } = Layout;

const siteLayout = {
  backgroundColor: '#fff',
  minHeight: '280px',
  padding: '24px',
  margin: '30px 0px',
};

const AppLayout = ({ children }) => {
  const router = useRouter();
  const current = router.pathname === '/' ? 'home' : router.pathname.slice(1);

  return (
    <>
      <Layout>
        <Header className="header">
          <div className="logo" />
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[current]}>
            <Menu.Item key="home" icon={<HomeOutlined />}>
              <Link href="/">
                <a>메인</a>
              </Link>
            </Menu.Item>
            <Menu.Item key="mypage" icon={<UserOutlined />}>
              <Link href="/mypage">
                <a>내정보 </a>
              </Link>
            </Menu.Item>
            <Menu.Item key="signup" icon={<SubnodeOutlined />}>
              <Link href="/signup">
                <a>회원가입</a>
              </Link>
            </Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: '0 50px' }}>
          <div style={siteLayout}>{children}</div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Next & Express App ©2018 Created by Aio
        </Footer>
      </Layout>
    </>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
export default AppLayout;
