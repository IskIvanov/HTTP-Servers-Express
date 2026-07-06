import type {NextFunction, Request, Response} from 'express'

type Data = {
  body: string
}
export const handleValidate = async (req: Request, res: Response, next: NextFunction)=>{

    let body = ''

    // 2. Listen for data events
    req.on("data",(chunk: Data)=>{
        body += chunk
    })
    

    req.on("end",()=>{
        try{
        const parsedBody: Data = JSON.parse(body)
        console.log("Parsed Body", parsedBody)
         if(parsedBody.body.length >= 140){
            res.status(400).send({error: "Chirp is too long"})
         } else {
            res.status(200).send({valid: true})
         }
        } catch(error){
            res.status(400).send({error: "Something went wrong"})
        }
    })
    
}