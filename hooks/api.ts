import cookie from "js-cookie"

if (!process.env.NEXT_PUBLIC_BASE_URL) {
    throw new Error("BASE_URL for API not set")
}

const BASE_URL: string = process.env.NEXT_PUBLIC_BASE_URL

//returns true for paths that do require token to access
const isDataApi = (path: string): boolean => {
    return path.startsWith(`/api/name`) ||
        path.startsWith(`/api/rate`)
}

let apiToken: string | undefined


export async function apiGet<T>(path: string): Promise<T> {
    const token = isDataApi(path) ? cookie.get('token') || "" : ""
    const response = await fetch(BASE_URL + path, {
        method: "get",
        headers: {
            Authorization: "Bearer " + token,
        },
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message)
    }

    return data
}

export async function apiPost<T>(path: string, body: any): Promise<T> {
    const token = isDataApi(path) ? apiToken || "" : ""

    const headers: {
        Accept: string
        "Content-Type": string
        Authorization?: string
    } = {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
    }

    const response = await fetch(BASE_URL + path, {
        method: "post",
        headers,
        body: JSON.stringify(body),
    })
    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message)
    }

    return data
}

