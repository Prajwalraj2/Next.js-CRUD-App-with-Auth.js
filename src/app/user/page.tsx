import { getCurrentUser } from "@/session";
import { redirect } from "next/navigation";

export default async function UserPage() {
    const user = await getCurrentUser();

    // Page-level auth check (backup protection + better UX)
    if (!user) {
        redirect("/login");
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white shadow rounded-lg p-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">User Profile</h1>
                
                <div className="flex items-start space-x-6">
                    {/* User Avatar */}
                    {user.image && (
                        <img
                            src={user.image}
                            alt={user.name ? `${user.name}'s avatar` : "User avatar"}
                            className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                        />
                    )}
                    
                    {/* User Info */}
                    <div className="flex-1">
                        <div className="grid gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Name
                                </label>
                                <p className="text-lg text-gray-900">{user.name || 'Not provided'}</p>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <p className="text-lg text-gray-900">{user.email}</p>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    User ID
                                </label>
                                <p className="text-sm text-gray-600 font-mono">{(user as any).id}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex space-x-4">
                        <a
                            href="/products"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            View Products
                        </a>
                        <a
                            href="/products/new"
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            Create Product
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}