import { useRouter } from "next/navigation";
import { LOGIN_TYPES, type LoginType } from "./constants";

export function useLoginPage() {
  const router = useRouter();

  const handleClientLogin = () => {
    // TODO: Implement client authentication logic
    console.log("Client login clicked");
  };

  const handleAttorneyLogin = () => {
    // TODO: Implement attorney authentication logic
    // For now, redirect to registration page as requested
    router.push("/register");
  };

  const handleLogin = (loginType: LoginType) => {
    if (loginType === LOGIN_TYPES.CLIENT) {
      handleClientLogin();
    } else if (loginType === LOGIN_TYPES.ATTORNEY) {
      handleAttorneyLogin();
    }
  };

  return {
    handleLogin,
    handleClientLogin,
    handleAttorneyLogin,
  };
}