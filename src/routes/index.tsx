import { createFileRoute } from "@tanstack/react-router";
import { Transcriber } from "@/components/transcriber";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <Transcriber />;
}
