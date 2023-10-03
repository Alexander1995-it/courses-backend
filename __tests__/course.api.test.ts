import request from 'supertest'
import {app, HTTP_STATUSES} from '../src'

describe('/courses', () => {

    beforeAll(async () => {
        await request(app).delete('/__test__/data')
    })

    it('should return 200 and empty array', async () => {
        await request(app)
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, [])
    })

    it('should return 404 for existing course', async () => {
        await request(app)
            .get('/courses/333')
            .expect(404)
    })

    it(`should'nt  create course with incorrect input data`, async () => {
        await request(app)
            .post('/courses')
            .send({title: ''})
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get('/courses')
            .expect(200, [])
    })

    let createCourse: any = null

    it(`should  create course with correct input data`, async () => {
        const createResponse = await request(app)
            .post('/courses')
            .send({title: 'it-incubator'})
            .expect(HTTP_STATUSES.CREATED_201)

        createCourse = createResponse.body
        expect(createCourse).toEqual({
            id: expect.any(Number),
            title: 'it-incubator'
        })
        await request(app)
            .get('/courses')
            .expect(200, [createCourse])
    })

    it(`should  update course with correct input data`, async () => {
        await request(app)
            .put(`/courses/` + createCourse.id)
            .send({title: ''})
            .expect(HTTP_STATUSES.BAD_REQUEST_400)
    })

})