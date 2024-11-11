"use client";

import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction } from "react";

export default function UseQueryParams({
  setParams,
}: {
  setParams: Dispatch<SetStateAction<ReadonlyURLSearchParams>>;
}) {
  const params = useSearchParams();
  setParams(params);
}
