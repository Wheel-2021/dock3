import express from 'express'
const app: express.Express = express()
const port = 3000
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.header('Access-Contoroll-Allow-Origin', '*')
  res.header('Access-Contoroll-Allow-Methods', '*')
  res.header('Access-Contoroll-Allow-Headers', '*')
  next()
})

app.listen(port, () => {
  console.log('Start on port 3000')
})

type User = {
  id: number
  name: string
  email: string
}

const users: User[] = [
    { id: 1, name: "User1", email: "user1@test.local" },
    { id: 2, name: "User2", email: "user2@test.local" },
    { id: 3, name: "User3", email: "user3@test.local" }
]

app.get('/', (req: express.Request, res: express.Response) => {
  res.send('Hello World')
})

app.get('/users', (req: express.Request, res: express.Response) => {
  res.send(JSON.stringify(users))
})

// https://qiita.com/zaburo/items/69726cc42ef774990279
