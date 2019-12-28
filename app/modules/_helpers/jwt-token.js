'use strict';
const fs = require('fs');
const jwt = require('jsonwebtoken');
const path = require('path');

const privateKEY_PATH = path.join(__dirname, '/certificates/oauth-private.key');
const publicKEY_PATH = path.join(__dirname, '/certificates/oauth-public.key');

// use 'utf8' to get string instead of byte array  (2048 bit key)
const privateKEY = fs.readFileSync(privateKEY_PATH, 'utf8');
const publicKEY = fs.readFileSync(publicKEY_PATH, 'utf8');

const $options = {
    issuer: 'i',
    subject: 's',
    audience: 'a_public_',
    expiresIn: '365d',
    algorithm: 'RS256',
    token_type: 'Bearer'
};

let auth;

const JWT = {
    sign: (payload) => {
        
        // Token signing options
        var signOptions = {
            issuer: $options.issuer,
            subject: $options.subject,
            audience: $options.audience,
            expiresIn: $options.expiresIn,
            algorithm: $options.algorithm
        };
        return jwt.sign(payload, privateKEY, signOptions);
    },
    verify: (token) => {
        
        var verifyOptions = {
            issuer: $options.issuer,
            subject: $options.subject,
            audience: $options.audience,
            expiresIn: $options.expiresIn,
            algorithm: [$options.algorithm]
        };
        try {
            return jwt.verify(token, publicKEY, verifyOptions);
        } catch (err) {
            return false;
        }
    },
    decode: (token) => {
        return jwt.decode(token, { complete: true });
        //returns null if token is invalid
    },
    getOauthToken: ($payload) => {
        $payload.token_type = $options.token_type;
        $payload.access_token = JWT.sign($payload);
        // $payload.expires_in = $options.expiresIn;
        return $payload;
    },
    setAuth: (token) => {
        const tokenData = JWT.decode(token);
        if (tokenData && tokenData.payload) {
            delete tokenData.payload.iat;
            delete tokenData.payload.exp;
            delete tokenData.payload.aud;
            delete tokenData.payload.iss;
            delete tokenData.payload.sub;
            delete tokenData.payload.token_type
            auth = tokenData.payload;
        }
    },
    getAuth: () => {
        return auth;
    },
    checkAuth: (req, res, next) => {
        if (req.headers["authorization"]) {
            const token = req.headers["authorization"].split(" ");
            if (JWT.verify(token[1]) === true || token[0] === 'Bearer') {
                JWT.setAuth(token[1]);
                next();
            } else {
                const response = {
                    code: 401,
                    status: 'error',
                    data: [],
                    message: 'Unauthorized'
                }
                return res.status(response.code).json(response);
            }
        } else if (req.headers["authorization"] === undefined) {
            next();
        }
    }
}
module.exports = JWT;