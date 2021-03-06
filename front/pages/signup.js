/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import { Button, Checkbox, Col, Form, Input, notification, Row } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { useRouter } from 'next/router';
import Title from 'antd/lib/typography/Title';
import { SmileOutlined } from '@ant-design/icons';
import AppLayout from '../components/layouts/AppLayout';
import FormErrorMessage from '../components/FormErrorMessage';
import { signUpValidation } from '../util/validation/yup';
import ResponsiveLayout from '../components/layouts/ResposiveLayoutA';
import FormValidationMessage from '../components/FormValidationMessage';

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
    formState: { errors, dirtyFields },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(signUpValidation),
    mode: 'onBlur',
  });

  const router = useRouter();

  const [isLoadingPostSingUp, setIsLoadingPostSingUp] = useState(false);
  const [isFailedPost, setIsFailedPost] = useState(false);

  console.log(dirtyFields);

  const onSubmit = handleSubmit(async data => {
    setIsLoadingPostSingUp(true);
    setIsFailedPost(false);
    try {
      await axios.post('/user', data);
      notification.success({
        message: '가입해주셔서 감사합니다!',
        description: '로그인 후에 사용해주시길 바랍니다.',
      });
      router.push('/');
    } catch (error) {
      console.log('실패', error);
      setIsFailedPost(true);
    } finally {
      setIsLoadingPostSingUp(false);
    }
  });

  return (
    <AppLayout>
      <Head>
        <title>회원 가입</title>
      </Head>
      <ResponsiveLayout>
        <StyledSignUpForm onFinish={onSubmit} size="large">
          <div>
            <label htmlFor="email">이메일</label>
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
            {!dirtyFields.nickname && (
              <FormValidationMessage validationMessage="닉네임은 3자리 이상입니다." />
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
            {!dirtyFields.password && (
              <FormValidationMessage validationMessage="영문자와 숫자를 포함해서 10자리 이상입니다." />
            )}
          </div>
          <div>
            <label htmlFor="password2">비밀번호</label>
            <Controller
              render={({ field }) => <Input.Password {...field} />}
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
                  onChange={e => field.onChange(!e.target.value)}
                  checked={field.value}
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
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoadingPostSingUp}
              block
            >
              가입하기
            </Button>

            {isFailedPost ? (
              <Title> 가입 실패, 다시 시도해주세요.</Title>
            ) : null}
          </div>
        </StyledSignUpForm>
      </ResponsiveLayout>
    </AppLayout>
  );
};
export default SignUp;
