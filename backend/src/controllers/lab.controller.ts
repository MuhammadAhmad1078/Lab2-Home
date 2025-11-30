import { Request, Response } from 'express';
import Lab from '../models/Lab';
import Test from '../models/Test';

// ============================================
// GET AVAILABLE LABS (Labs that have configured tests)
// ============================================
export const getAvailableLabs = async (req: Request, res: Response): Promise<void> => {
    try {
        const { testId } = req.query;

        const query: any = {
            isActive: true,
            isVerified: true,
            hasConfiguredTests: true,
        };

        // If testId is provided, filter labs that offer this test
        if (testId) {
            query.availableTests = testId;
        }

        const labs = await Lab.find(query)
            .populate('availableTests', 'name category basePrice reportDeliveryTime')
            .select('labName email phone labAddress operatingHours availableTests')
            .sort({ labName: 1 });

        res.status(200).json({
            success: true,
            count: labs.length,
            data: labs,
        });
    } catch (error: any) {
        console.error('Get available labs error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch available labs',
            error: error.message,
        });
    }
};

// ============================================
// GET LAB'S AVAILABLE TESTS
// ============================================
export const getLabTests = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const lab = await Lab.findById(id).populate('availableTests', 'name description category basePrice reportDeliveryTime preparationInstructions sampleType');

        if (!lab) {
            res.status(404).json({
                success: false,
                message: 'Lab not found',
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: {
                labName: lab.labName,
                availableTests: lab.availableTests,
                hasConfiguredTests: lab.hasConfiguredTests,
            },
        });
    } catch (error: any) {
        console.error('Get lab tests error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch lab tests',
            error: error.message,
        });
    }
};

// ============================================
// UPDATE LAB'S AVAILABLE TESTS (Lab only)
// ============================================
export const updateLabTests = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { testIds } = req.body;

        if (!testIds || !Array.isArray(testIds)) {
            res.status(400).json({
                success: false,
                message: 'Test IDs array is required',
            });
            return;
        }

        const lab = await Lab.findById(id);

        if (!lab) {
            res.status(404).json({
                success: false,
                message: 'Lab not found',
            });
            return;
        }

        // Verify all test IDs exist
        const tests = await Test.find({ _id: { $in: testIds }, isActive: true });
        if (tests.length !== testIds.length) {
            res.status(400).json({
                success: false,
                message: 'One or more test IDs are invalid or inactive',
            });
            return;
        }

        // Update lab's available tests
        lab.availableTests = testIds;
        lab.hasConfiguredTests = testIds.length > 0;

        await lab.save();

        // Populate and return
        await lab.populate('availableTests', 'name description category basePrice reportDeliveryTime');

        res.status(200).json({
            success: true,
            message: 'Lab tests updated successfully',
            data: {
                labName: lab.labName,
                availableTests: lab.availableTests,
                hasConfiguredTests: lab.hasConfiguredTests,
            },
        });
    } catch (error: any) {
        console.error('Update lab tests error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update lab tests',
            error: error.message,
        });
    }
};

// ============================================
// GET LABS BY TEST (Find labs offering a specific test)
// ============================================
export const getLabsByTest = async (req: Request, res: Response): Promise<void> => {
    try {
        const { testId } = req.params;

        // Verify test exists
        const test = await Test.findById(testId);
        if (!test) {
            res.status(404).json({
                success: false,
                message: 'Test not found',
            });
            return;
        }

        const labs = await Lab.find({
            isActive: true,
            isVerified: true,
            hasConfiguredTests: true,
            availableTests: testId,
        })
            .select('labName email phone labAddress operatingHours')
            .sort({ labName: 1 });

        res.status(200).json({
            success: true,
            count: labs.length,
            data: {
                test: {
                    id: test._id,
                    name: test.name,
                    category: test.category,
                    basePrice: test.basePrice,
                },
                labs,
            },
        });
    } catch (error: any) {
        console.error('Get labs by test error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch labs',
            error: error.message,
        });
    }
};
