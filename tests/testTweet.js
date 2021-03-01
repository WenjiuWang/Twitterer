const config = require('config')
const Post = require('../models/Post');
const User = require('../models/User');

const chai = require('chai')
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();

chai.use(chaiHttp);

var user1Token = '';
var user2Token =  '';

var postId = '';

describe('Test Tweet CRUD', () => {
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
                        Post.remove({}, (err) => {done();});
                  });
            });
        });
    });

    describe('Create New Tweet Successfully', () => {
        it('it should create a new tweet', (done) => {
            const post = {
                text: "This is a test new tweet"
            }
            chai.request(server)
            .post('/api/posts/')
            .set("x-auth-token", user1Token)
            .send(post)
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.an('object');
                  res.body.should.have.property('text');
                  res.body.text.should.equal("This is a test new tweet");
                  postId = res.body._id; 
              done();
            });

        });
    });

    describe('Edit Tweet Successfully', () => {
        it('it should edit the new created tweet', (done) => {
            const post = {
                text: "This tweet is updated"
            }
            chai.request(server)
            .post('/api/posts/' + postId.toString())
            .set("x-auth-token", user1Token)
            .send(post)
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.an('object');
                  res.body.should.have.property('msg');
                  res.body.msg.should.equal("Tweet updated");
              done();
            });

        });
    });
    
    describe('Read Tweet with ID Successfully', () => {
        it('it should read the updated tweet', (done) => {
            chai.request(server)
            .get('/api/posts/' + postId.toString())
            .set("x-auth-token", user1Token)
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.an('object');
                  res.body.should.have.property('text');
                  res.body.text.should.equal("This tweet is updated");
              done();
            });

        });
    });

    
    describe('Delete Tweet with ID Successfully', () => {
        it('it should delete the updated tweet', (done) => {
            chai.request(server)
            .delete('/api/posts/' + postId.toString())
            .set("x-auth-token", user1Token)
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.an('object');
                  res.body.should.have.property('msg');
                  res.body.msg.should.equal("Tweet removed");
              done();
            });

        });
    });


});