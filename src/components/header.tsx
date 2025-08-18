import Link from "next/link";
import { getCurrentUser } from "@/session";
import { signOut } from "@/auth";

// Server action for sign out
async function handleSignOut() {
  "use server";
  await signOut();
}

export default async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <Link href="/" className="text-xl font-bold text-gray-900 hover:text-gray-700">
            My App
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-4">
            {user ? (
              // Authenticated Navigation
              <>
                <Link 
                  href="/user" 
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                  User
                </Link>

                <Link 
                  href="/myproducts" 
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                  My Products
                </Link>
                
                <Link 
                  href="/products" 
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                  Products
                </Link>
                
                <Link 
                  href="/products/new" 
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                  New Product
                </Link>

                {/* User Info */}
                <div className="flex items-center space-x-3 pl-3 border-l border-gray-200">
                  <span className="text-sm text-gray-600">
                    {user.email}
                  </span>
                  
                  <form action={handleSignOut}>
                    <button
                      type="submit"
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Logout
                    </button>
                  </form>
                </div>
              </>
            ) : (
              // Public Navigation
              <>
                <Link 
                  href="/" 
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                  Home
                </Link>
                
                <Link 
                  href="/products" 
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                  Products
                </Link>
                
                <Link 
                  href="/login" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>

                <Link 
                  href="/register" 
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
