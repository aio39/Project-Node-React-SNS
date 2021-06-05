import React, { useState } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import { Button, Input, Form } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { useRouter } from 'next/router';
import Title from 'antd/lib/typography/Title';
import useSWR from 'swr';
import AppLayout from '../components/layouts/AppLayout';
import FormErrorMessage from '../components/FormErrorMessage';
import fetcher from '../util/fetcher';
import { loginValidation } from '../util/validation/yup';
import ResponsiveLayout from '../components/layouts/ResposiveLayoutA';

const StyledSignUpForm = styled(Form)`
  > div:not(:first-child) {
    margin-top: 30px; // ID 인풋박스만 제외하고
  }

  > div:not(:last-child) {
    position: relative; // 버튼 박스만 제외하고
  }

  > div > label {
    display: inline-block;
    padding-bottom: 8px;
  }
  .ant-checkbox-wrapper {
    display: flex;
  }
`;

const Login = () => {
  const { data: userData, error, revalidate } = useSWR('/user', fetcher);
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(loginValidation),
    mode: 'onBlur',
  });

  const router = useRouter();

  const [isLoadingPostSingUp, setIsLoadingPostSingUp] = useState(false);
  const [isFailedPost, setIsFailedPost] = useState(false);

  const onSubmit = handleSubmit(async data => {
    setIsLoadingPostSingUp(true);
    setIsFailedPost(false);
    try {
      await axios.post('/user/login', data);
      await revalidate();
    } catch (error) {
      console.log('실패', error);
      setIsFailedPost(true);
    } finally {
      setIsLoadingPostSingUp(false);
    }
  });

  if (!error && userData) {
    router.push('/');
  }

  return (
    <AppLayout>
      <Head>
        <title>로그인</title>
      </Head>
      <ResponsiveLayout>
        <StyledSignUpForm onFinish={onSubmit} size="large">
          <div>
            <label htmlFor="email">Email</label>
            <Controller
              name="email"
              type="email"
              control={control}
              defaultValue=""
              render={({ field }) => <Input {...field} />}
            />
            {errors.email && (
              <FormErrorMessage errorMessage={errors.email.message} />
            )}
          </div>

          <div>
            <label htmlFor="password">비밀번호</label>
            <Controller
              render={({ field }) => <Input.Password {...field} />}
              type="password"
              name="password"
              control={control}
              placeholder="비밀번호를 입력해주세요."
              defaultValue=""
            />
            {errors.password && (
              <FormErrorMessage errorMessage={errors.password.message} />
            )}
          </div>

          <div>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoadingPostSingUp}
              block
            >
              로그인
            </Button>

            {isFailedPost ? <Title> 로그인 실패</Title> : null}
          </div>
        </StyledSignUpForm>
      </ResponsiveLayout>
    </AppLayout>
  );
};

export default Login;
