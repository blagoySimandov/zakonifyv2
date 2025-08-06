import { trpc } from "@/utils";

export function useExample() {
  const { data, isLoading, error } = trpc.hello.useQuery({ text: "World" });

  return {
    greeting: data?.greeting,
    isLoading,
    error,
  };
}
