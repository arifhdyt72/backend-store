const Voucher = require('../voucher/model');
const Category = require('../category/model');
const Price = require('../price/model');
const Payment = require('../payment/model');
const Bank = require('../bank/model');
const Transaction = require('../transaction/model');
const Player = require('../player/model');

const path = require('path');
const fs = require('fs');
const config = require('../../config');

module.exports = {
    landingPage: async(req, res) => {
        try{
            const voucher = await Voucher.find()
            .select('_id name thumbnail category status')
            .populate('category');

            res.status(200).json({ data: voucher });
        }catch(err){
            res.status(500).json({ message: err.message || 'INTERNAL SERVER ERROR'});
        }
    },
    detailPage: async(req, res) => {
        try{
            const { id } = req.params;
            const voucher = await Voucher.findOne({ _id: id })
            .populate('category')
            .populate('prices')
            .populate('user', '_id name phoneNumber');

            if(!voucher){
                return res.status(404).json({ message: 'Detail voucher not found.!' });
            }

            res.status(200).json({ data: voucher });
        }catch(err){
            res.status(500).json({ message: err.message || 'INTERNAL SERVER ERROR'});
        }
    },
    category: async(req, res) => {
        try{
            const category = await Category.find();
            res.status(200).json({ data: category });
        }catch(err){
            res.status(500).json({ message: err.message || 'INTERNAL SERVER ERROR'});
        }
    },
    checkout: async(req, res) => {
        try {
            const input = req.body;

            const res_voucher = await Voucher.findOne({ _id: input.voucher })
                .select('name category _id thumbnail user')
                .populate('category')
                .populate('user')
            if(!res_voucher) return res.status(404).json({ message: 'voucher not found.!'});

            const res_price = await Price.findOne({ _id: input.priceData });
            if(!res_price) return res.status(404).json({ message: 'price not found.!'});;

            const res_payment = await Payment.findOne({ _id: input.payment});
            if(!res_payment) return res.status(404).json({ message: 'payment not found.!'});

            const res_bank = await Bank.findOne({ _id: input.bank});
            if(!res_bank) return res.status(404).json({ message: 'bank not found.!'});

            let tax = (10 / 100) * res_price.price;
            let value = tax + res_price.price;

            const payload = {
                historyVoucherTopup: {
                    gameName: res_voucher.name,
                    category: res_voucher.category.name ? res_voucher.category.name : '',
                    thumbnail: res_voucher.thumbnail,
                    coinName: res_voucher.coinName,
                    coinQuantity: res_price.coinQuantity,
                    price: res_price.price,
                },
                historyPayment: {
                    name: res_bank.name,
                    type: res_payment.type,
                    bankName: res_bank.bankName,
                    accountNumber: res_payment.accountNumber,
                },
                name: input.name,
                accountUser: input.accountUser,
                tax: tax,
                value: value,
                player: req.player._id,
                histoyUser: {
                    name: res_voucher.user?._id,
                    phoneNumber: res_voucher.user?.phoneNumber
                },
                category: res_voucher.category?._id,
                user: res_voucher.user?._id
            }

            const transaction = new Transaction(payload);
            await transaction.save();

            res.status(201).json({ data: payload });

        } catch (err) {
            res.status(500).json({ message: err.message || 'INTERNAL SERVER ERROR'});
        }
    },
    history: async(req, res) => {
        try {
            const { status = '' } = req.query;
            let criteria = {};

            if(status.length){
                criteria = {
                    ...criteria,
                    status: { $regex: `${status}`, $options: 'i' }
                };
            }
            if(req.player._id){
                criteria = {
                    ...criteria,
                    player: req.player._id
                };
            }

            const history = await Transaction.find(criteria);
            let total = await Transaction.aggregate([
                { $match: criteria },
                {
                    $group: {
                        _id: null,
                        value: { $sum: "$value" }
                    }
                }
            ]);

            res.status(200).json({
                data: history,
                total: total.length ? total[0].value : 0
            });
        } catch (err) {
            res.status(500).json({ message: err.message || 'INTERNAL SERVER ERROR'});
        }
    },
    dashboard: async(req, res) => {
        try {
            const count = await Transaction.aggregate([
                { $match: { player: req.player._id }},
                {
                    $group: {
                        _id: '$category',
                        value: { $sum: '$value' }
                    }
                }
            ]);

            const category = await Category.find({});
            category.forEach(element => {
                count.forEach(data => {
                    if(data._id.toString() === element._id.toString()){
                        data.category = element.name;
                    }
                });
            });

            const history = await Transaction.find({ player: req.player._id })
                .populate('category')
                .sort({ 'updatedAt': -1 });

            res.status(200).json({ data: history, count: count });
        } catch (err) {
            res.status(500).json({ message: err.message || 'INTERNAL SERVER ERROR'});
        }
    },
    profile: async(req, res) => {
        try {
            const player = {
                id: req.player._id,
                username: req.player.username,
                email: req.player.email,
                name: req.player.name,
                phone_number: req.player.phoneNumber,
                avatar: req.player.avatar
            };
            res.status(200).json({ data: player });
        } catch (err) {
            res.status(500).json({ message: err.message || 'INTERNAL SERVER ERROR'});
        }
    },
    editProfile: async(req, res, next) => {
        try {
            const { email = "", name = "", username = "", phoneNumber = "" } = req.body;
            const payload = {};
            let player = await Player.findOne({ _id: req.player.id });

            if(email.length && player.email != email) payload.email = email;
            if(name.length) payload.name = name;
            if(username.length) payload.username = username;
            if(phoneNumber.length) payload.phoneNumber = phoneNumber;

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
                        let currentImage = `${config.rootPath}/public/uploads/avatar/${player.avatar}`;
                        if(fs.existsSync(currentImage)){
                            fs.unlinkSync(currentImage);
                        }

                        player = await Player.findOneAndUpdate({
                            _id: req.player._id
                        },{
                            ...payload,
                            avatar: filename
                        });

                        res.status(201).json({
                            data: {
                                id: player._id,
                                username: player.username,
                                email: player.email,
                                name: player.name,
                                phone_number: player.phoneNumber,
                                avatar: filename
                            }
                        });
                    }catch(err){
                        if(err && err.name == "ValidationError"){
                            res.status(422).json({
                                error: 1,
                                message: err.message,
                                fields: err.errors
                            });
                        }else{
                            res.status(500).json({ message: err.message || 'INTERNAL SERVER ERROR'});
                        }
                    }
                });
            }else{
                player = await Player.findOneAndUpdate({
                    _id: req.player._id,
                }, payload, {new: true, runValidators: true });
                
                res.status(201).json({
                    data: {
                        id: player._id,
                        username: player.username,
                        email: player.email,
                        name: player.name,
                        phone_number: player.phoneNumber,
                        avatar: player.avatar
                    }
                });
            }

        } catch (err) {
            if(err && err.name == "ValidationError"){
                res.status(422).json({
                    error: 1,
                    message: err.message,
                    fields: err.errors
                });
            }else{
                res.status(500).json({ message: err.message || 'INTERNAL SERVER ERROR'});
            }
        }
    }
}