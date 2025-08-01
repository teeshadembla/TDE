import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import Connection from './db.js';
dotenv.config();

/* ---------------------------------------------------------------------------------------------------------------------------------------------- */
import userRouter from './Routes/userRouter.js';
import eventRouter  from './Routes/eventRouter.js';
import registerRouter from './Routes/registerRouter.js';
/* ----------------------------------------------------------------------------------------------------------------------------------------------- */

const app = express();
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ---------------------------------------------------------------------------------------------------------------------------------------------- */

app.use("/api/user", userRouter);
app.use("/api/events", eventRouter);
app.use("/api/user-event", registerRouter);
/* ---------------------------------------------------------------------------------------------------------------------------------------------- */
const PORT = process.env.PORT;

/* ---------------------------------------------------------------------------------------------------------------------------------------------- */

app.listen(PORT, ()=>{
    console.log(`Server is listening on ${PORT}`);
})

Connection();