import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import todoRoutes from './routes/todo';
import cors from 'cors';
dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    return res.status(200).json({message:"hello!"})
})
app.use('/user', authRoutes);
app.use('/todo',todoRoutes);

app.listen(PORT, () => {
    console.log(`app is listening at ${PORT}`);
})