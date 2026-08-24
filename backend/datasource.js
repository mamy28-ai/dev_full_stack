import { Pool } from "pg";
import dotenv from 'dotenv';

dotenv.config();

export default function createPool(){
    return new Pool({
        connectionString:process.env.DATABASE_URL,
    });
}