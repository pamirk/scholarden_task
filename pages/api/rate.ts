// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import jwt from "jsonwebtoken";

type Data = {
    rate?: any,
    message?: string
}
const fixerUrl = `http://data.fixer.io/api/latest?access_key=${process.env.FIXER_API}&symbols=`

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    try {
        const {username}: any = jwt.verify(req.headers.authorization!.split(' ')[1], '123');
    } catch (e) {
        return res.status(400).json({message: "invalid token"})
    }

    const rate: any = req.query.rate
    if (!rate) return res.status(200).json({message: 'Rate not provided'})

    let rateResponse: any = await fetch(fixerUrl + rate).then(res => res.json())

    res.status(200).json({rate: rateResponse.rates[rate]})
}
