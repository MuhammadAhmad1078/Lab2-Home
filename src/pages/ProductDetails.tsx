import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Heart, Loader2, ArrowLeft, Package, Star } from 'lucide-react';
import { toast } from 'sonner';
import * as marketplaceService from '@/services/marketplace.service';

const ProductDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [quantity, setQuantity] = useState(1);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    useEffect(() => {
        fetchProduct();
        if (token) {
            checkWishlist();
        }
    }, [id]);

    const fetchProduct = async () => {
        if (!id) return;
        try {
            setLoading(true);
            const response = await marketplaceService.getProductById(id);
            setProduct(response.data);
        } catch (error: any) {
            console.error('Error fetching product:', error);
            toast.error('Failed to load product');
            navigate('/patient/marketplace');
        } finally {
            setLoading(false);
        }
    };

    const checkWishlist = async () => {
        if (!token || !id) return;
        try {
            const response = await marketplaceService.getWishlist(token);
            const wishlistIds = response.data.products.map((p: any) => p._id);
            setIsInWishlist(wishlistIds.includes(id));
        } catch (error) {
            console.error('Error checking wishlist:', error);
        }
    };

    const handleAddToCart = async () => {
        if (!token) {
            toast.error('Please login to add items to cart');
            navigate('/login');
            return;
        }

        try {
            await marketplaceService.addToCart(token, id!, quantity);
            toast.success('Product added to cart!');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to add to cart');
        }
    };

    const handleToggleWishlist = async () => {
        if (!token) {
            toast.error('Please login to add items to wishlist');
            navigate('/login');
            return;
        }

        try {
            if (isInWishlist) {
                await marketplaceService.removeFromWishlist(token, id!);
                setIsInWishlist(false);
                toast.success('Removed from wishlist');
            } else {
                await marketplaceService.addToWishlist(token, id!);
                setIsInWishlist(true);
                toast.success('Added to wishlist!');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update wishlist');
        }
    };

    if (loading) {
        return (
            <DashboardLayout role="patient">
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </DashboardLayout>
        );
    }

    if (!product) {
        return (
            <DashboardLayout role="patient">
                <div className="text-center py-20">
                    <p className="text-gray-500">Product not found</p>
                    <Button onClick={() => navigate('/patient/marketplace')} className="mt-4">
                        Back to Marketplace
                    </Button>
                </div>
            </DashboardLayout>
        );
    }

    const getImageSrc = (img: string) => {
        if (!img) return '/placeholder-product.svg';
        if (img.startsWith('data:') || img.startsWith('http')) return img;
        return `${API_URL}${img}`;
    };

    const imageUrl = getImageSrc(product.images[0]);

    return (
        <DashboardLayout role="patient">
            <div className="space-y-6">
                {/* Back Button */}
                <Button variant="ghost" onClick={() => navigate('/patient/marketplace')}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Marketplace
                </Button>

                {/* Product Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Product Images */}
                    <div className="space-y-4">
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                            <img
                                src={imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/placeholder-product.svg';
                                }}
                            />
                        </div>
                        {product.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-2">
                                {product.images.slice(0, 4).map((img: string, idx: number) => (
                                    <div key={idx} className="aspect-square bg-gray-100 rounded-md overflow-hidden cursor-pointer hover:opacity-75">
                                        <img
                                            src={getImageSrc(img)}
                                            alt={`${product.name} ${idx + 1}`}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = '/placeholder-product.svg';
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        <div>
                            <Badge variant="outline" className="mb-2">
                                {product.category}
                            </Badge>
                            {product.isFeatured && (
                                <Badge className="ml-2 bg-primary">
                                    <Star className="h-3 w-3 mr-1" />
                                    Featured
                                </Badge>
                            )}
                            <h1 className="text-3xl font-bold text-gray-900 mt-2">{product.name}</h1>
                            <p className="text-2xl font-bold text-primary mt-4">Rs. {product.price.toFixed(2)}</p>
                        </div>

                        <Separator />

                        {/* Stock Status */}
                        <div className="flex items-center gap-2">
                            <Package className="h-5 w-5 text-gray-500" />
                            {product.stock > 0 ? (
                                <span className="text-green-600 font-medium">
                                    In Stock ({product.stock} available)
                                </span>
                            ) : (
                                <span className="text-red-600 font-medium">Out of Stock</span>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="font-semibold text-lg mb-2">Description</h3>
                            <p className="text-gray-600 leading-relaxed">{product.description}</p>
                        </div>

                        {/* Specifications */}
                        {product.specifications && Object.keys(product.specifications).length > 0 && (
                            <div>
                                <h3 className="font-semibold text-lg mb-2">Specifications</h3>
                                <Card>
                                    <CardContent className="p-4">
                                        <dl className="space-y-2">
                                            {Object.entries(product.specifications).map(([key, value]) => (
                                                <div key={key} className="flex justify-between">
                                                    <dt className="text-gray-600">{key}:</dt>
                                                    <dd className="font-medium">{String(value)}</dd>
                                                </div>
                                            ))}
                                        </dl>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {/* Tags */}
                        {product.tags && product.tags.length > 0 && (
                            <div>
                                <h3 className="font-semibold text-lg mb-2">Tags</h3>
                                <div className="flex flex-wrap gap-2">
                                    {product.tags.map((tag: string) => (
                                        <Badge key={tag} variant="secondary">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        <Separator />

                        {/* Quantity Selector */}
                        {product.stock > 0 && (
                            <div className="flex items-center gap-4">
                                <label className="font-medium">Quantity:</label>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    >
                                        -
                                    </Button>
                                    <span className="w-12 text-center font-medium">{quantity}</span>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                    >
                                        +
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <Button
                                className="flex-1"
                                size="lg"
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                            >
                                <ShoppingCart className="mr-2 h-5 w-5" />
                                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                            </Button>
                            <Button
                                variant={isInWishlist ? 'default' : 'outline'}
                                size="lg"
                                onClick={handleToggleWishlist}
                            >
                                <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-current' : ''}`} />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ProductDetails;
