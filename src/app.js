 import cookieParser from 'cookies-parser';
 import cors from 'cors'
 import exprss from 'express'


const app = exprss();

app.use(cors());

export {app};