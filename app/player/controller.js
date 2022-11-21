const Player = require('./model');
const Voucher = require('../voucher/model');
const path = require('path');
const fs = require('fs');
const config = require('../../config');
const bcrypt = require('bcryptjs');

const HASH_ROUND = 10;

module.exports = {
    index: async(req, res) => {
        try{
            const alertMessage = req.flash("alertMessage");
            const alertStatus = req.flash("alertStatus");
            const alert = { message: alertMessage, status: alertStatus };
            let player = await Player.find();
            res.render('admin/player/view_player',{
                player,
                alert,
                name: req.session.user.name,
                title: 'Player Page'
            });
        }catch(err){
            req.flash('alertMessage', `${err.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/player');
        }
    },
    create: async(req, res) => {
        try{
            res.render('admin/player/create', {
                name: req.session.user.name,
                title: 'Create Player Page'
            });
        }catch(err){
            req.flash('alertMessage', `${err.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/player');
        }
    },
    actionCreate: async(req, res) => {
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
                        const player = new Player({ ...payload, avatar: filename});

                        await player.save();

                        req.flash('alertMessage', 'Player has been added');
                        req.flash('alertStatus', 'success');
            
                        res.redirect('/player');
                    }catch(err){
                        req.flash('alertMessage', `${err.message}`);
                        req.flash('alertStatus', 'danger');
                        res.redirect('/player');
                    }
                });
            }else{
                const player = new Player({ ...payload });

                await player.save();

                req.flash('alertMessage', 'Player has been added');
                req.flash('alertStatus', 'success');
    
                res.redirect('/player');
            }
        }catch(err){
            req.flash('alertMessage', `${err.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/player');
        }
    },
    actionEdit: async(req, res) => {
        try{
            const { id } = req.params;
            let player = await Player.findOne({ _id: id });
            res.render('admin/player/edit',{
                player,
                name: req.session.user.name,
                title: 'Edit Player Page'
            });
        }catch(err){
            req.flash('alertMessage', `${err.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/player');
        }
    },
    actionUpdate: async(req, res) => {
        try{
            const { id } = req.params;
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
                        const player = await Player.findOne({ _id: id });
                        let currentImage = `${config.rootPath}/public/uploads/avatar/${player.avatar}`;
                        if(fs.existsSync(currentImage)){
                            fs.unlinkSync(currentImage);
                        }

                        if(payload.password === ""){
                            await Player.findOneAndUpdate({
                                _id: id
                            },{
                                name: payload.name,
                                username: payload.username,
                                email: payload.email,
                                phoneNumber: payload.phoneNumber,
                                avatar: filename,
                            });
                        }else{
                            payload.password = bcrypt.hashSync(payload.password, HASH_ROUND);
                            await Player.findOneAndUpdate({
                                _id: id
                            },{ ...payload, avatar: filename });
                        }

                        req.flash('alertMessage', 'Player has been updated');
                        req.flash('alertStatus', 'success');
            
                        res.redirect('/player');
                    }catch(err){
                        req.flash('alertMessage', `${err.message}`);
                        req.flash('alertStatus', 'danger');
                        res.redirect('/player');
                    }
                });
            }else{
                if(payload.password === ""){
                    await Player.findOneAndUpdate({
                        _id: id
                    },{
                        name: payload.name,
                        username: payload.username,
                        email: payload.email,
                        phoneNumber: payload.phoneNumber,
                    });
                }else{
                    payload.password = bcrypt.hashSync(payload.password, HASH_ROUND);
                    await Player.findOneAndUpdate({
                        _id: id
                    },{ ...payload });
                }

                req.flash('alertMessage', 'Player has been updated');
                req.flash('alertStatus', 'success');
    
                res.redirect('/player');
            }
        }catch(err){
            req.flash('alertMessage', `${err.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/player');
        }
    },
    actionDelete: async(req, res) => {
        try{
            const { id } = req.params;
            const player = await Player.findOneAndRemove({ _id: id });
            
            let currentImage = `${config.rootPath}/public/uploads/avatar/${player.avatar}`;
            if(fs.existsSync(currentImage)){
                fs.unlinkSync(currentImage);
            }

            req.flash('alertMessage', 'Player has been deleted');
            req.flash('alertStatus', 'success');
            res.redirect('/player');
        }catch(err){
            req.flash('alertMessage', `${err.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/player');
        }
    },
    actionStatus: async(req, res) => {
        try{
            const { id } = req.params;
            let player = await Player.findOne({ _id: id });

            let status = player.status === 'Y' ? 'N' : 'Y';
            player = await Player.findOneAndUpdate({ 
                _id: id
            },{
                status
            });

            req.flash('alertMessage', 'Player status has been updated');
            req.flash('alertStatus', 'success');
            res.redirect('/player');

        }catch(err){
            req.flash('alertMessage', `${err.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/player');
        }
    }
}