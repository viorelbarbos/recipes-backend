import express, { Request, Response } from 'express';
import IResponseStructure from '../utils/models/generic/IResponseStructure';

const router = express.Router();

router.get('/', (req: Request, res: Response<IResponseStructure>) => {
    res.status(200).json({
        success: true,
        message: `You've reached the v1 API Root Controller!`,
    });
});

export default router;
