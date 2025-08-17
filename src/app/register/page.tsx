import { registerAction } from "./actions";
import { signIn } from "@/auth";

// Next 15: searchParams is async
type Props = { searchParams: Promise<{ error?: string }> };

export default async function RegisterPage({ searchParams }: Props) {
  const { error } = await searchParams;

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2">Create account</h1>
        <p className="text-sm text-gray-600 mb-6">Use email & password or continue with a provider</p>

        {error && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Credentials sign up */}
        <form action={registerAction} className="space-y-4">
          <input
            name="name"
            placeholder="Full name"
            className="w-full rounded border px-3 py-2 text-black"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full rounded border px-3 py-2 text-black"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password (min 6)"
            minLength={6}
            className="w-full rounded border px-3 py-2 text-black"
            required
          />
          <button
            type="submit"
            className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Create account
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-2">
          <div className="h-px flex-1 bg-gray-300" />
          <span className="text-xs text-gray-500">OR</span>
          <div className="h-px flex-1 bg-gray-300" />
        </div>

        {/* OAuth sign up */}
        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/user" });
          }}
        >
          <button
            type="submit"
            className="w-full rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Continue with Google
          </button>
        </form>

        <form
          action={async () => {
            "use server";
            await signIn("github", { redirectTo: "/user" });
          }}
          className="mt-3"
        >
          <button
            type="submit"
            className="w-full rounded bg-gray-800 px-4 py-2 text-white hover:bg-gray-900"
          >
            Continue with GitHub
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 underline">
            Log in
          </a>
        </div>
      </div>
    </main>
  );
}
