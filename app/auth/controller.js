const Player = require('../player/model');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../../config');

module.exports = {
    signup: async(req, res) => {
        try{
            const payload = req.body;
            if(req.file){
                let tmp_path = req.file.path;
                let originExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
                let filename = req.file.filename+'.'+originExt;
                let target_path = path.resolve(config.rootPath, `public/uploads/avatar/${filename}`);

                const src = fs.createReadStream(tmp_path);
                const dest = fs.createWriteStream(target_path);

                src.pipe(dest);

                src.on('end', async() => {
                    try{
                        const player = new Player({ ...payload, avatar: filename });

                        await player.save();
                        delete player._doc.password;

                        res.status(201).json({ data: player });
                    }catch(err){
                        if(err && err.name === "ValidationError"){
                            return res.status(422).json({
                                error: 1,
                                message: err.message,
                                fields: err.errors
                            });
                        }
                        next(err);
                    }
                });
            }else{
                let player = new Player(payload);
                await player.save();
                delete player._doc.password;

                res.status(201).json({ data: player });
            }
        }catch(err){
            if(err && err.name === "ValidationError"){
                return res.status(422).json({
                    error: 1,
                    message: err.message,
                    fields: err.errors
                });
            }
            next(err);
        }
    },
    signIn: (req, res, next) => {
        const { email, password} = req.body;
        Player.findOne({ email: email, status: 'Y' }).then((player) => {
            if(player){
                const checkPassword = bcrypt.compareSync(password, player.password);
                if(checkPassword){
                    const token = jwt.sign({
                        player: {
                            id: player._id,
                            username: player.username,
                            email: player.email,
                            name: player.name,
                            phoneNumber: player.phoneNumber,
                            avatar: player.avatar
                        }
                    }, config.SecretKey);
                    
                    res.status(200).json({
                        data: { token }
                    });
                }else{
                    res.status(403).json({
                        message: 'Your password is wrong!'
                    });
                }
            }else{
                res.status(403).json({
                    message: 'Email not registered!'
                });
            }
        }).catch((err) => {
            res.status(500).json({
                message: err.message || 'INTERNAL SERVER ERROR'
            });
        });
    }
}