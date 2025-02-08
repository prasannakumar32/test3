const express = require('express');
const router = express.Router();
const Storage = require('./models/Storage');

// Production APIs
// Save data
router.post('/production/save', async (req, res) => {
    try {
        const { key, data } = req.body;
        if (!key || !data) {
            return res.status(400).json({ error: 'Key and data are required' });
        }

        // Check if key already exists
        let storage = await Storage.findOne({ key, environment: 'production' });
        if (storage) {
            return res.status(400).json({ error: 'Key already exists in production' });
        }

        storage = await Storage.create({
            key,
            data,
            environment: 'production'
        });

        res.status(201).json({ message: 'Data saved successfully in production', key });
    } catch (error) {
        console.error('Error saving production data:', error);
        res.status(500).json({ error: 'Failed to save production data' });
    }
});

// Get data
router.get('/production/get/:key', async (req, res) => {
    try {
        const { key } = req.params;
        const storage = await Storage.findOne({ key, environment: 'production' });
        
        if (!storage) {
            return res.status(404).json({ error: 'Production data not found' });
        }

        res.status(200).json({ data: storage.data });
    } catch (error) {
        console.error('Error retrieving production data:', error);
        res.status(500).json({ error: 'Failed to retrieve production data' });
    }
});

// Edit/Update data
router.put('/production/edit/:key', async (req, res) => {
    try {
        const { key } = req.params;
        const { data } = req.body;
        
        if (!data) {
            return res.status(400).json({ error: 'Data is required' });
        }

        const storage = await Storage.findOneAndUpdate(
            { key, environment: 'production' },
            { data, updatedAt: Date.now() },
            { new: true }
        );

        if (!storage) {
            return res.status(404).json({ error: 'Production data not found' });
        }

        res.status(200).json({ message: 'Production data updated successfully', key });
    } catch (error) {
        console.error('Error updating production data:', error);
        res.status(500).json({ error: 'Failed to update production data' });
    }
});

// Delete data
router.delete('/production/delete/:key', async (req, res) => {
    try {
        const { key } = req.params;
        const storage = await Storage.findOneAndDelete({ key, environment: 'production' });

        if (!storage) {
            return res.status(404).json({ error: 'Production data not found' });
        }

        res.status(200).json({ message: 'Production data deleted successfully' });
    } catch (error) {
        console.error('Error deleting production data:', error);
        res.status(500).json({ error: 'Failed to delete production data' });
    }
});

// Consumption APIs
// Save data
router.post('/consumption/save', async (req, res) => {
    try {
        const { key, data } = req.body;
        if (!key || !data) {
            return res.status(400).json({ error: 'Key and data are required' });
        }

        // Check if key already exists
        let storage = await Storage.findOne({ key, environment: 'consumption' });
        if (storage) {
            return res.status(400).json({ error: 'Key already exists in consumption' });
        }

        storage = await Storage.create({
            key,
            data,
            environment: 'consumption'
        });

        res.status(201).json({ message: 'Data saved successfully in consumption', key });
    } catch (error) {
        console.error('Error saving consumption data:', error);
        res.status(500).json({ error: 'Failed to save consumption data' });
    }
});

// Get data
router.get('/consumption/get/:key', async (req, res) => {
    try {
        const { key } = req.params;
        const storage = await Storage.findOne({ key, environment: 'consumption' });
        
        if (!storage) {
            return res.status(404).json({ error: 'Consumption data not found' });
        }

        res.status(200).json({ data: storage.data });
    } catch (error) {
        console.error('Error retrieving consumption data:', error);
        res.status(500).json({ error: 'Failed to retrieve consumption data' });
    }
});

// Edit/Update data
router.put('/consumption/edit/:key', async (req, res) => {
    try {
        const { key } = req.params;
        const { data } = req.body;
        
        if (!data) {
            return res.status(400).json({ error: 'Data is required' });
        }

        const storage = await Storage.findOneAndUpdate(
            { key, environment: 'consumption' },
            { data, updatedAt: Date.now() },
            { new: true }
        );

        if (!storage) {
            return res.status(404).json({ error: 'Consumption data not found' });
        }

        res.status(200).json({ message: 'Consumption data updated successfully', key });
    } catch (error) {
        console.error('Error updating consumption data:', error);
        res.status(500).json({ error: 'Failed to update consumption data' });
    }
});

// Delete data
router.delete('/consumption/delete/:key', async (req, res) => {
    try {
        const { key } = req.params;
        const storage = await Storage.findOneAndDelete({ key, environment: 'consumption' });

        if (!storage) {
            return res.status(404).json({ error: 'Consumption data not found' });
        }

        res.status(200).json({ message: 'Consumption data deleted successfully' });
    } catch (error) {
        console.error('Error deleting consumption data:', error);
        res.status(500).json({ error: 'Failed to delete consumption data' });
    }
});

// Get all keys
router.get('/production/keys', async (req, res) => {
    try {
        const storageItems = await Storage.find({ environment: 'production' }, 'key');
        const keys = storageItems.map(item => item.key);
        res.status(200).json({ keys });
    } catch (error) {
        console.error('Error retrieving production keys:', error);
        res.status(500).json({ error: 'Failed to retrieve production keys' });
    }
});

router.get('/consumption/keys', async (req, res) => {
    try {
        const storageItems = await Storage.find({ environment: 'consumption' }, 'key');
        const keys = storageItems.map(item => item.key);
        res.status(200).json({ keys });
    } catch (error) {
        console.error('Error retrieving consumption keys:', error);
        res.status(500).json({ error: 'Failed to retrieve consumption keys' });
    }
});

module.exports = router;
