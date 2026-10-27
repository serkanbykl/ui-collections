import { RadioGroup, RadioGroupCard, RadioGroupItem } from "@/registry/kit/ui/radio-group";

export default function RadioGroupDemo() {
  return (
    <div className="grid w-full max-w-2xl gap-8 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
      <RadioGroup defaultValue="pro" aria-label="Plan">
        <RadioGroupCard value="hobby" title="Hobby" description="Personal projects and experiments." aside="Free" />
        <RadioGroupCard value="pro" title="Pro" description="Teams shipping to production." aside="$20 / mo" />
        <RadioGroupCard value="scale" title="Scale" description="SLAs, SSO and audit logs." aside="Custom" />
      </RadioGroup>
      <RadioGroup defaultValue="eu" aria-label="Region" className="self-center">
        {[
          { value: "us", label: "US East" },
          { value: "eu", label: "Frankfurt" },
          { value: "ap", label: "Singapore" },
        ].map((r) => (
          <label key={r.value} className="flex items-center gap-3 text-sm text-fg/85">
            <RadioGroupItem value={r.value} />
            {r.label}
          </label>
        ))}
      </RadioGroup>
    </div>
  );
}
