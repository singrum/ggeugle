import { useState } from "react";

export default function usePage(total: number, perPage: number = 50) {
  const totalPage = Math.floor(total / perPage) + 1;
  const [page, setPage] = useState<number>(1);

  return {
    page: page,
    setPage(page: number) {
      setPage(page);
    },
    toNextPage() {
      setPage(Math.min(page + 1, totalPage));
    },

    toPrevPage() {
      setPage(Math.max(page - 1, 1));
    },
    toFirstPage() {
      setPage(1);
    },
    toLastPage() {
      setPage(totalPage);
    },
    isFirst: page === 1,
    isLast: page === totalPage,
    slicingIndices: [(page - 1) * perPage, Math.min(page * perPage, total)],
  };
}
