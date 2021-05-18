/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import { Button, Checkbox, Form, Input } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import AppLayout from '../components/layouts/AppLayout';
import FormErrorMessage from '../components/FormErrorMessage';
import signUpValidation from '../validation/yup';

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

const SignUp = () => {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(signUpValidation),
    mode: 'onBlur',
  });

  const onSubmit = handleSubmit((data) => {
    console.log(data);
  });

  return (
    <AppLayout>
      <Head>
        <title>회원 가입</title>
      </Head>
      <StyledSignUpForm onFinish={onSubmit} size="large">
        <div>
          <label htmlFor="userId">아이디</label>
          <Controller
            name="userId"
            type="email"
            control={control}
            defaultValue=""
            render={({ field }) => <Input {...field} />}
          />
          {errors.userId && (
            <FormErrorMessage errorMessage={errors.userId.message} />
          )}
        </div>
        <div>
          <label htmlFor="nickname">닉네임</label>
          <Controller
            type="text"
            name="nickname"
            control={control}
            placeholder="닉네임을 입력해주세요."
            defaultValue=""
            render={({ field }) => <Input {...field} />}
          />
          {errors.nickname && (
            <FormErrorMessage errorMessage={errors.nickname.message} />
          )}
        </div>
        <div>
          <label htmlFor="password">비밀번호</label>
          <Controller
            render={({ field }) => <Input {...field} />}
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
          <label htmlFor="password2">비밀번호</label>
          <Controller
            render={({ field }) => <Input {...field} />}
            type="password"
            name="password2"
            control={control}
            placeholder="비밀번호를 확인해주세요."
            defaultValue=""
          />
          {errors.password2 && (
            <FormErrorMessage errorMessage={errors.password2.message} />
          )}
        </div>
        <div>
          <Controller
            name="term"
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <Checkbox
                {...field}
                onChange={(e) => field.onChange(e.target.value)}
              >
                약관에 동의합니다.
              </Checkbox>
            )}
          />
          {errors.term && (
            <FormErrorMessage errorMessage={errors.term.message} />
          )}
        </div>
        <div>
          <Button type="primary" htmlType="submit" block>
            가입하기
          </Button>
        </div>
      </StyledSignUpForm>
    </AppLayout>
  );
};
export default SignUp;
