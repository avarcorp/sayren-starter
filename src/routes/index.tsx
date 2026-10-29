import { createFileRoute } from "@tanstack/react-router";
import { useProducts, useStore } from "../hooks/use-catalog";
import { m } from "../i18n";
import { formatMoney } from "../lib/format";
import { productsQuery, storeQuery } from "../lib/queries";

/** 홈에 보이는 상품 수 — 첫 페이지만 받는다 */
const HOME_PRODUCTS = { page: 1, size: 24 } as const;

/** 보일러플레이트의 첫 화면 — 상점 이름과 상품 목록. 쇼핑몰을 만들면 이 파일을 홈으로 바꾼다 */
export const Route = createFileRoute("/")({
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(storeQuery()),
      context.queryClient.ensureQueryData(productsQuery(HOME_PRODUCTS)),
    ]),
  component: Home,
});

function Home() {
  const store = useStore();
  const products = useProducts(HOME_PRODUCTS);
  return (
    <main className="mx-auto flex min-h-screen max-w-page flex-col gap-8 px-4 py-12">
      <h1 className="font-bold text-3xl">{store.name}</h1>
      {products.contents.length === 0 ? (
        <p className="text-sub">{m.home_no_products()}</p>
      ) : (
        <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {products.contents.map((product) => (
            <li key={product.productId} className="flex flex-col gap-2">
              <div className="aspect-square overflow-hidden bg-chip">
                {product.thumbnailUrl ? (
                  <img
                    src={product.thumbnailUrl}
                    alt={product.name}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
              <p className="text-sm">{product.name}</p>
              <p className="font-bold text-sm">
                {formatMoney(product.discountedPrice ?? product.salePrice, product.currency)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
