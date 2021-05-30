import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Layout, Menu } from 'antd';

import {
  HomeOutlined,
  UserOutlined,
  SubnodeOutlined,
  LoginOutlined,
} from '@ant-design/icons';
import useSWR from 'swr';
import fetcher from '../../util/fetcher';

const { Header, Content, Footer } = Layout;

const siteLayout = {
  backgroundColor: '#fff',
  padding: '24px',
  margin: '30px 0px',
};

const AppLayout = ({ children }) => {
  const router = useRouter();
  const current = router.pathname === '/' ? 'home' : router.pathname.slice(1);

  const { data: userData } = useSWR('/user', fetcher);

  return (
    <>
      <Layout style={{ minHeight: '100vh' }}>
        <Header
          className="header"
          style={{ position: 'sticky', top: 0, zIndex: 100 }}
        >
          <div className="logo" />
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[current]}>
            <Menu.Item key="home" icon={<HomeOutlined />}>
              <Link href="/">
                <a>메인</a>
              </Link>
            </Menu.Item>

            {!userData ? (
              <>
                <Menu.Item key="signup" icon={<SubnodeOutlined />}>
                  <Link href="/signup">
                    <a>회원가입</a>
                  </Link>
                </Menu.Item>
                <Menu.Item key="login" icon={<LoginOutlined />}>
                  <Link href="/login">
                    <a>로그인</a>
                  </Link>
                </Menu.Item>
              </>
            ) : (
              <>
                <Menu.Item key="write" icon={<LoginOutlined />}>
                  <Link href="/write">
                    <a>글쓰기</a>
                  </Link>
                </Menu.Item>
                <Menu.Item key="mypage" icon={<UserOutlined />}>
                  <Link href="/mypage">
                    <a>내정보 </a>
                  </Link>
                </Menu.Item>
              </>
            )}
          </Menu>
        </Header>
        <Content>
          <div style={siteLayout}>{children}</div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Next & Express App ©2021 Created by Aio
        </Footer>
      </Layout>
    </>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
export default AppLayout;
