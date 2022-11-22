import { body, check } from 'express-validator';

export const validate = (method) => {
  switch (method) {
    case 'movies': {
     return [ 
        check('size', 'Invalid size').exists().isInt({ min: 1, max: 20 })
        ]   
     }
    case 'register': {
     return [ 
        body('email', 'Invalid email').exists().isEmail(),
        body('password', 'Invalid password').exists().isLength({ min: 6 })
       ]   
    }
    case 'login': {
        return [ 
            body('email', 'Invalid email').exists().isEmail(),
            body('password', 'Invalid password').exists().isLength({ min: 6 })
        ]  
    }
    case 'rate': {
        return [ 
            body('score', 'Invalid score').exists().isInt({ min: 1, max: 10 }),
            body('note', 'Invalid note').exists()
        ]  
    }
    case 'suggest': {
        return [ 
            body('email', 'Invalid email').exists().isEmail(),
        ]  
    }
  }
}