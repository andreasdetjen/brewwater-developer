import { createFileRoute } from "@tanstack/react-router";
import { ApiDocs } from "@/components/api-docs/ApiDocs";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "brewwater Developer API — Drinking Water Quality Data" },
      { name: "description", content: "Access drinking water quality data for 50+ German cities through a simple, reliable REST API." },
      { property: "og:title", content: "brewwater Developer API" },
      { property: "og:description", content: "Access drinking water quality data for 50+ German cities." },
    ],
  }),
  component: ApiDocs,
});
