import express from 'express'
import {
  createTypeDisease,
  getTypeDisease,
} from '../Controller/TypeDiseaseController.js'

const router = express.Router()

router.post('/', getTypeDisease)
router.post('/create', createTypeDisease)

export default router
