import { Navbar } from "@/components/navbar";
import { AttorneyProfile } from "@/components/attorney-profile";

export default async function AttorneyProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div>
      <Navbar />
      <AttorneyProfile attorneyId={id} />
    </div>
  );
}
