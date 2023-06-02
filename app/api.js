import { once } from 'node:events'
import { createServer } from 'node:http'

import JWT from 'jsonwebtoken'

let VALID = {
    user: 'usurio',
    password: '123'
}

const jwtKey = 'abc123'

function isValidHeader(headers){
  try{
    const auth = headers.authorization.replace(/bearer\s/ig, '')
    JWT.verify(auth, jwtKey)
    return true
  }catch(e){
    return false
  }

}

async function loginRoute(request, response){
    const {user, password} = JSON.parse(await once(request, 'data'))
    
    if(VALID.user !== user || VALID.password !== password){
        response.writeHead(401)
        response.end(JSON.stringify({error: 'user invalid!'}))
        return  
    }

    const token = JWT.sign({user, msg: 'Uepa'}, jwtKey)
    response.end(JSON.stringify({token}))
}

async function handler(request, response){
    if(request.url === '/login' && request.method === 'POST'){
        return loginRoute(request, response)
    }
    if(!isValidHeader(request.headers)){
        response.writeHead(400)
        return response.end(JSON.stringify({error: 'Token inválido'}))
    }

    response.end(JSON.stringify({result: 'Olá bem-vindo'}))
}

const app = createServer(handler)
.listen(3000, () => console.log('Listening at 3000'))

export {app}