import Router from 'express';

import { RegisterUser } from '../Controllers/User.controllers.js';

import {upload} from '../Middlewares/multer.middleware.js'


const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: 'avatar',
            maxCount: 1
        },
        {
            name: 'coverImage',
            maxCount: 1
        }
    ]),
    RegisterUser)


export default router