import express from 'express';
import * as controller from '../../controllers/Feedback/packageFeedbackController.js';

const router = express.Router();

// Create router links
router.get('/package-feedbacks', controller.getFeedbacks);
router.get('/selected-package-feedback', controller.getSelectedFeedback);
router.post('/create-package-feedback', controller.addFeedback);
router.post('/update-package-feedback', controller.updateFeedback);
router.post('/delete-package-feedback', controller.deleteFeedback);
router.get('/get-package-feedbacks-maxid', controller.getMaxId);
router.get('/by-package', controller.getFeedbacksByPackage);

// New admin route
router.post('/admin/delete-package-feedback', controller.admindeleteFeedback)

export default router;
