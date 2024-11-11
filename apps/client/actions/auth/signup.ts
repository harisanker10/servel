"use server";
import { $api } from "@/http";
import { setAccessToken } from "@/lib/session/setSession";
import { redirect } from "next/navigation";
import { ErrorResponse, SignupResponseDto } from "@servel/common";
import { revalidatePath } from "next/cache";
export async function signup(
  email: string,
  password: string,
  otp: string,
): Promise<SignupResponseDto | ErrorResponse> {
  const body = {
    email,
    password,
    otp,
  };
  // const result = zodVaidate(body, signupAuthSchema);

  // if (!result.success) {
  //   return {
  //     success: false,
  //     error: result.error as string,
  //     errorType: "validation",
  //   };
  // }

  // const res = await fetch(`${apiGateway}/auth/signup`, {
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   method: "post",
  //   body: JSON.stringify(body),
  // });

  console.log({ body });

  return $api
    .post<SignupResponseDto>("/auth/signup", body)
    .then(({ data }: { data: SignupResponseDto }) => {
      console.log({ data });
      if ("token" in data) {
        setAccessToken(data.token);
        redirect("/profile");
      }
    })
    .catch((err) => {
      console.log("\n\nError\n\n", err);
      return err?.response?.data;
    }) as Promise<SignupResponseDto | ErrorResponse>;
}
