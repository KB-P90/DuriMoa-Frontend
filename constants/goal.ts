export const GOAL_CATEGORIES = [
  {
    code: 'venue',
    label: '예식장',
    icon: '/icons/goal1.png',
    description: '예식장 대관 및 식대',
    tip: '보증 인원을 못 채우면 추가 비용이 생겨요',
  },
  {
    code: 'studio',
    label: '스튜디오',
    icon: '/icons/goal2.png',
    description: '웨딩 촬영',
    tip: '촬영 원본 추가 구매 시 비용이 늘어날 수 있어요',
  },
  {
    code: 'dress',
    label: '드레스',
    icon: '/icons/goal3.png',
    description: '웨딩드레스 대여',
    tip: '피팅 횟수가 많아지면 추가 비용이 생길 수 있어요',
  },
  {
    code: 'makeup',
    label: '메이크업',
    icon: '/icons/goal4.png',
    description: '신부 메이크업 및 헤어',
    tip: '리허설 메이크업은 별도 비용이에요',
  },
  {
    code: 'reserve',
    label: '예비비',
    icon: '/icons/goal5.png',
    description: '예상치 못한 추가 비용 대비',
    tip: '전체 예산의 5~10% 정도를 권장해요',
  },
] as const;

export const BUDGET_TYPES = [
  { code: 'saving', label: '알뜰형' },
  { code: 'balanced', label: '균형형' },
  { code: 'flex', label: '플렉스형' },
] as const;

export const REGIONS = [
  '전국',
  '수도권',
  '비수도권',
  '서울(강남)',
  '서울(강남외)',
  '부산',
  '대구',
  '인천',
  '광주',
  '대전',
  '울산',
  '경기도',
  '강원도',
  '충청도',
  '전라도',
  '경상도',
  '제주도',
] as const;
