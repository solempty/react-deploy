import styled from '@emotion/styled';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { fetchInstance } from '@/api/instance';
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
  const [queryParams] = useSearchParams();

  const handleConfirm = async () => {
    if (!email || !password) {
      alert('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    try {
      const response = await fetchInstance.post('/api/members/login', {
        email,
        password,
      });

      console.log('Response Status:', response.status);
      console.log('Response URL:', response.request.responseURL);

      if (response.status === 200) {
        authSessionStorage.set(response.data.token);

        const redirectUrl = queryParams.get('redirect') ?? `${window.location.origin}/`;
        window.location.replace(redirectUrl);
      } else {
        alert(`로그인 실패: ${response.data.message}`);
      }
    } catch (error) {
      console.error('로그인 요청 중 오류 발생:', error);
      alert('로그인 요청 중 오류가 발생했습니다.');
    }
  };

  const handleKakaoLogin = async () => {
    try {
      const response = await fetchInstance.post('/api/members/kakao');

      console.log('Kakao Login Response Status:', response.status);
      console.log('Kakao Login Response URL:', response.request.responseURL);

      if (response.status === 200) {
        authSessionStorage.set(response.data.token);

        const redirectUrl = queryParams.get('redirect') ?? `${window.location.origin}/`;
        window.location.replace(redirectUrl);
      } else {
        alert(`카카오 로그인 실패: ${response.data.message}`);
      }
    } catch (error) {
      console.error('카카오 로그인 요청 중 오류 발생:', error);
      alert('카카오 로그인 요청 중 오류가 발생했습니다.');
    }
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
        <Button onClick={handleConfirm}>{isSignup ? '회원가입' : '로그인'}</Button>
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