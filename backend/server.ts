import path from 'path'
import { User } from './models/user'
import express, { Request, Response } from 'express'

const cors = require('cors')
const app = express()
const cookieParser = require('cookie-parser')
const simonService = require('./service/simonsays.service')

app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'public')))
} else {
    const corsOptions = {
        origin: ['http://127.0.0.1:3000', 'http://localhost:3000'],
        credentials: true,
    }
    app.use(cors(corsOptions))
}

app.get('/api/simon-says', (req: Request, res: Response) => {
    const { cookies } = req
    let user!: User
    if (!cookies.user) {
        user = simonService.newUser()
        res.cookie('user', user)
    } else {
        user = cookies.user
        console.log('user:', user)
    }
    res.send({ bestScore: user.bestScore })
})

app.post('/api/simon-says', (req: Request, res: Response) => {
    const data = req.body
    const { user }: { [key: string]: User } = req.cookies
    simonService.saveUserScore(user._id, data.bestScore)
    const updatedUser = { ...user, bestScore: data.bestScore }
    res.cookie('user', updatedUser)
    res.sendStatus(200)
})

app.listen(3030, () => {
    console.log('Server is listening on port 3030!')
})
