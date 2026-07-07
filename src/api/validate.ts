import type {NextFunction, Request, Response} from 'express'
import errorHandler from './error.js'

type Data = {
  body: string
}
export const handleValidate = async (req: Request, res: Response, next: NextFunction)=>{
    const body: Data = req.body
    const spacialWords = ['kerfuffle', 'sharbert', 'fornax']
    

    if(body.body.length >= 140){
        res.status(400).send(errorHandler)
    } else{
        const words = body.body.split(' ')
        const cleanBody = words.map(word => spacialWords.includes(word.toLowerCase()) ? '****' : word).join(' ')

        res.status(200).send({cleanedBody: cleanBody})
    }
}