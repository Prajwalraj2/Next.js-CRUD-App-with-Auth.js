import { getCurrentUser } from "@/session";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";

// Server actions for authentication
async function signInWithGoogle() {
  "use server";
  await signIn("google");
  
}

async function signInWithGitHub() {
  "use server";
  await signIn("github");
}

export default async function LoginPage() {
  // If user is already logged in, redirect to home
  const user = await getCurrentUser();
  if (user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <div className="space-y-4">
          {/* Google Sign In */}
          <form action={signInWithGoogle}>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg text-white font-medium transition-colors bg-red-500 hover:bg-red-600"
            >
              <span className="text-xl">🌟</span>
              Continue with Google
            </button>
          </form>

          {/* GitHub Sign In */}
          <form action={signInWithGitHub}>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg text-white font-medium transition-colors bg-gray-800 hover:bg-gray-900"
            >
              <span className="text-xl">💻</span>
              Continue with GitHub
            </button>
          </form>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            By signing in, you agree to our{" "}
            <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
            {" "}and{" "}
            <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}
