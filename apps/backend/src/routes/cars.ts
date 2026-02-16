import { Router } from 'express';
import { db } from '../config/firebase';

const router = Router();

// GET /api/cars
router.get('/', async (req, res) => {
    try {
        const carsSnapshot = await db.collection('cars').get();
        const cars = carsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        res.json(cars);
    } catch (error) {
        console.error('Error fetching cars:', error);
        res.status(500).json({ error: 'Failed to fetch cars' });
    }
});

// GET /api/cars/:id
router.get('/:id', async (req, res) => {
    try {
        const carDoc = await db.collection('cars').doc(req.params.id).get();
        if (!carDoc.exists) {
            res.status(404).json({ error: 'Car not found' });
            return
        }
        res.json({ id: carDoc.id, ...carDoc.data() });
    } catch (error) {
        console.error('Error fetching car:', error);
        res.status(500).json({ error: 'Failed to fetch car' });
    }
});

export default router;
