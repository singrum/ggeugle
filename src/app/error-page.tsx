import { isRouteErrorResponse, useRouteError } from "react-router";

export default function ErrorPage() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>{error.status} 에러</h1>
        <p>{error.statusText}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>예상치 못한 오류가 발생했어요. 개발자에게 문의해주세요.</h1>
      <p>{(error as Error).message}</p>
    </div>
  );
}
