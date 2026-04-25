import { notFound } from "next/navigation";
import EditView from "./EditView";

export const dynamic = "force-dynamic";

export default function EditPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }
  return <EditView />;
}
