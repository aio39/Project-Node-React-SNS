import * as yup from 'yup';

export const signUpValidation = yup.object().shape({
  email: yup
    .string()
    .required('아이디를 입력해주세요.')
    .max(12, '아이디는 12자리 이하여야 합니다.')
    .min(6, '아이디는 6자리 이상이어야 합니다.'),
  nickname: yup
    .string()
    .required('닉네임을 입력해주세요.')
    .max(12, '닉네임은 12자리 이하여야 합니다.')
    .min(3, '닉네임은 3자리 이상이어야 합니다.'),
  password: yup
    .string()
    .required('비밀번호를 입력해주세요.')
    .max(15, '비밀번호는 15자리 이하여야 합니다.')
    .min(4, '비밀번호는 10자리 이상이어야 합니다.'),
  password2: yup
    .string()
    .oneOf(
      [yup.ref('password'), null],
      '비밀번호가 일치하지 않습니다. 다시 확인해 주세요. ',
    ),
  term: yup.boolean().oneOf([true], '약관에 동의해주세요.'),
});

export const loginValidation = yup.object().shape({
  email: yup
    .string()
    .required('아이디를 입력해주세요.')
    .max(12, '아이디는 12자리 이하여야 합니다.')
    .min(6, '아이디는 6자리 이상이어야 합니다.'),
  password: yup
    .string()
    .required('비밀번호를 입력해주세요.')
    .max(15, '비밀번호는 15자리 이하여야 합니다.')
    .min(4, '비밀번호는 10자리 이상이어야 합니다.'),
});

export const commentValidation = yup.object().shape({
  content: yup.string().required('코멘트를 입력해주세요.'),
});
