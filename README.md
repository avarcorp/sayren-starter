# sayren 스토어프론트 보일러플레이트

`npx sayren create <이름>`으로 만든 sayren 스토어프론트입니다. 상점 이름과 상품 목록을 보이는 홈만 있고, 화면은 쇼핑몰에 맞게 새로 만듭니다.

```bash
pnpm install
pnpm dev
```

상점 연결 값(`SAYREN_STORE_CODE`·`SAYREN_API_URL`)은 `npx sayren link`(이미 연결한 폴더는 `npx sayren env pull`)가 `.env`에 씁니다.

작업 규칙은 `CLAUDE.md`에 있습니다. 기준 문서(스킬)는 sayren이 중앙에서 관리합니다. `npx sayren create`가 넣는 `.claude/skills/sayren`이 읽는 방법을 안내합니다.
