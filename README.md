두 사람만의 소중한 순간들을 지도 위에 기록하고 탐색하는 커플 전용 추억 아카이빙 앱입니다. 이 프로젝트는 React Native (Expo)와 TypeScript를 기반으로 구축되었으며, 기능 기반 아키텍처(Feature-Based Architecture)를 적용하여 코드의 유지보수성과 확장성을 극대화했습니다.

🌟 주요 기능
메인 지도: 모든 추억을 지도상 마커로 한눈에 확인

추억 CRUD: 사진, 코멘트, 비용 등을 포함한 추억 생성, 수정, 삭제 기능

추억 상세 뷰: 날짜별로 당일의 모든 추억을 탐색 가능.

다양한 필터링: 메인 페이지에서 날짜별, 지역별, 카테고리별로 추억을 그룹화하여 조회

위치 기반 추억 추가: 지도에서 직접 위치를 선택하여 추억 등록 가능

🛠️ 기술 스택
프레임워크: React Native (Expo)

언어: TypeScript

라우팅: Expo Router (File-based Routing)

UI 라이브러리: React Native Paper

상태 관리: React Context API

지도: React Native Maps

애니메이션: React Native Reanimated

📂 프로젝트 구조
이 프로젝트는 기능별로 코드를 그룹화하는 Feature-Based Architecture를 따릅니다.

.
├── app/                  # 📁 라우팅 계층 (Expo Router)
│   └── index.tsx         #    - 메인 화면 라우트
│
└── src/                  # 📁 소스 코드 및 비즈니스 로직
    ├─ api/               #    - 외부 API 연동 관련 로직
    ├─ assets/            #    - 이미지, 폰트 등 정적 에셋
    │
    ├─ components/        #    - ✨ 모든 기능에서 공유되는 재사용 UI 컴포넌트
    │  ├─ basic/          #      - 기본 EXPO 초기 생성 컴포넌트
    │  ├─ common/         #      - 재사용 가능한 일반 UI (KeyboardDissmissWrapper)
    │  └─ ui/             #      - 아이콘 등 기본 UI
    │
    ├─ constants/         #    - 색상, 글꼴 등 앱 전반의 상수
    ├─ context/           #    - 전역 상태 관리 (MemoryContext)
    │
    ├─ features/          #    - ⭐ 페이지별 코드의 집합
    │  └─ main/           #       - 메인 화면 기능 및 화면
    │     ├─ components/
    │     ├─ hooks/
    │     └─ screens/
    │
    ├─ hooks/             #    - 여러 기능에서 공유되는 커스텀 훅
    ├─ lib/               #    - 공용 유틸리티 함수
    └─ types/             #    - 전역 TypeScript 타입 정의