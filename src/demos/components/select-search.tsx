"use client";

import { useState } from "react";

import { Combobox } from "@/registry/kit/ui/combobox";

const regions = [
  { value: "fra1", label: "Frankfurt", description: "eu-central · fra1" },
  { value: "ams1", label: "Amsterdam", description: "eu-west · ams1" },
  { value: "lhr1", label: "London", description: "eu-west · lhr1" },
  { value: "cdg1", label: "Paris", description: "eu-west · cdg1" },
  { value: "arn1", label: "Stockholm", description: "eu-north · arn1" },
  { value: "ist1", label: "Istanbul", description: "eu-east · ist1" },
  { value: "iad1", label: "Washington, D.C.", description: "us-east · iad1" },
  { value: "cle1", label: "Cleveland", description: "us-east · cle1" },
  { value: "sfo1", label: "San Francisco", description: "us-west · sfo1" },
  { value: "pdx1", label: "Portland", description: "us-west · pdx1" },
  { value: "gru1", label: "São Paulo", description: "sa-east · gru1" },
  { value: "cpt1", label: "Cape Town", description: "af-south · cpt1" },
  { value: "dxb1", label: "Dubai", description: "me-central · dxb1" },
  { value: "bom1", label: "Mumbai", description: "ap-south · bom1" },
  { value: "sin1", label: "Singapore", description: "ap-southeast · sin1" },
  { value: "hkg1", label: "Hong Kong", description: "ap-east · hkg1" },
  { value: "icn1", label: "Seoul", description: "ap-northeast · icn1" },
  { value: "hnd1", label: "Tokyo", description: "ap-northeast · hnd1" },
  { value: "kix1", label: "Osaka", description: "ap-northeast · kix1" },
  { value: "syd1", label: "Sydney", description: "ap-southeast · syd1" },
];

export default function SelectSearchDemo() {
  const [region, setRegion] = useState<string | undefined>("fra1");

  return (
    <div className="grid w-full max-w-xs gap-2">
      <span className="text-sm text-muted">Deploy region</span>
      <Combobox
        label="Deploy region"
        options={regions}
        value={region}
        onValueChange={setRegion}
        placeholder="Choose a region"
        searchPlaceholder="Search city or code…"
        emptyText="No region matches."
      />
    </div>
  );
}
