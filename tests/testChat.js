const config = require('config')
const Post = require('../models/Post');
const User = require('../models/User');

const chai = require('chai')
const chaiHttp = require('chai-http');
const server = require('../server');
const Message = require('../models/Message');
const should = chai.should();

chai.use(chaiHttp);

var user1Token = '';
var user2Token =  '';
var user2ID = '';


describe('Test Chat', () => {
    //remove users
    before((done) => {
        User.remove({}, (err) => {
            let user1 = {
                name: "TweetTestUser1",
                email: "tweetcrud1@gmail.com",
                password: "123456789"
            }

            let user2 = {
                name: "TweetTestUser2",
                email: "tweetcrud2@gmail.com",
                password: "123456789"
            }

            chai.request(server)
            .post('/api/users/register')
            .send(user1)
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.an('object');
                  res.body.should.have.property('token');
                  res.body.token.should.not.be.empty;
                  user1Token = res.body.token;
                  chai.request(server)
                  .post('/api/users/register')
                  .send(user2)
                  .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.an('object');
                        res.body.should.have.property('token');
                        res.body.token.should.not.be.empty;
                        user2Token = res.body.token;
                        Message.remove({}, (err) => {done();});
                  });
            });
        });
    });

    describe('Send New Message To Another User Successfully', () => {
        it('it should get the id of the another user', (done) => {
            chai.request(server)
            .get('/api/auth/')
            .set("x-auth-token", user2Token)
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.an('object');
                  res.body.should.have.property('_id');
                  user2ID = res.body._id;
              done();
            });
        });

        
        it('it should send a new message to another user', (done) => {
            const content = {
                text: "This is a test message"
            }
            chai.request(server)
            .post('/api/message/' + user2ID)
            .set("x-auth-token", user1Token)
            .send(content)
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.an('object');
                  res.body.should.have.property('content');
                  res.body.content.should.equal("This is a test message");
              done();
            });
       });
    });
    
    describe('Read Message with ID Successfully', () => {
        it('it should read the updated tweet', (done) => {
            chai.request(server)
            .get('/api/message/' + user2ID)
            .set("x-auth-token", user1Token)
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.an('array');
                  res.body.should.have.lengthOf(1);
              done();
            });

        });
    });

});