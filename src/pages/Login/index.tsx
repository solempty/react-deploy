import styled from '@emotion/styled';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import KAKAO_LOGO from '@/assets/kakao_logo.svg';
import { Button } from '@/components/common/Button';
import { UnderlineTextField } from '@/components/common/Form/Input/UnderlineTextField';
import { Spacing } from '@/components/common/layouts/Spacing';
import { breakpoints } from '@/styles/variants';
import { authSessionStorage } from '@/utils/storage';

export const LoginPage = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [queryParams] = useSearchParams();

  const handleConfirm = () => {
    if (!id || !password) {
      alert('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    // TODO: API 연동

    // TODO: API 연동 전까지 임시 로그인 처리
    authSessionStorage.set(id);

    const redirectUrl = queryParams.get('redirect') ?? `${window.location.origin}/`;
    return window.location.replace(redirectUrl);
  };

  const handleKakaoLogin = async () => {
    try {
      // 카카오 로그인 API 호출 (API 배포 받은 후 수정)
      const response = await fetch('/api/members/kakao', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const redirectUrl = queryParams.get('redirect') ?? `${window.location.origin}/`;
        window.location.replace(redirectUrl);
      } else {
        alert('카카오 로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error('카카오 로그인 요청 중 오류 발생:', error);
      alert('카카오 로그인 요청 중 오류가 발생했습니다.');
    }
  };

  return (
    <Wrapper>
      <Logo src={KAKAO_LOGO} alt="카카고 CI" />
      <FormWrapper>
        <UnderlineTextField
          placeholder="이름 또는 이메일"
          value={id}
          onChange={(e) => setId(e.target.value)}
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