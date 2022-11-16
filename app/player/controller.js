const Player = require('./model');
const path = require('path');
const fs = require('fs');
const config = require('../../config');

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
            const { name, username, email, phoneNumber } = req.body;
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
                        const player = new Player({
                            name,
                            username,
                            email,
                            avatar: filename
                        });

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
                const player = new Player({
                    name,
                    username,
                    email
                });

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
    // actionEdit: async(req, res) => {
    //     try{
    //         const { id } = req.params;
    //         let priceData = await Price.findOne({ _id: id });
    //         res.render('admin/price/edit',{
    //             priceData,
    //             name: req.session.user.name,
    //             title: 'Edit Price Page'
    //         });
    //     }catch(err){
    //         req.flash('alertMessage', `${err.message}`);
    //         req.flash('alertStatus', 'danger');
    //         res.redirect('/price');
    //     }
    // },
    // actionUpdate: async(req, res) => {
    //     try{
    //         const { id } = req.params;
    //         const { coinName, coinQuantity, price } = req.body;
    //         await Price.findOneAndUpdate({
    //             _id: id
    //         },{
    //             coinQuantity: coinQuantity,
    //             coinName: coinName,
    //             price: price
    //         });

    //         req.flash('alertMessage', 'Price has been updated');
    //         req.flash('alertStatus', 'success');

    //         res.redirect('/price');
    //     }catch(err){
    //         req.flash('alertMessage', `${err.message}`);
    //         req.flash('alertStatus', 'danger');
    //         res.redirect('/price');
    //     }
    // },
    // actionDelete: async(req, res) => {
    //     try{
    //         const { id } = req.params;
    //         await Price.findOneAndRemove({ _id: id });

    //         req.flash('alertMessage', 'Price has been deleted');
    //         req.flash('alertStatus', 'success');
            
    //         res.redirect('/price');
    //     }catch(err){
    //         req.flash('alertMessage', `${err.message}`);
    //         req.flash('alertStatus', 'danger');
    //         res.redirect('/price');
    //     }
    // }
}