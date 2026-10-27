"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";

import { cn } from "@/registry/kit/lib/utils";
import { Button, buttonVariants } from "@/registry/kit/ui/button";
import { FileUpload } from "@/registry/kit/ui/file-upload";
import { ChipInput } from "@/registry/kit/ui/chip";
import { Input, Textarea } from "@/registry/kit/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/registry/kit/ui/select";
import { Switch } from "@/registry/kit/ui/switch";
import { PageHeader } from "@/registry/kit/ui/page-header";

export interface ProductFormValues {
  name: string;
  description: string;
  price: string;
  compareAt: string;
  sku: string;
  stock: string;
  category: string;
  status: "active" | "draft";
  trackInventory: boolean;
  chargeTax: boolean;
  /** Search and collection tags, e.g. "waxed cotton". */
  tags?: string[];
}

export const emptyProductForm: ProductFormValues = {
  name: "",
  description: "",
  price: "",
  compareAt: "",
  sku: "",
  stock: "0",
  category: "apparel",
  status: "draft",
  trackInventory: true,
  chargeTax: true,
};

export const sampleProductForm: ProductFormValues = {
  name: "Waxed field jacket",
  description: "British Millerain waxed cotton, corduroy collar and a quilted lining. Re-wax once a season.",
  price: "189.00",
  compareAt: "",
  sku: "NW-01154",
  stock: "37",
  category: "apparel",
  status: "active",
  trackInventory: true,
  chargeTax: true,
  tags: ["outerwear", "waxed cotton", "made in Portugal"],
};

const categories = [
  { value: "apparel", label: "Apparel" },
  { value: "accessories", label: "Accessories" },
  { value: "footwear", label: "Footwear" },
  { value: "home", label: "Home" },
];

type Errors = Partial<Record<keyof ProductFormValues, string>>;

function validate(v: ProductFormValues): Errors {
  const errors: Errors = {};
  if (!v.name.trim()) errors.name = "Give the product a name shoppers will see.";
  const price = Number(v.price);
  if (!v.price.trim() || Number.isNaN(price) || price <= 0) errors.price = "Enter a price above zero, like 64.00.";
  if (v.compareAt.trim() && (Number.isNaN(Number(v.compareAt)) || Number(v.compareAt) <= price))
    errors.compareAt = "Compare-at price should be higher than the price.";
  if (!/^[A-Z0-9-]{4,20}$/.test(v.sku.trim())) errors.sku = "Use 4–20 capital letters, digits or dashes.";
  if (v.trackInventory && (!/^\d+$/.test(v.stock.trim()))) errors.stock = "Enter a whole number of units.";
  return errors;
}

function Section({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="surface rounded-card p-5 md:p-6">
      <h3 className="text-sm font-medium text-fg/85">{title}</h3>
      {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      <div className="mt-5 grid grid-cols-1 gap-4">{children}</div>
    </section>
  );
}

function SwitchRow({ label, hint, checked, onCheckedChange }: { label: string; hint: string; checked: boolean; onCheckedChange: (v: boolean) => void }) {
  const id = useId();
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
        <p id={`${id}-hint`} className="mt-0.5 text-sm text-muted">
          {hint}
        </p>
      </div>
      <Switch id={id} aria-describedby={`${id}-hint`} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

export interface ProductFormScreenProps {
  /** Starting values; pass a product to edit it. */
  initialValues?: ProductFormValues;
  /** Called with the values once they pass validation. Resolve when saved. */
  onSave?: (values: ProductFormValues) => Promise<void> | void;
  /** Where "Cancel" goes. */
  cancelHref?: string;
  className?: string;
}

/** Create or edit a product: details, pricing, inventory switches, a photo dropzone, inline validation and a saving state. */
export function ProductFormScreen({ initialValues = sampleProductForm, onSave, cancelHref = "#/app/products", className }: ProductFormScreenProps) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const categoryId = useId();
  const statusId = useId();

  useEffect(() => () => clearTimeout(timer.current), []);

  function set<K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    setSavedAt(null);
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) {
      const first = Object.keys(found)[0];
      document.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setSaving(true);
    if (onSave) await onSave(values);
    else await new Promise<void>((resolve) => (timer.current = setTimeout(resolve, 900)));
    setSaving(false);
    setSavedAt(values.name);
  }

  const errorCount = Object.values(errors).filter(Boolean).length;

  return (
    <form noValidate onSubmit={submit} className={cn("grid grid-cols-1 gap-6", className)}>
      <PageHeader
        title={initialValues.name ? "Edit product" : "New product"}
        description={
          initialValues.name
            ? `${initialValues.name} · changes go live on your storefront when you save.`
            : "Saved as a draft until you set it to active. Nothing shows on your storefront before then."
        }
        actions={
          <>
          <a href={cancelHref} className={buttonVariants({ variant: "ghost" })}>
            Cancel
          </a>
          <Button type="submit" variant="accent" loading={saving}>
            {saving ? "Saving…" : "Save product"}
          </Button>
          </>
        }
      />

      <div aria-live="polite" className="empty:hidden">
        {errorCount > 0 && (
          <p className="rounded-card border border-danger/40 px-4 py-3 text-sm text-danger">
            {errorCount === 1 ? "One field needs" : `${errorCount} fields need`} a look before you can save.
          </p>
        )}
        {savedAt && errorCount === 0 && (
          <p className="rounded-card border border-success/40 px-4 py-3 text-sm text-success">Saved “{savedAt}”. It&apos;s live on your storefront.</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="grid grid-cols-1 content-start gap-6">
          <Section title="Details">
            <Input label="Name" name="name" value={values.name} onChange={(e) => set("name", e.target.value)} error={errors.name} />
            <Textarea
              label="Description"
              name="description"
              rows={4}
              value={values.description}
              onChange={(e) => set("description", e.target.value)}
              hint="Shown under the price. Plain text, up to 600 characters."
              maxLength={600}
            />
          </Section>

          <Section title="Photos" description="JPG or PNG, at least 1200 px on the long side. The first photo is the cover.">
            <FileUpload
              accept="image/jpeg,image/png,image/webp"
              maxFiles={8}
              maxSize={10 * 1024 * 1024}
              label="Drop photos here or browse"
              hint="Up to 8 photos, 10 MB each"
              defaultItems={[
                { name: "field-jacket-front.jpg", size: 1_384_201, type: "image/jpeg" },
                { name: "field-jacket-lining.jpg", size: 942_877, type: "image/jpeg" },
              ]}
              itemNote={(_, i) => (i === 0 ? "Cover" : null)}
            />
          </Section>

          <Section title="Pricing">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="Price (USD)" name="price" inputMode="decimal" value={values.price} onChange={(e) => set("price", e.target.value)} error={errors.price} />
              <Input
                label="Compare-at price"
                name="compareAt"
                inputMode="decimal"
                value={values.compareAt}
                onChange={(e) => set("compareAt", e.target.value)}
                error={errors.compareAt}
                hint="Optional. Shows the price struck through."
              />
            </div>
            <SwitchRow label="Charge tax" hint="Applies your store's tax rate at checkout." checked={values.chargeTax} onCheckedChange={(v) => set("chargeTax", v)} />
          </Section>
        </div>

        <div className="grid grid-cols-1 content-start gap-6">
          <Section title="Organisation">
            <div className="grid grid-cols-1 gap-2">
              <span id={statusId} className="text-sm text-muted">
                Status
              </span>
              <Select value={values.status} onValueChange={(v) => set("status", v as ProductFormValues["status"])}>
                <SelectTrigger aria-labelledby={statusId}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <span id={categoryId} className="text-sm text-muted">
                Category
              </span>
              <Select value={values.category} onValueChange={(v) => set("category", v)}>
                <SelectTrigger aria-labelledby={categoryId}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <ChipInput
              label="Tags"
              placeholder="Add a tag and press Enter"
              value={values.tags ?? []}
              onValueChange={(tags) => set("tags", tags)}
              validate={(tag) => (tag.length > 32 ? "Keep tags under 32 characters." : null)}
              max={12}
            />
          </Section>

          <Section title="Inventory">
            <Input label="SKU" name="sku" value={values.sku} onChange={(e) => set("sku", e.target.value.toUpperCase())} error={errors.sku} />
            <SwitchRow
              label="Track inventory"
              hint="Stop selling when stock reaches zero."
              checked={values.trackInventory}
              onCheckedChange={(v) => set("trackInventory", v)}
            />
            {values.trackInventory && (
              <Input label="Units in stock" name="stock" inputMode="numeric" value={values.stock} onChange={(e) => set("stock", e.target.value)} error={errors.stock} />
            )}
          </Section>
        </div>
      </div>
    </form>
  );
}
