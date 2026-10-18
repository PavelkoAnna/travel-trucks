"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { createBookingRequest } from "@/lib/campers-api";
import type { BookingRequest } from "@/types/camper";
import styles from "./BookingForm.module.css";

interface BookingFormProps {
  camperId: string;
}

interface FormErrors {
  name?: string;
  email?: string;
}

export default function BookingForm({ camperId }: BookingFormProps) {
  const [values, setValues] = useState<BookingRequest>({
    name: "",
    email: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const { mutate, isPending, isSuccess, isError, error, reset } = useMutation({
    mutationFn: (booking: BookingRequest) =>
      createBookingRequest(camperId, booking),
    onSuccess: () => {
      setValues({ name: "", email: "" });
      setErrors({});
    },
  });

  function updateField(field: keyof BookingRequest, value: string) {
    setValues((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: undefined }));

    if (isSuccess || isError) {
      reset();
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isPending) {
      return;
    }

    const name = values.name.trim();
    const email = values.email.trim();
    const nextErrors: FormErrors = {};

    const letters = name.match(/\p{L}/gu) ?? [];

    if (letters.length < 2 || !/^[\p{L}\p{M}\s'’ʼ-]+$/u.test(name)) {
      nextErrors.name = "Please enter your name.";
    }

    const emailInput = event.currentTarget.elements.namedItem("email");

    if (
      !email ||
      !(emailInput instanceof HTMLInputElement) ||
      !emailInput.validity.valid
    ) {
      nextErrors.email = "Please enter a valid email.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      const firstInvalidField = nextErrors.name ? "name" : "email";
      const input = event.currentTarget.elements.namedItem(firstInvalidField);

      if (input instanceof HTMLInputElement) {
        input.focus();
      }

      return;
    }

    mutate({ name, email });
  }

  return (
    <section className={styles.container} aria-labelledby="booking-title">
      <h2 className={styles.title} id="booking-title">
        Book your campervan now
      </h2>

      <p className={styles.description}>
        Stay connected! We are always ready to help you.
      </p>

      <form
        className={styles.form}
        onSubmit={handleSubmit}
        noValidate
        aria-busy={isPending}
      >
        <fieldset className={styles.fields} disabled={isPending}>
          <div className={styles.field}>
            <label
              className={errors.name ? styles.errorLabel : styles.label}
              htmlFor="booking-name"
            >
              Name*
            </label>

            <div className={styles.inputWrapper}>
              <input
                className={`${styles.input} ${
                  errors.name ? styles.invalidInput : ""
                }`}
                id="booking-name"
                name="name"
                type="text"
                placeholder="Name*"
                autoComplete="name"
                value={values.name}
                onChange={(event) => updateField("name", event.target.value)}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={
                  errors.name ? "booking-name-error" : undefined
                }
                required
              />

              {errors.name && (
                <span className={styles.errorIcon} aria-hidden="true">
                  !
                </span>
              )}
            </div>

            {errors.name && (
              <p className={styles.fieldError} id="booking-name-error">
                {errors.name}
              </p>
            )}
          </div>

          <div className={styles.field}>
            <label
              className={errors.email ? styles.errorLabel : styles.label}
              htmlFor="booking-email"
            >
              Email*
            </label>

            <div className={styles.inputWrapper}>
              <input
                className={`${styles.input} ${
                  errors.email ? styles.invalidInput : ""
                }`}
                id="booking-email"
                name="email"
                type="email"
                placeholder="Email*"
                autoComplete="email"
                value={values.email}
                onChange={(event) => updateField("email", event.target.value)}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={
                  errors.email ? "booking-email-error" : undefined
                }
                required
              />

              {errors.email && (
                <span className={styles.errorIcon} aria-hidden="true">
                  !
                </span>
              )}
            </div>

            {errors.email && (
              <p className={styles.fieldError} id="booking-email-error">
                {errors.email}
              </p>
            )}
          </div>
        </fieldset>

        <button className={styles.button} type="submit" disabled={isPending}>
          {isPending ? "Sending..." : "Send"}
        </button>

        {isSuccess && (
          <p className={styles.success} role="status">
            Booking request sent successfully! We will contact you by email.
          </p>
        )}

        {isError && (
          <p className={styles.error} role="alert">
            {error.message}
          </p>
        )}
      </form>
    </section>
  );
}
