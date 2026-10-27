import { notFound } from "next/navigation";

/** Every path on the bare domain other than the pond is a 404; collections live on their subdomains. */
export default function Missing() {
  notFound();
}
