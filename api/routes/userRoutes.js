import express from 'express'
import { deleteUser, updateUser, getUserListing } from '../controller/userController.js'
import { verifyToken } from '../utils/verifyUser.js'

const router = express.Router()

router.put('/update/:id', verifyToken, updateUser)
router.delete('/delete/:id', verifyToken, deleteUser)
router.get('/listings/:id', verifyToken, getUserListing)

export default router