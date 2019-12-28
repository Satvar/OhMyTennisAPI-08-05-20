"use strict";
const jwt = require("jsonwebtoken");
const APP_CONFIG = require("../config/appConfig");
const moment = require("moment");

class JwtLib {

    /**
     * jwt fetch token from header.
     */
    jwtFetch(req) {
        try {
            var tokens = req.headers["authorization"];
            if (tokens) {
                var tokenArray = tokens.split(" ");
                if (tokenArray && tokenArray.length > 1) {
                    return tokenArray[1].trim();
                }
            }
        } catch (e) {
            return null;
        }
    }

    /**
    * generate token.
    */
    generateToken(data) {
        var token;
        var options = { expiresIn: APP_CONFIG.EXPIRES };
        if (data.exp) {
            data.exp = APP_CONFIG.EXPIRES;
            data.UserID = data.name.trim().toLowerCase()
            token = jwt.sign(data, APP_CONFIG.JWT_SECRET_KEY);
        }
        else {
            token = jwt.sign(data, APP_CONFIG.JWT_SECRET_KEY, options);
        }
        
        return token;
        
    }

    /**
    * refresh token.
    */
    referehsToken(decoded) {
        try {
            var token_exp,
                now,
                newToken,
                expire;

            token_exp = decoded.exp;
            now = moment().unix().valueOf();
            expire = APP_CONFIG.EXPIRES;

            if ((token_exp - now) < expire) {
                var user = decoded;
                newToken = this.generateToken(user);
                if (newToken) {
                    return newToken;
                }
            } else {
                return null;
            }
        } catch (e) {
            return null;
        }
    }

    /**
    * verify token while error.
    */
    errorVerification(err, req, res, next) {
        try {
            var self = this;
            var token = self.jwtFetch(req);
            var options = { ignoreExpiration: false };

            if (token) {
                jwt.verify(token, APP_CONFIG.JWT_SECRET_KEY, options,
                    function (err, decoded) {
                        let userID = req.headers["ud"];
                        if (err || decoded.name != userID) {
                            return res.status(401).send("invalid token.");
                        }

                        let newToken = self.referehsToken(decoded);

                        if (newToken) {
                            res.set("Authorization", "Bearer " + newToken);
                            next();
                        } else {
                            res.set("Authorization", "Bearer " + token);
                            next();
                        }
                    });
            } else {
                return res.status(401).send("invalid token.");
            }
        } catch (e) {
            return res.status(401).send("invalid token.");
        }
    }

    /**
    * jwt token verfication.
    */
    authenticate(req, res, next) {
        try {
            var self = this;
            var token = self.jwtFetch(req);
            var options = { ignoreExpiration: false };

            if (token) {
                jwt.verify(token, APP_CONFIG.JWT_SECRET_KEY, options,
                    function (err, decoded) {
                        let userID = req.headers["ud"].toLowerCase();
                        if (err || decoded.UserID.toLowerCase() != userID) {
                            return res.status(401).send("invalid token.");
                        }

                        let newToken = self.referehsToken(decoded);

                        if (newToken) {
                            res.set("Authorization", "Bearer " + newToken);
                            next();
                        } else {
                            res.set("Authorization", "Bearer " + token);
                            next();
                        }
                    });
            }
            else {
                next();
            }
        } catch (e) {
            next();
        }
    }
}

module.exports = new JwtLib();