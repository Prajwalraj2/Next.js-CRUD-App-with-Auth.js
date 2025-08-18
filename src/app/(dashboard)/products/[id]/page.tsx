import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/session";
import Link from "next/link";
import DeleteProductButton from "@/components/delete-product-button";

// Next 15: params is async
type Props = { params: Promise<{ id: string }> };

export default async function ProductDetailPage({ params }: Props) {
  const user = await getCurrentUser();
  const { id: idParam } = await params;
  const id = Number(idParam);
  if (!id || Number.isNaN(id)) notFound();

  const product = await prisma.product.findUnique({ 
    where: { id },
    include: {
      owner: {
        select: {
          name: true,
          email: true
        }
      }
    }
  });
  if (!product) notFound();

  // Check if current user owns this product
  const isOwner = user && (user as any).id === product.ownerId;

  return (
    <main className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-8 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  product.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                  product.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {product.status}
                </span>
                <span className="text-2xl font-bold text-green-600">
                  ₹{(product.price / 100).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Action buttons - only show if user owns the product */}
            {isOwner && (
              <div className="flex items-center space-x-3">
                <Link
                  href={`/products/${product.id}/edit`}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Edit Product
                </Link>
                <DeleteProductButton productId={product.id} productTitle={product.title} />
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {product.description ? (
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-3">Description</h2>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>
          ) : (
            <div className="mb-6">
              <p className="text-gray-500 italic">No description provided</p>
            </div>
          )}

          {/* Product Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Owner Information */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Product Owner</h3>
              <div className="text-sm text-gray-600">
                <p className="font-medium">{product.owner.name || 'No name provided'}</p>
                <p>{product.owner.email}</p>
              </div>
            </div>

            {/* Timestamps */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Timestamps</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p><span className="font-medium">Created:</span> {new Date(product.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</p>
                <p><span className="font-medium">Updated:</span> {new Date(product.updatedAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <Link
              href="/products"
              className="text-gray-600 hover:text-gray-900 text-sm font-medium flex items-center"
            >
              ← Back to Products
            </Link>
            
            {user && !isOwner && (
              <div className="text-sm text-gray-500">
                You can view this product but cannot edit it
              </div>
            )}
            
            {!user && (
              <Link
                href="/login"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Login to manage products →
              </Link>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
