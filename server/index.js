import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import Connection from './db.js';
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config();

/* ---------------------------------------------------------------------------------------------------------------------------------------------- */
import userRouter from './Routes/userRouter.js';
import eventRouter  from './Routes/eventRouter.js';
import registerRouter from './Routes/registerRouter.js';
import fellowshipRouter from './Routes/fellowshipRoutes.js';
import fellowshipRegistrationRouter from './Routes/fellowshipRegistrationRouter.js';
import postRouter from "./Routes/postRouter.js";
import commentRouter from './Routes/commentRouter.js';
import researchPaperRouter from './Routes/researchPaperRouter.js';
/* ----------------------------------------------------------------------------------------------------------------------------------------------- */

const app = express();
app.use(cookieParser());
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? [process.env.FRONTEND_URL, 'https://tde-kict.vercel.app'] 
        : ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ---------------------------------------------------------------------------------------------------------------------------------------------- */
 
app.use("/api/user", userRouter);
app.use("/api/events", eventRouter);
app.use("/api/user-event", registerRouter);
app.use("/api/fellowship", fellowshipRouter);
app.use("/api/fellowship-registration", fellowshipRegistrationRouter);
app.use("/api/community", postRouter);
app.use("/api/comment", commentRouter); 
app.use("/api/documents", researchPaperRouter);

/* ---------------------------------------------------------------------------------------------------------------------------------------------- */

// Serve static files from dist directory
app.use(express.static(path.join(__dirname, 'dist')));

app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

/* ---------------------------------------------------------------------------------------------------------------------------------------------- */

const PORT = process.env.PORT;

app.listen(PORT, ()=>{
    console.log(`Server is listening on ${PORT}`);
})

Connection();