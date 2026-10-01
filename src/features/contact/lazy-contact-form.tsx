"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

import { ContactFormPlaceholder } from "./contact-form-shell";

const ContactForm = dynamic(() => import("./contact-form"), { ssr: false, loading: () => <ContactFormPlaceholder /> });

/**
 * Keeps react-hook-form + zod out of the initial bundle: an identical inert form
 * renders first, and the real one loads when the section is ~800px away.
 */
export function LazyContactForm() {
  const ref = useRef<HTMLDivElement>(null);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setLoad(true);
        observer.disconnect();
      },
      { rootMargin: "800px 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref}>{load ? <ContactForm /> : <ContactFormPlaceholder />}</div>;
}
