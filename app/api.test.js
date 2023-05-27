import { describe, before, after, it } from 'node:test'
import { strictEqual, deepStrictEqual, ok } from 'node:assert'
const BaseUrl = 'http://localhost:3000'


describe('Api Workflow', () => {
    let _server = {}
    let _globalToken 

    before(async () => {
        _server = (await import ('./api.js')).app

        await new Promise(resolve => _server.once('listening', resolve))
    })

    after(done => _server.close(done))

    it('nescessario enviar users e password', async () => {
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

    it('Sucesso no login', async () => {
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
    it('É nescessario enviar o token de validação', async () => {
        const request = await fetch(BaseUrl, {
            method: 'GET',
            headers: {
                authorization: ''
            }
        })

        strictEqual(request.status, 400)

        const response = await request.json()

        deepStrictEqual(response, {error: 'Token inválido'})
    })
})