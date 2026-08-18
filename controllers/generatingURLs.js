const express = require("express") ;
const client = require("../data/rdConnection") ;
const longURLs = require("../data/longURLs") ;


const GenerateURLs = () => {
      try {
            const crypto = require('crypto');

            const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

            let result = '';

              for (let i = 0; i < 8; i++) {
                  result += chars[crypto.randomInt(chars.length)];
             }

            const ShortURL = result ;

            return ShortURL ;
      } catch (err) {
            console.log(`Sir We have an error in GeneratingURLs : ${err}`) ;
      }
} ;

module.exports = GenerateURLs ;