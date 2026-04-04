import request from 'supertest';
import mongoose from 'mongoose';
import { createTestApp, sampleProducts, mockStripe, mockEmailService } from '../helpers';

// Activate mocks — MUST be called before route imports
mockStripe();
mockEmailService();

import marketplaceRoutes from '../../routes/marketplace.routes';
import Product from '../../models/Product';

const app = createTestApp(marketplaceRoutes, '/api/marketplace');

describe('UC-6: Explore Market Place', () => {
    let vitaminCId: string;

    beforeEach(async () => {
        for (const productData of sampleProducts) {
            const product = new Product(productData);
            await product.save();
            if (productData.name === 'Vitamin C Supplement') {
                vitaminCId = product._id.toString();
            }
        }
    });

    // ── Unit: getAllProducts ──

    it('should successfully fetch all active products (default without filters)', async () => {
        const response = await request(app).get('/api/marketplace/products');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.length).toBe(3);
        const names = response.body.data.map((p: any) => p.name);
        expect(names).not.toContain('Discontinued Wheelchair');
    });

    it('should successfully paginate the products', async () => {
        const response = await request(app).get('/api/marketplace/products?limit=2&page=1');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.length).toBe(2);
        expect(response.body.pagination.total).toBe(3);
        expect(response.body.pagination.pages).toBe(2);
    });

    it('should successfully filter products by searching keywords', async () => {
        const response = await request(app).get('/api/marketplace/products?search=monitor');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.length).toBe(1);
        expect(response.body.data[0].name).toBe('Blood Pressure Monitor');
    });

    it('should successfully filter products by category', async () => {
        const response = await request(app).get('/api/marketplace/products?category=First Aid');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.length).toBe(1);
        expect(response.body.data[0].name).toBe('Adhesive Bandages');
    });

    it('should handle sorting by price ascending correctly', async () => {
        const response = await request(app).get('/api/marketplace/products?sortBy=price-asc');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        const prices = response.body.data.map((p: any) => p.price);
        expect(prices[0]).toBe(5);
        expect(prices[1]).toBe(15);
        expect(prices[2]).toBe(50);
    });

    // ── Unit: getProductById ──

    it('should successfully fetch a specific product by its ID', async () => {
        const response = await request(app).get(`/api/marketplace/products/${vitaminCId}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.name).toBe('Vitamin C Supplement');
    });

    it('should fail with 404 if requesting an unknown product ID', async () => {
        const fakeId = new mongoose.Types.ObjectId().toString();
        const response = await request(app).get(`/api/marketplace/products/${fakeId}`);

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Product not found');
    });

    // ── Unit: getFeaturedProducts ──

    it('should successfully fetch only featured products', async () => {
        const response = await request(app).get('/api/marketplace/featured');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.length).toBe(2);
        const isFeaturedList = response.body.data.map((p: any) => p.isFeatured);
        expect(isFeaturedList).not.toContain(false);
    });
});
