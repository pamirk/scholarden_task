// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import fetch from 'node-fetch'
import jwt from "jsonwebtoken";

type Data = {
    data?: any
    message: string
}

const countriesUrl = 'https://restcountries.com/v3.1/name/'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    try {
        const {username}: any = jwt.verify(req.headers.authorization!.split(' ')[1], '123');
    } catch (e) {
        return res.status(400).json({message: "invalid token"})
    }

    const {name} = req.query
    if (!name) return res.status(200).json({message: 'Name not provided'})
    let countriesResponse: any = await fetch(countriesUrl + name)
        .then(res => res.json())
    if (countriesResponse.status === 404) {
        return res.status(404).json({message: countriesResponse.message})
    }

    let data: any = []
    for (const country of countriesResponse) {
        data.push({
            officialName: country.name.official,
            population: country.population,
            currency: Object.keys(country.currencies)[0],
        })
    }
    res.status(200).json({data, message: 'success'})
}
