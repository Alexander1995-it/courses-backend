import  express from 'express'

const app = express()
const port = process.env.PO || 3000

const HTTP_STATUSES = {
    OK200: 200,
    CREATED_201: 201,
    NO_CONTENT: 204,
    BAD_REQUEST_400: 400,
    NOT_FOUNT: 404
}

const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)

const bd = {
    courses: [
        {id: 1, title: 'Frontend'},
        {id: 2, title: 'Backend'},
        {id: 3, title: 'QA'},
        {id: 4, title: 'devops'}
    ]
}


app.get('/courses', (req, res) => {
    let courses = bd.courses
    if (req.query.title) {
        courses = courses.filter(el => {
            return el.title.indexOf(req.query.title as string) > -1
        })
    }
    res.json(courses)
})

app.get('/courses/:id', (req, res) => {
    const fountCourses = bd.courses.find(el => el.id === +req.params.id)
    if (!fountCourses) {
        res.sendStatus(404)
    } else {
        res.json(fountCourses)
    }
    res.json(bd.courses)
})

app.get('/courses/:id', (req, res) => {
    const fountCourses = bd.courses.find(el => el.id === +req.params.id)
    if (!fountCourses) {
        res.sendStatus(404)
    } else {
        res.json(fountCourses)
    }
})

app.put('/courses/:id', (req, res) => {
    const fountCourses = bd.courses.find(el => el.id === +req.params.id)
    if (!fountCourses) {
        res.sendStatus(404)
    } else {
        fountCourses.title = req.body.title
        res.sendStatus(204)
    }
})

app.delete('/courses/:id', (req, res) => {
    const fountCourses = bd.courses.filter(el => el.id !== +req.params.id)
    if (!fountCourses) {
        res.sendStatus(404)
    } else {
        res.json(fountCourses)
    }
    res.json(bd.courses)
})


app.post('/courses' , (req, res) => {
    if(!req.body.title) {
        res.sendStatus(400)
        return
    }
    const createdCourse = {
        id: +(new Date()),
        title: req.body.title
    }
    bd.courses.push(createdCourse)
    res
        .status(201)
        .json(createdCourse)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


