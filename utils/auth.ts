import Router from "next/router"

export function redirectUser(ctx: any, location: any) {
    if (ctx.req) {
        ctx.res.writeHead(302, { Location: location })
        ctx.res.end()
    } else {
        Router.push(location)
    }
}
