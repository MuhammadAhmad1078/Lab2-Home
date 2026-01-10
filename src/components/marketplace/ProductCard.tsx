import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Heart } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
    product: {
        _id: string;
        name: string;
        description: string;
        category: string;
        price: number;
        stock: number;
        images: string[];
        isFeatured?: boolean;
    };
    onAddToCart?: (productId: string) => void;
    onAddToWishlist?: (productId: string) => void;
    isInWishlist?: boolean;
}

const ProductCard = ({ product, onAddToCart, onAddToWishlist, isInWishlist = false }: ProductCardProps) => {
    const navigate = useNavigate();
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const productImg = product.images[0];
    const imageUrl = productImg
        ? (productImg.startsWith('data:') || productImg.startsWith('http') ? productImg : `${API_URL}${productImg}`)
        : '/placeholder-product.svg';

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (product.stock === 0) return;

        setIsAddingToCart(true);
        try {
            await onAddToCart?.(product._id);
        } finally {
            setIsAddingToCart(false);
        }
    };

    const handleAddToWishlist = async (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsAddingToWishlist(true);
        try {
            await onAddToWishlist?.(product._id);
        } finally {
            setIsAddingToWishlist(false);
        }
    };

    return (
        <Card
            className="group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden"
            onClick={() => navigate(`/patient/marketplace/product/${product._id}`)}
        >
            <div className="relative aspect-square overflow-hidden bg-gray-100">
                <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-product.svg';
                    }}
                />
                {product.isFeatured && (
                    <Badge className="absolute top-2 left-2 bg-primary">Featured</Badge>
                )}
                {product.stock === 0 && (
                    <Badge className="absolute top-2 right-2 bg-red-500">Out of Stock</Badge>
                )}
                {product.stock > 0 && product.stock <= 5 && (
                    <Badge className="absolute top-2 right-2 bg-orange-500">Low Stock</Badge>
                )}

                {/* Wishlist button overlay */}
                <Button
                    size="icon"
                    variant={isInWishlist ? "default" : "secondary"}
                    className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={handleAddToWishlist}
                    disabled={isAddingToWishlist}
                >
                    <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-current' : ''}`} />
                </Button>
            </div>

            <CardContent className="p-4">
                <div className="mb-2">
                    <Badge variant="outline" className="text-xs">
                        {product.category}
                    </Badge>
                </div>
                <h3 className="font-semibold text-lg mb-1 line-clamp-1">{product.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">{product.description}</p>
                <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">Rs. {product.price.toFixed(2)}</span>
                    <span className="text-sm text-gray-500">{product.stock} in stock</span>
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-0">
                <Button
                    className="w-full"
                    onClick={handleAddToCart}
                    disabled={product.stock === 0 || isAddingToCart}
                >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {product.stock === 0 ? 'Out of Stock' : isAddingToCart ? 'Adding...' : 'Add to Cart'}
                </Button>
            </CardFooter>
        </Card>
    );
};

export default ProductCard;
