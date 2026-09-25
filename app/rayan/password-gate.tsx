"use client";

import Image from "next/image";
import { useActionState } from "react";
import { motion } from "framer-motion";
import { login, type LoginState } from "./actions";

const INITIAL: LoginState = { error: null, attempt: 0 };

export function PasswordGate({ hint }: { hint: string | null }) {
  const [state, formAction, pending] = useActionState(login, INITIAL);

  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden px-4">
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <Image
          src="/brand/sigil.png"
          alt=""
          width={900}
          height={900}
          preload
          className="w-[min(110vw,900px)] animate-spin-slow opacity-[0.12]"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-sm"
      >
        <p className="flex items-center gap-2 label-mono text-blood">
          <span className="size-1.5 animate-blink rounded-full bg-blood" /> Restricted area
        </p>
        <h1 className="mt-3 font-display text-7xl uppercase leading-[0.85]">
          Control
          <br />
          room
        </h1>

        <motion.form
          key={state.attempt}
          action={formAction}
          animate={state.error ? { x: [0, -14, 14, -8, 8, 0] } : undefined}
          transition={{ duration: 0.45 }}
          className="mt-10"
        >
          <label htmlFor="password" className="label-mono text-white/50">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoFocus
            autoComplete="current-password"
            aria-invalid={state.error ? true : undefined}
            aria-describedby={state.error ? "password-error" : undefined}
            className={`mt-2 w-full border-0 border-b bg-transparent px-0 py-3 font-mono text-lg tracking-[0.3em] focus:outline-none ${
              state.error ? "border-blood" : "border-white/25 focus:border-white"
            }`}
          />
          {state.error && (
            <p id="password-error" role="alert" className="mt-2 label-mono text-blood">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="group relative mt-8 flex h-14 w-full items-center justify-center overflow-hidden bg-blood font-display text-xl uppercase tracking-wider disabled:cursor-wait disabled:opacity-70"
          >
            <span className="absolute inset-0 origin-left scale-x-0 bg-white transition-transform duration-500 ease-brutal group-enabled:group-hover:scale-x-100" />
            <span className="relative transition-colors duration-500 group-enabled:group-hover:text-black">
              {pending ? "Checking…" : "Enter"}
            </span>
          </button>
        </motion.form>

        {hint && <p className="mt-6 border-l-2 border-blood pl-3 text-xs text-white/50">{hint}</p>}
      </motion.div>
    </main>
  );
}
