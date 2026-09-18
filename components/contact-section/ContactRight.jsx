"use client";

import { useState } from "react";
import { CheckCircle2, ChevronDown, Loader2, Send } from "lucide-react";
import { useSubmitInquiryMutation } from "@/redux/features/contact/contactApi";
import { useGetPublishedServicesQuery } from "@/redux/features/cms/servicesApi";

const FALLBACK_SERVICES = [
  "Software Development",
  "Web Development",
  "Mobile App Development",
  "AI Solutions",
  "Cyber Security",
  "Digital Marketing",
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMPTY_FORM = {
  name: "",
  email: "",
  service: "",
  message: "",
};

function validate(values) {
  const errors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const message = values.message.trim();

  if (name.length < 2) errors.name = "Please enter your name.";
  if (!email) errors.email = "Please enter your email.";
  else if (!EMAIL_RE.test(email)) errors.email = "Please enter a valid email.";
  if (!values.service) errors.service = "Please select a service.";
  if (message.length < 10) {
    errors.message = "Please enter a message of at least 10 characters.";
  }
  return errors;
}

function apiFieldErrors(error) {
  const raw = error?.data?.errors;
  if (!raw || typeof raw !== "object") return {};
  const mapped = {};
  for (const [key, value] of Object.entries(raw)) {
    if (key === "non_field_errors") continue;
    mapped[key] = Array.isArray(value) ? value[0] : String(value);
  }
  return mapped;
}

function apiMessage(error) {
  if (!error) return "Something went wrong. Please try again.";
  if (error.status === "FETCH_ERROR") {
    return "We could not reach the server. Please try again in a moment.";
  }
  if (typeof error.data?.message === "string") return error.data.message;
  if (Array.isArray(error.data?.errors?.non_field_errors)) {
    return error.data.errors.non_field_errors[0];
  }
  return "Something went wrong. Please try again.";
}

export default function ContactRight() {
  const field = "form-field";

  const { data: publishedServices = [], isLoading: servicesLoading } =
    useGetPublishedServicesQuery();
  const services = publishedServices
    .map((item) => item.name)
    .filter(Boolean);
  const serviceOptions = services.length
    ? services
    : servicesLoading
      ? []
      : FALLBACK_SERVICES;

  const [values, setValues] = useState(EMPTY_FORM);
  const [clientErrors, setClientErrors] = useState({});
  const [submitInquiry, { isLoading, isSuccess, isError, error, reset }] =
    useSubmitInquiryMutation();

  const serverErrors = isError ? apiFieldErrors(error) : {};
  const errors = { ...serverErrors, ...clientErrors };
  const hasServerFormError = isError && Object.keys(serverErrors).length === 0;

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (clientErrors[name]) {
      setClientErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
    if (isSuccess || isError) reset();
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate(values);
    setClientErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      await submitInquiry({
        name: values.name.trim(),
        email: values.email.trim(),
        service: values.service,
        message: values.message.trim(),
      }).unwrap();
      setValues(EMPTY_FORM);
      setClientErrors({});
    } catch {
      // RTK Query stores the error on the mutation result.
    }
  }

  return (
    <div className="card relative overflow-hidden p-6 shadow-[var(--shadow-md)] sm:p-8 lg:p-10">
      <div className="relative">
        <h3 className="text-xl font-extrabold text-ink-900">Request a free quote</h3>
        <p className="mt-1.5 text-sm text-ink-500">
          Fill in the form and our team will get back to you shortly.
        </p>

        {isSuccess && (
          <p
            role="status"
            className="alert-success mt-5"
          >
            <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
            Thank you. We received your inquiry and will get back to you shortly.
          </p>
        )}

        {hasServerFormError && (
          <p
            role="alert"
            className="alert-error mt-5"
          >
            {apiMessage(error)}
          </p>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="inquiry-name" className="mb-1.5 block text-sm font-semibold text-ink-800">
              Your name
            </label>
            <input
              id="inquiry-name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Jane Doe"
              value={values.name}
              onChange={handleChange}
              disabled={isLoading}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "inquiry-name-error" : undefined}
              className={field}
            />
            {errors.name && (
              <p id="inquiry-name-error" className="mt-1.5 text-sm text-red-600">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="inquiry-email" className="mb-1.5 block text-sm font-semibold text-ink-800">
              Your email
            </label>
            <input
              id="inquiry-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              value={values.email}
              onChange={handleChange}
              disabled={isLoading}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "inquiry-email-error" : undefined}
              className={field}
            />
            {errors.email && (
              <p id="inquiry-email-error" className="mt-1.5 text-sm text-red-600">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="inquiry-service" className="mb-1.5 block text-sm font-semibold text-ink-800">
              Service
            </label>
            <div className="relative">
              <select
                id="inquiry-service"
                name="service"
                value={values.service}
                onChange={handleChange}
                disabled={isLoading}
                aria-invalid={Boolean(errors.service)}
                aria-describedby={errors.service ? "inquiry-service-error" : undefined}
                className={`${field} appearance-none pr-12`}
              >
                <option value="" disabled>
                  Select a service
                </option>
                {serviceOptions.map((service) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-4 grid place-items-center">
                <ChevronDown className="h-5 w-5 text-ink-400" />
              </span>
            </div>
            {errors.service && (
              <p id="inquiry-service-error" className="mt-1.5 text-sm text-red-600">
                {errors.service}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="inquiry-message" className="mb-1.5 block text-sm font-semibold text-ink-800">
              Your message
            </label>
            <textarea
              id="inquiry-message"
              name="message"
              rows="5"
              placeholder="Tell us about your project"
              value={values.message}
              onChange={handleChange}
              disabled={isLoading}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? "inquiry-message-error" : undefined}
              className={`${field} resize-none`}
            />
            {errors.message && (
              <p id="inquiry-message-error" className="mt-1.5 text-sm text-red-600">
                {errors.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary w-full"
          >
            {isLoading ? (
              <>
                Sending…
                <Loader2 size={16} className="animate-spin" />
              </>
            ) : (
              <>
                Send Message
                <Send size={16} className="btn-icon" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
