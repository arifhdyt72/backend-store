const Voucher = require('./model');
const Category = require('../category/model');
const Price = require('../price/model');
const path = require('path');
const fs = require('fs');
const config = require('../../config');

module.exports = {
    index: async(req, res) => {
        try{
            const alertMessage = req.flash("alertMessage");
            const alertStatus = req.flash("alertStatus");
            const alert = { message: alertMessage, status: alertStatus };
            let voucher = await Voucher.find().populate('category').populate('prices');
            console.log(voucher);
            res.render('admin/voucher/view_voucher',{
                voucher,
                alert,
                name: req.session.user.name,
                title: 'Voucher Page'
            });
        }catch(err){
            req.flash('alertMessage', `${err.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/voucher');
        }
    },
    create: async(req, res) => {
        try{
            const price = await Price.find();
            const category = await Category.find();
            res.render('admin/voucher/create',{
                category,
                price,
                name: req.session.user.name,
                title: 'Create Voucher Page'
            });
        }catch(err){
            req.flash('alertMessage', `${err.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/price');
        }
    },
    actionCreate: async(req, res) => {
        try{
            const { game_name, category, prices } = req.body;

            if(req.file){
                let tmp_path = req.file.path;
                let originExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
                let filename = req.file.filename+'.'+originExt;
                let target_path = path.resolve(config.rootPath, `public/uploads/${filename}`);

                const src = fs.createReadStream(tmp_path);
                const dest = fs.createWriteStream(target_path);

                src.pipe(dest);

                src.on('end', async() => {
                    try{
                        const voucher = new Voucher({
                            name: game_name,
                            category,
                            prices,
                            thumbnail: filename
                        });

                        await voucher.save();

                        req.flash('alertMessage', 'Voucher has been added');
                        req.flash('alertStatus', 'success');
            
                        res.redirect('/voucher');
                    }catch(err){
                        req.flash('alertMessage', `${err.message}`);
                        req.flash('alertStatus', 'danger');
                        res.redirect('/voucher');
                    }
                });
            }else{
                const voucher = new Voucher({
                    name: game_name,
                    category,
                    prices
                });

                await voucher.save();

                req.flash('alertMessage', 'Voucher has been added');
                req.flash('alertStatus', 'success');
    
                res.redirect('/voucher');
            }
        }catch(err){
            req.flash('alertMessage', `${err.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/voucher');
        }
    },
    actionEdit: async(req, res) => {
        try{
            const { id } = req.params;
            const price = await Price.find();
            const category = await Category.find();
            let voucher = await Voucher.findOne({ _id: id })
            .populate('category')
            .populate('prices');
            res.render('admin/voucher/edit',{
                voucher,
                price,
                category,
                name: req.session.user.name,
                title: 'Edit Voucher Page'
            });
        }catch(err){
            req.flash('alertMessage', `${err.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/voucher');
        }
    },
    actionUpdate: async(req, res) => {
        try{
            const { id } = req.params;
            const { game_name, category, prices } = req.body;

            if(req.file){
                let tmp_path = req.file.path;
                let originExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
                let filename = req.file.filename+'.'+originExt;
                let target_path = path.resolve(config.rootPath, `public/uploads/${filename}`);

                const src = fs.createReadStream(tmp_path);
                const dest = fs.createWriteStream(target_path);

                src.pipe(dest);

                src.on('end', async() => {
                    try{
                        const voucher = await Voucher.findOne({ _id: id });
                        let currentImage = `${config.rootPath}/public/uploads/${voucher.thumbnail}`;
                        if(fs.existsSync(currentImage)){
                            fs.unlinkSync(currentImage);
                        }

                        await Voucher.findOneAndUpdate({
                            _id: id
                        },{
                            name: game_name,
                            category,
                            prices,
                            thumbnail: filename
                        });

                        req.flash('alertMessage', 'Voucher has been updated');
                        req.flash('alertStatus', 'success');
            
                        res.redirect('/voucher');
                    }catch(err){
                        req.flash('alertMessage', `${err.message}`);
                        req.flash('alertStatus', 'danger');
                        res.redirect('/voucher');
                    }
                });
            }else{
                await Voucher.findOneAndUpdate({
                    _id: id
                },{
                    name: game_name,
                    category,
                    prices
                });

                req.flash('alertMessage', 'Voucher has been updated');
                req.flash('alertStatus', 'success');
    
                res.redirect('/voucher');
            }
        }catch(err){
            req.flash('alertMessage', `${err.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/voucher');
        }
    },
    actionDelete: async(req, res) => {
        try{
            const { id } = req.params;
            const voucher = await Voucher.findOneAndRemove({ _id: id });
            let currentImage = `${config.rootPath}/public/uploads/${voucher.thumbnail}`;
            if(fs.existsSync(currentImage)){
                fs.unlinkSync(currentImage);
            }

            req.flash('alertMessage', 'Voucher has been deleted');
            req.flash('alertStatus', 'success');
            
            res.redirect('/voucher');
        }catch(err){
            req.flash('alertMessage', `${err.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/voucher');
        }
    },
    actionStatus: async(req, res) => {
        try{
            const { id } = req.params;
            let voucher = await Voucher.findOne({ _id: id });

            let status = voucher.status === 'Y' ? 'N' : 'Y';
            voucher = await Voucher.findOneAndUpdate({ 
                _id: id
            },{
                status
            });

            req.flash('alertMessage', 'Voucher status has been updated');
            req.flash('alertStatus', 'success');
            res.redirect('/voucher');

        }catch(err){
            req.flash('alertMessage', `${err.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/voucher');
        }
    }
}