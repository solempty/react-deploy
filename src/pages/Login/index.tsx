import styled from '@emotion/styled';
import { useState } from 'react';

import { BASE_URL, fetchInstance } from '@/api/instance';
import KAKAO_LOGO from '@/assets/kakao_logo.svg';
import { Button } from '@/components/common/Button';
import { UnderlineTextField } from '@/components/common/Form/Input/UnderlineTextField';
import { Spacing } from '@/components/common/layouts/Spacing';
import { breakpoints } from '@/styles/variants';
import { authSessionStorage } from '@/utils/storage';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      alert('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    try {
      let response;

      if (isSignup) {
        response = await fetchInstance.post('/api/members/register', {
          email,
          password,
        });
      } else {
        response = await fetchInstance.post('/api/members/login', {
          email,
          password,
        });
      }

      if (response.status === 200 || response.status === 201) {
        authSessionStorage.set(response.data.token);
        redirectToPost(`${BASE_URL}/api/members/redirect`, { token: response.data.token });
      } else {
        alert(`오류 발생: ${response.data.message || '서버에서 오류가 발생했습니다.'}`);
      }
    } catch (error) {
      console.error('요청 중 오류 발생:', error);
      alert('요청 중 오류가 발생했습니다.');
    }
  };

  const handleKakaoLogin = () => {
    redirectToPost(`${BASE_URL}/api/members/kakao`, {});
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const redirectToPost = (url: string, data: { [key: string]: any }) => {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = url;

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = data[key];
        form.appendChild(input);
      }
    }

    document.body.appendChild(form);
    form.submit();
  };

  return (
    <Wrapper>
      <Logo src={KAKAO_LOGO} alt="카카오 CI" />
      <FormWrapper>
        <UnderlineTextField
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Spacing />
        <UnderlineTextField
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Spacing height={{ initial: 40, sm: 60 }} />
        <Button onClick={handleSubmit}>{isSignup ? '회원가입' : '로그인'}</Button>
        <Spacing height={{ initial: 20 }} />
        <KakaoButton onClick={handleKakaoLogin}>카카오로 로그인하기</KakaoButton>
        <Spacing height={{ initial: 20 }} />
        <SignupSwitch onClick={() => setIsSignup(!isSignup)}>
          {isSignup ? '로그인 화면으로 돌아가기' : '회원가입'}
        </SignupSwitch>
      </FormWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Logo = styled.img`
  width: 88px;
  color: #333;
`;

const FormWrapper = styled.article`
  width: 100%;
  max-width: 580px;
  padding: 16px;

  @media screen and (min-width: ${breakpoints.sm}) {
    border: 1px solid rgba(0, 0, 0, 0.12);
    padding: 60px 52px;
  }
`;

const KakaoButton = styled(Button)`
  background-color: #fee500;
  color: #000;
  border: 1px solid #fee500;
  font-size: 16px;
`;

const SignupSwitch = styled.div`
  font-size: 15px;
  margin-top: 10px;
  cursor: pointer;
  color: #555;
  text-align: left;
`;