import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AutoComplete, Input, Layout, Menu } from 'antd';
import { useDebounce } from '@react-hook/debounce';
import {
  HomeOutlined,
  UserOutlined,
  SubnodeOutlined,
  LoginOutlined,
} from '@ant-design/icons';
import useSWR from 'swr';
import Search from 'antd/lib/input/Search';
import Axios from 'axios';
import styled from 'styled-components';
import fetcher from '../../util/fetcher';
import LogOutButton from '../myPage/LogOutButton';

const { Header, Content, Footer } = Layout;

const siteLayout = {
  backgroundColor: '#fff',
  padding: '24px',
  margin: '30px 0px',
};

const MenuWrapper = styled(Menu)`
  ul {
    flex: 1 1 auto;
    display: flex;
  }
`;

const fetchWithParams = (url, params) =>
  Axios.get(`${url}/?tag=${params}`, { withCredentials: true }).then(
    response => response.data,
  );

const AppLayout = ({ children }) => {
  const router = useRouter();
  const current = router.pathname === '/' ? 'home' : router.pathname.slice(1);

  const { data: userData } = useSWR('/user', fetcher);
  const [options, setOptions] = useState([]);
  const [searchParams, setSearchParams] = useDebounce('', 200, false);
  const {
    data: searchData,
    error: searchError,
    revalidate,
    isValidating,
  } = useSWR(
    searchParams ? ['/debug/tagsearch', searchParams] : null,
    fetchWithParams,
  );

  const handleSearch = value => {
    if (new TextEncoder().encode(value).length < 3) return;
    const q = value.match(/^[가-힣a-zA-Z\s]+$/i);
    console.log(`q:${q}`);
    if (q) setSearchParams(q[0]);
  };

  const onSelect = value => {
    console.log('onSelect', value);
  };

  const searchResult = () => {
    if (!searchData) return [];
    if (searchData.length === 0) {
      return [
        {
          value: '검색 결과없음.',
          label: (
            <div
              key="검색 결과없음."
              style={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span>
                <a href={null} target="_blank" rel="noopener noreferrer">
                  검색 결과없음.
                </a>
              </span>
              {/* <span>{getRandomInt(200, 100)} results</span> //결과창 */}
            </div>
          ),
        },
      ];
    }
    return searchData.map((data, idx) => ({
      value: data.name,
      label: (
        <div
          key={data.name}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <span>
            <a href={null} target="_blank" rel="noopener noreferrer">
              {data.name}
            </a>
          </span>
          {/* <span>{getRandomInt(200, 100)} results</span> //결과창 */}
        </div>
      ),
    }));
  };

  useEffect(() => {
    revalidate();
  }, [searchParams]);

  useEffect(() => {
    const renderArray = searchData ? searchResult() : [];
    setOptions(renderArray);
  }, [searchData]);

  console.log('isRevali', isValidating);
  console.log('searchParams', searchParams);
  return (
    <>
      <Layout style={{ minHeight: '100vh' }}>
        <Header
          className="header"
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <MenuWrapper
            theme="dark"
            // mode="horizontal"
            mode="inline"
            defaultSelectedKeys={[current]}
            inlineCollapsed={false}
            style={{
              flex: '1 1 auto',
              display: 'flex',
            }}
          >
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
          </MenuWrapper>
          <AutoComplete
            dropdownMatchSelectWidth={252}
            style={{ width: 300 }}
            options={options}
            onSelect={onSelect}
            onSearch={handleSearch}
          >
            <Input.Search size="large" placeholder="input here" enterButton />
          </AutoComplete>
          {userData && <LogOutButton />}
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
