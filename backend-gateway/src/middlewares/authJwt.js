import jwt from 'jsonwebtoken';
import {Usuario} from '../model/autenticacion/index.js'

export const verifyToken = (req, res, next) => {
    const token = req.headers['x-auth-token'];

    if(!token) {return res.status(401).send('No token provided');}
    console.log(token);

    const decode = jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {})

    const user = await

    next();
}