import { describe, before, after, it } from 'node:test'
import { strictEqual, deepStrictEqual, ok } from 'node:assert'
const BaseUrl = 'http://localhost:3000'

let _globalToken 

describe('Api Workflow', () => {
    let _server = {}

    before(async () => {
        _server = (await import ('./api.js')).app

        await new Promise(resolve => _server.once('listening', resolve))
    })

    after(done => _server.close(done))

    it('Deveria negar o acesso, pois é necessário passar users e password', async () => {
        let data = {
            user: 'usurio',
            password: ''
        }

        const request = await fetch(`${BaseUrl}/login`,{
            method: 'POST',
            body: JSON.stringify(data)
        })

        strictEqual(request.status, 401)

        const response = await request.json()
        deepStrictEqual(response, {error: 'user invalid!'})
    })

    it('Deveria logar com sucesso', async () => {
        const data = {
            user: 'usurio',
            password: '123'
        }

        const request = await fetch(`${BaseUrl}/login`, {
            method: 'POST',
            body: JSON.stringify(data)
        })

            strictEqual(request.status, 200)
            const response = await request.json()

            ok(response.token, 'token está presente')
            _globalToken = response.token
    })
    it('Deveria não autorizar o acesso pois é nescessário passar o token', async () => {
        const headers = {authorization: ''}

        const request = await fetch(`${BaseUrl}`, {
            headers
        })
        deepStrictEqual(request.status, 400)

        const response = await request.json()
        

        deepStrictEqual(response, {error: 'Token inválido'})
    })
    it('Deveria deixar passar pois o token é valido', async () => {
        const request = await fetch(`${BaseUrl}/`, {
            method: 'GET',
            headers: {
                authorization: _globalToken
            }
        })

        deepStrictEqual(request.status, 200)

        const response = await request.json()

        deepStrictEqual(response, {result: 'Olá bem-vindo'})
    })
})