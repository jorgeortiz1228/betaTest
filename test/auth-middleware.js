//npm install --save-dev mocha chai
//npm install --save-dev sinon
//to use stubs

const expect = require('chai').expect;
const jwt = require('jsonwebtoken');
const sinon = require('sinon');

const authMiddleware = require('../middleware/is-auth');

describe('Auth middleware', function(){
    it('should throw an error if no authorization header is present', function() {
        const req = {
            get: function(headerName) {
                //headerName here doesnt make a difference
                //we don't even have to set it
                return null;
            }
        };
        expect(authMiddleware.bind(this, req, {}, () => {})).to.throw('Not authenticated .');
    });
    
    it('should throw an error if authorization header is only one string', function() {
        const req = {
            get: function(headerName) {
                //headerName here doesnt make a difference
                //we don't even have to set it
                return 'xyz';
            }
        };
        expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
    });

    it('should yield a userId after decoding token', function() {
        const req = {
            get: function(headerName) {
                return 'Bearer xyz';
            }
        };
        sinon.stub(jwt, 'verify');
        jwt.verify.returns({ userId: 'abc' });
        // jwt.verify = function() {
        //     return { userId: 'abc' };
        // };
        //we don't use this bc it changes the global def of function
        authMiddleware(req, {}, () => {});
        expect(req).to.have.property('userId');
        expect(req).to.have.property('userId', 'abc');
        expect(jwt.verify.called).to.be.true;
        jwt.verify.restore();
    });

    it('should throw an error if the token cannot be verified', function() {
        const req = {
            get: function(headerName) {
                return 'Bearer xyz';
            }
        };
        expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
    });
});

