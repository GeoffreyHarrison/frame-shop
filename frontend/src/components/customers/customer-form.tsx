"use client";

import { useState } from "react";
import type { Customer } from "@/lib/types";
import type { CustomerFormData } from "@/app/actions/customers";

interface CustomerFormProps {
  initial?: Customer;
  onSubmit: (data: CustomerFormData) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
}

const CONTACT_METHODS = ["Call", "Text", "Email"] as const;
const CUSTOMER_TYPES = ["Customer", "Decorator", "Artist", "Vendor"] as const;

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-primary-dark uppercase tracking-wide">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "px-3 py-2 text-sm border border-primary-dark/20 rounded-lg text-primary-dark focus:outline-none focus:border-primary-dark bg-white disabled:opacity-50";

export function CustomerForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel = "Save",
}: CustomerFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<CustomerFormData>({
    firstName: initial?.firstName ?? "",
    lastName: initial?.lastName ?? "",
    phone: initial?.phone ?? "",
    email: initial?.email ?? "",
    contactMethod: initial?.contactMethod ?? "Call",
    phone2: initial?.phone2 ?? "",
    address: initial?.address ?? "",
    suite: initial?.suite ?? "",
    city: initial?.city ?? "",
    state: initial?.state ?? "",
    zip: initial?.zip ?? "",
    spouse: initial?.spouse ?? "",
    company: initial?.company ?? "",
    type: initial?.type ?? "Customer",
    rewards: initial?.rewards ?? false,
    discount: initial?.discount ?? 0,
    taxable: initial?.taxable ?? true,
    taxId: initial?.taxId ?? "",
    notes: initial?.notes ?? "",
  });

  const set = (key: keyof CustomerFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const setCheck = (key: keyof CustomerFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => setForm((f) => ({ ...f, [key]: e.target.checked }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.phone || !form.contactMethod) {
      setError("First Name, Last Name, Phone, and Contact Method are required.");
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await onSubmit(form);
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
          {error}
        </p>
      )}

      {/* Required fields */}
      <div>
        <p className="text-sm font-semibold text-primary-dark mb-3">Basic Information</p>
        <div className="grid grid-cols-2 gap-4">
          <Field label="First Name" required>
            <input className={inputCls} value={form.firstName} onChange={set("firstName")} placeholder="First name" />
          </Field>
          <Field label="Last Name" required>
            <input className={inputCls} value={form.lastName} onChange={set("lastName")} placeholder="Last name" />
          </Field>
          <Field label="Phone" required>
            <input className={inputCls} value={form.phone} onChange={set("phone")} placeholder="(555) 000-0000" type="tel" />
          </Field>
          <Field label="Email">
            <input className={inputCls} value={form.email} onChange={set("email")} placeholder="email@example.com" type="email" />
          </Field>
          <Field label="Contact Method" required>
            <select className={inputCls} value={form.contactMethod} onChange={set("contactMethod")}>
              {CONTACT_METHODS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </Field>
          <Field label="2nd Phone">
            <input className={inputCls} value={form.phone2} onChange={set("phone2")} placeholder="(555) 000-0000" type="tel" />
          </Field>
        </div>
      </div>

      {/* Address */}
      <div>
        <p className="text-sm font-semibold text-primary-dark mb-3">Address</p>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Street Address">
            <input className={inputCls} value={form.address} onChange={set("address")} placeholder="123 Main St" />
          </Field>
          <Field label="Suite / Apt">
            <input className={inputCls} value={form.suite} onChange={set("suite")} placeholder="Apt 4B" />
          </Field>
          <Field label="City">
            <input className={inputCls} value={form.city} onChange={set("city")} placeholder="City" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="State">
              <input className={inputCls} value={form.state} onChange={set("state")} placeholder="TX" maxLength={2} />
            </Field>
            <Field label="ZIP">
              <input className={inputCls} value={form.zip} onChange={set("zip")} placeholder="78701" />
            </Field>
          </div>
        </div>
      </div>

      {/* Additional details */}
      <div>
        <p className="text-sm font-semibold text-primary-dark mb-3">Additional Details</p>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Customer Type">
            <select className={inputCls} value={form.type} onChange={set("type")}>
              {CUSTOMER_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </Field>
          <Field label="Company">
            <input className={inputCls} value={form.company} onChange={set("company")} placeholder="Company name" />
          </Field>
          <Field label="Spouse">
            <input className={inputCls} value={form.spouse} onChange={set("spouse")} placeholder="Spouse name" />
          </Field>
          <Field label="Discount %">
            <input className={inputCls} value={form.discount} onChange={set("discount")} type="number" min={0} max={100} step={1} />
          </Field>
          <Field label="Tax ID">
            <input className={inputCls} value={form.taxId} onChange={set("taxId")} placeholder="Tax ID #" />
          </Field>
          <div className="flex items-center gap-6 pt-4">
            <label className="flex items-center gap-2 text-sm text-primary-dark cursor-pointer">
              <input type="checkbox" checked={form.rewards} onChange={setCheck("rewards")} className="w-4 h-4 accent-primary-dark" />
              Rewards Member
            </label>
            <label className="flex items-center gap-2 text-sm text-primary-dark cursor-pointer">
              <input type="checkbox" checked={form.taxable} onChange={setCheck("taxable")} className="w-4 h-4 accent-primary-dark" />
              Taxable
            </label>
          </div>
        </div>
      </div>

      {/* Notes */}
      <Field label="Notes">
        <textarea
          className={`${inputCls} resize-none h-24`}
          value={form.notes}
          onChange={set("notes")}
          placeholder="Any additional notes..."
        />
      </Field>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-primary-dark text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-6 py-2 border border-primary-dark/30 text-primary-dark text-sm font-medium rounded-lg hover:bg-primary/5 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
