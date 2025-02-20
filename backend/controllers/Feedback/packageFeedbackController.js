import Feedback from '../../models/Feedback/packageFeedback.js';

// Get all Feedback Details
export const getFeedbacks = async (req, res, next) => {
    try {
        const response = await Feedback.find().sort({ pfDate: -1 });
        res.json({ response });
    } catch (error) {
        console.error('Error fetching Feedback data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get Feedbacks by Package Name
export const getFeedbacksByPackage = async (req, res, next) => {
    const { pName } = req.query;

    try {
        let query = {};
        if (pName) {
            query.pName = pName;
        }
        const response = await Feedback.find(query).sort({ pfDate: -1 });
        res.json({ response });
    } catch (error) {
        console.error('Error fetching Feedback data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get Selected Feedback
export const getSelectedFeedback = async (req, res, next) => {
    const { pfID } = req.query;

    try {
        if (pfID) {
            const response = await Feedback.findOne({ pfID });
            if (response) {
                res.json({ response });
            } else {
                res.status(404).json({ message: 'Feedback not found' });
            }
        } else {
            const response = await Feedback.find();
            res.json({ response });
        }
    } catch (error) {
        console.error('Error fetching Feedback data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Create new Feedback
export const addFeedback = async (req, res, next) => {
    console.log('Received data:', req.body);
    const { pfID, cusName, cusEmail, pName, pfType, pfRate, pfNote, pfDate } = req.body;

    const feedback = new Feedback({
        pfID,
        cusName,
        cusEmail,
        pName,
        pfType,
        pfRate,
        pfNote,
        pfDate,
    });

    try {
        const response = await feedback.save();
        res.status(201).json({ response });
    } catch (error) {
        console.error('Error adding Feedback:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Update existing Feedback Details
export const updateFeedback = async (req, res, next) => {
    const { pfID, pfRate, pfNote, cusEmail } = req.body;  // Get cusEmail from request body

    try {
        const feedback = await Feedback.findOne({ pfID });
        
        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        // Check if the provided email matches the feedback owner's email
        if (feedback.cusEmail !== cusEmail) {
            return res.status(403).json({ message: 'Not authorized to update this feedback' });
        }

        // Only update rating and note
        feedback.pfRate = pfRate;
        feedback.pfNote = pfNote;

        const updatedFeedback = await feedback.save();
        res.json(updatedFeedback);
    } catch (error) {
        console.error('Error updating Feedback:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Delete existing Feedback
export const deleteFeedback = async (req, res, next) => {
    const { pfID, cusEmail } = req.body;  // Get cusEmail from request body
    
    try {
        const feedback = await Feedback.findOne({ pfID });
        
        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        // Check if the provided email matches the feedback owner's email
        if (feedback.cusEmail !== cusEmail) {
            return res.status(403).json({ message: 'Not authorized to delete this feedback' });
        }

        await Feedback.deleteOne({ pfID });
        res.json({ message: 'Feedback deleted successfully' });
    } catch (error) {
        console.error('Error deleting Feedback:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Controller to delete feedback by ID
export const admindeleteFeedback = async (req, res) => {
    const { pfID } = req.body; // Expect pfID in the request body
    try {
        const feedback = await PackageFeedback.findOneAndDelete({ pfID: pfID });
        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }
        res.status(200).json({ message: 'Feedback deleted successfully' });
    } catch (error) {
        console.error('Error deleting feedback:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


// Get max Feedback ID
export const getMaxId = async (req, res, next) => {
    try {
        const response = await Feedback.find({}, { pfID: 1 }).sort({ pfID: -1 }).limit(1);
        const maxId = response.length > 0 ? response[0].pfID : 0;
        res.json({ maxId });
    } catch (error) {
        console.error('Error fetching max ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
