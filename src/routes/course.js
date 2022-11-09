const express = require('express');
const router = express.Router();

const { courseController } = require('../controllers');

// Current path: /
router.get('/', courseController.index);
router.post('/course/create', courseController.create);
router.post('/course/update', courseController.update);
router.post('/course/delete', courseController.delete);
router.post('/course/material/create', courseController.createMaterial);
router.post('/course/material/update', courseController.updateMaterial);
router.post('/course/material/delete', courseController.deleteMaterial);
router.post('/course/examination/create', courseController.createExamination);
router.post('/course/examination/update', courseController.updateExamination);
router.post('/course/examination/delete', courseController.deleteExamination);
router.get('/:id', courseController.detail);
router.get('/:id/m/:idx', courseController.materialView);
router.get('/:id/e/:idx', courseController.examinationView);

module.exports = router;
