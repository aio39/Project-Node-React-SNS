import React, { useState } from 'react';
import Axios from 'axios';
import Modal from 'antd/lib/modal/Modal';
import Button from 'antd/lib/button';
import { useRouter } from 'next/router';
import { mutate } from 'swr';

const LogOutButton = () => {
  const router = useRouter();
  const [isShowModal, setIsShowModal] = useState(false);
  const [isLoadingLogout, setIsLoadingLogout] = useState(false);
  const [modalText, setModalText] = useState('로그아웃 하시겠습니까?');
  const handelShowModal = () => {
    setIsShowModal(p => !p);
  };

  const handleYesToLogout = async () => {
    setModalText('로그아웃 중입니다. 잠시만 기달려주세요.');
    setIsShowModal(true);
    try {
      await Axios.post('/user/logout');
      setModalText('로그아웃하였습니다. 잠시 후 메인화면으로 이동합니다.');
      setTimeout(() => {
        mutate('/user');
        setIsShowModal(false);
        router.push('/');
      }, 2000);
    } catch (error) {
      console.log(error);
      setModalText('로그아웃에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoadingLogout(false);
    }
  };

  return (
    <>
      <Button type="primary" onClick={handelShowModal}>
        로그아웃
      </Button>
      <Modal
        title="Title"
        visible={isShowModal}
        confirmLoading={isLoadingLogout}
        onOk={handleYesToLogout}
        onCancel={handelShowModal}
      >
        <p>{modalText}</p>
      </Modal>
    </>
  );
};

export default LogOutButton;
