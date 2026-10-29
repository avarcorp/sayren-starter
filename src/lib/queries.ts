import { productSortSchema } from "@sayren/storefront-sdk";
import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { apiFor } from "./api.server";

/**
 * 기본 조회 — TanStack Query의 queryOptions 팩토리다. 라우트 loader(`ensureQueryData`)와 화면(`useSuspenseQuery`, `src/hooks`)이
 * 같은 팩토리를 써서 queryKey가 갈라지지 않는다. 데이터는 서버 함수로 받는다(첫 요청은 서버가 받아 HTML에 싣는다).
 * 금액·재고·주문 가능 여부는 응답 값을 그대로 보인다 — 화면에서 계산하지 않는다.
 */

const getStore = createServerFn({ method: "GET" }).handler(() => apiFor().store.get());

const listCategories = createServerFn({ method: "GET" }).handler(() =>
  apiFor().catalog.listCategories(),
);

export const productSearchSchema = z.object({
  keyword: z.string().optional(),
  categoryId: z.string().optional(),
  sort: productSortSchema.optional(),
  page: z.number().int().min(1).optional(),
  size: z.number().int().min(1).max(60).optional(),
});
export type ProductSearch = z.infer<typeof productSearchSchema>;

const searchProducts = createServerFn({ method: "GET" })
  .validator(productSearchSchema)
  .handler(({ data }) =>
    apiFor().catalog.searchProducts({ ...data, page: data.page ?? 1, size: data.size ?? 24 }),
  );

const getProduct = createServerFn({ method: "GET" })
  .validator(z.object({ productId: z.string().min(1) }))
  .handler(({ data }) => apiFor().catalog.getProduct(data.productId));

/** 상점 이름·로고·연락처 — 상점 플랫폼 설정 › 상점 정보 값 */
export const storeQuery = () =>
  queryOptions({ queryKey: ["store"], queryFn: () => getStore(), staleTime: 5 * 60_000 });

/** 카테고리는 자주 바뀌지 않는다 — 5분 동안 다시 받지 않는다 */
export const categoriesQuery = () =>
  queryOptions({
    queryKey: ["catalog", "categories"],
    queryFn: () => listCategories(),
    staleTime: 5 * 60_000,
  });

export const productsQuery = (search: ProductSearch) =>
  queryOptions({
    queryKey: ["catalog", "products", search],
    queryFn: () => searchProducts({ data: search }),
  });

/** 상품 하나 — 상품 id 또는 상점별 상품번호 */
export const productQuery = (productId: string) =>
  queryOptions({
    queryKey: ["catalog", "product", productId],
    queryFn: () => getProduct({ data: { productId } }),
  });
