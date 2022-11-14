const Bank = require('./model');

module.exports = {
    index: async(req, res) => {
        try{
            const alertMessage = req.flash("alertMessage");
            const alertStatus = req.flash("alertStatus");
            const alert = { message: alertMessage, status: alertStatus };
            let bank = await Bank.find();
            res.render('admin/bank/view_bank',{
                bank,
                alert,
                name: req.session.user.name,
                title: 'Bank Page'
            });
        }catch(err){
            req.flash('alertMessage', `${err.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/bank');
        }
    },
    create: async(req, res) => {
        try{
            res.render('admin/bank/create',{
                name: req.session.user.name,
                title: 'Create Bank Page'
            })
        }catch(err){
            req.flash('alertMessage', `${err.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/bank');
        }
    },
    actionCreate: async(req, res) => {
        try{
            const { name, bankName, accountNumber } = req.body;
            let bankAction = await Bank({ name, bankName, accountNumber });
            await bankAction.save();

            req.flash('alertMessage', 'Bank has been added');
            req.flash('alertStatus', 'success');

            res.redirect('/bank');
        }catch(err){
            req.flash('alertMessage', `${err.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/bank');
        }
    },
    actionEdit: async(req, res) => {
        try{
            const { id } = req.params;
            let bank = await Bank.findOne({ _id: id });
            res.render('admin/bank/edit',{
                bank,
                name: req.session.user.name,
                title: 'Edit Bank Page'
            });
        }catch(err){
            req.flash('alertMessage', `${err.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/bank');
        }
    },
    actionUpdate: async(req, res) => {
        try{
            const { id } = req.params;
            const { name, bankName, accountNumber } = req.body;
            await Bank.findOneAndUpdate({
                _id: id
            },{
                name,
                bankName,
                accountNumber
            });

            req.flash('alertMessage', 'Bank has been updated');
            req.flash('alertStatus', 'success');

            res.redirect('/bank');
        }catch(err){
            req.flash('alertMessage', `${err.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/bank');
        }
    },
    actionDelete: async(req, res) => {
        try{
            const { id } = req.params;
            await Bank.findOneAndRemove({ _id: id });

            req.flash('alertMessage', 'Bank has been deleted');
            req.flash('alertStatus', 'success');
            
            res.redirect('/bank');
        }catch(err){
            req.flash('alertMessage', `${err.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/bank');
        }
    }
}