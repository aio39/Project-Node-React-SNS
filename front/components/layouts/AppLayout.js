import React, { useState } from 'react';
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
import fetcher from '../../util/fetcher';
import LogOutButton from '../myPage/LogOutButton';

const { Header, Content, Footer } = Layout;

const siteLayout = {
  backgroundColor: '#fff',
  padding: '24px',
  margin: '30px 0px',
};

function getRandomInt(max, min = 0) {
  return Math.floor(Math.random() * (max - min + 1)) + min; // eslint-disable-line no-mixed-operators
}

const fetchWithParams = (url, params) =>
  Axios.get(`${url}/?tag=${params}`, { withCredentials: true }).then(
    response => response.data,
  );
const AppLayout = ({ children }) => {
  const router = useRouter();
  const current = router.pathname === '/' ? 'home' : router.pathname.slice(1);

  const { data: userData } = useSWR('/user', fetcher);
  const [options, setOptions] = useState([]);
  const [searchParams, setSearchParams] = useDebounce('', 500, false);
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
    setOptions(value ? searchResult(value) : []);
  };
  console.log('isValidating ', isValidating);

  const onSelect = value => {
    console.log('onSelect', value);
  };

  const searchResult = query => {
    const q = query.match(/^[가-힣a-zA-Z\s]+$/i);
    if (q) setSearchParams(q[0]);
    console.log('searchData:', searchData);
    console.log(searchParams);
    console.log('서치 실행');
    if (!searchData) return null;
    if (searchData.length === 0) return <div>검색 결과 없음.</div>;
    return searchData.map((data, idx) => {
      const category = `${query}${idx}`;
      return {
        value: data.name,
        label: (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span>
              <a
                href={`https://s.taobao.com/search?q=${query}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {data.name}
              </a>
            </span>
            {/* <span>{getRandomInt(200, 100)} results</span> //결과창 */}
          </div>
        ),
      };
    });
  };

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
