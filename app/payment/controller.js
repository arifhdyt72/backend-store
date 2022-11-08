const Payment = require('./model');
const Bank = require('../bank/model');

module.exports = {
    index: async(req, res) => {
        try{
            const alertMessage = req.flash("alertMessage");
            const alertStatus = req.flash("alertStatus");
            const alert = { message: alertMessage, status: alertStatus };
            let payment = await Payment.find();
            res.render('admin/payment/view_payment',{
                payment,
                alert
            });
        }catch(err){
            req.flash('alertMessage', `${err.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/payment');
        }
    },
    create: async(req, res) => {
        try{
            const banks = await Bank.find();
            res.render('admin/payment/create', { banks })
        }catch(err){
            req.flash('alertMessage', `${err.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/payment');
        }
    },
    actionCreate: async(req, res) => {
        try{
            const { banks, type } = req.body;
            let payment = await Payment({ banks, type });
            await payment.save();

            req.flash('alertMessage', 'Payment Type has been added');
            req.flash('alertStatus', 'success');

            res.redirect('/payment');
        }catch(err){
            req.flash('alertMessage', `${err.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/payment');
        }
    },
    // actionEdit: async(req, res) => {
    //     try{
    //         const { id } = req.params;
    //         let priceData = await Price.findOne({ _id: id });
    //         res.render('admin/price/edit',{
    //             priceData
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