"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { getAuthCallbackURL, getSafeRedirect } from "@/lib/auth-redirect";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader } from "lucide-react";

export function SignIn() {
  const emailInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const searchParams = useSearchParams();
  const error = searchParams.get("error") || "";
  const redirectParam = searchParams.get("redirect") || "";
  const safeRedirect = getSafeRedirect(redirectParam);
  const callbackURL = getAuthCallbackURL(safeRedirect);
  const errorCallbackURL =
    safeRedirect === "/"
      ? "/sign-in"
      : `/sign-in?redirect=${encodeURIComponent(safeRedirect)}`;

  useEffect(() => {
    if (error) toast.error(error, { duration: 12000 });
  }, [error]);

  useEffect(() => {
    const email = searchParams.get("email");
    if (email && emailInputRef.current) emailInputRef.current.value = email;
  }, [searchParams]);

  const getNameFromEmail = (email: string) => {
    const localPart = email.split("@")[0]?.trim();
    return localPart || email;
  };

  const handleEmailSignIn = async (formData: FormData) => {
    const emailValue = formData.get("email");
    if (typeof emailValue !== "string" || !emailValue) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await signIn.magicLink({
        email: emailValue,
        name: getNameFromEmail(emailValue),
        callbackURL,
        errorCallbackURL,
      });

      if (result.error?.message) {
        toast.error(result.error.message);
        return;
      }

      toast.success(
        "Check your inbox — we've sent you a secure sign-in link. If you don't see it, check your spam folder.",
        { duration: 10000 },
      );
      if (emailInputRef.current) emailInputRef.current.value = "";
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dark min-h-screen bg-[#111113] text-foreground flex justify-center items-center p-4">
      <div className="w-full sm:max-w-[360px] space-y-8">
        <div className="flex flex-col items-center text-center gap-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/vainer-logo.png"
            alt="Vainer Marketing"
            className="h-9 w-auto"
          />
          <div className="space-y-1.5">
            <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
            <p className="text-sm text-muted-foreground">
              Enter your email and we&apos;ll send you a secure sign-in link.
            </p>
          </div>
        </div>
        <form
          className="space-y-3"
          onSubmit={async (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            await handleEmailSignIn(formData);
          }}
        >
          <Input
            ref={emailInputRef}
            type="email"
            name="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
            disabled={isSubmitting}
            className="h-11"
          />
          <Button
            type="submit"
            className="w-full h-11 font-medium"
            disabled={isSubmitting}
          >
            Send sign-in link
            {isSubmitting && <Loader className="size-4 animate-spin" />}
          </Button>
        </form>
        <p className="text-xs text-muted-foreground text-center">
          Powered by Vainer Marketing
        </p>
      </div>
    </div>
  );
}
