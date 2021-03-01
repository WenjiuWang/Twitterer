const config = require('config')
const User = require('../models/User');

const chai = require('chai')
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();

chai.use(chaiHttp);

describe('Test auth', () => {
    //clear data
    before((done) => { 
        User.remove({}, (err) => {
           done();
        });
    });
    
    describe('Register User Successfully', () => {
        it('it should register a new user', (done) => {
            let user = {
                name: "Test",
                email: "test1@gmail.com",
                password: "123456789"
            }

            chai.request(server)
            .post('/api/users/register')
            .send(user)
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.an('object');
                  res.body.should.have.property('token');
                  res.body.token.should.not.be.empty;
              done();
            });

        });
    });

    describe('Login User Successfully', () => {
        it('it should login the user', (done) => {
            let user = {
                email: "test1@gmail.com",
                password: "123456789"
            }

            chai.request(server)
            .post('/api/auth/login')
            .send(user)
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.an('object');
                  res.body.should.have.property('token');
                  res.body.token.should.not.be.empty;
              done();
            });

        });
    });

    describe('Register Using Same Email', () => {
        it('it should return an error msg', (done) => {
            let user = {
                name: "Test2",
                email: "test1@gmail.com",
                password: "123456789"
            }

            chai.request(server)
            .post('/api/users/register')
            .send(user)
            .end((err, res) => {
                  res.should.have.status(400);
                  res.body.should.be.an('object');
                  res.body.should.have.property('errors');
                  res.body.errors.should.not.be.empty;
              done();
            });

        });
    });




})