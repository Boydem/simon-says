import { User } from '../models/user'

const SCORES_DB = require('../data/score.json')
const utilService = require('../service/util.service')
const fs = require('fs')

module.exports = {
    newUser,
    saveUserScore,
}

function newUser(): User {
    const user = {
        _id: utilService.makeId(),
        bestScore: 0,
    }
    SCORES_DB.push(user)
    _writeScoresToFile()
    return user
}

function saveUserScore(userId: string, newScore: number) {
    const user = SCORES_DB.find((newScore: { _id: string }) => newScore._id === userId)
    user.bestScore = newScore
    _writeScoresToFile()
}

function _writeScoresToFile() {
    return new Promise((res, rej) => {
        const data = JSON.stringify(SCORES_DB, null, 2)
        fs.writeFile('data/score.json', data, (err: any) => {
            if (err) return rej(err)
            res('')
        })
    })
}
