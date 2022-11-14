const Price = require('./model');

module.exports = {
    index: async(req, res) => {
        try{
            const alertMessage = req.flash("alertMessage");
            const alertStatus = req.flash("alertStatus");
            const alert = { message: alertMessage, status: alertStatus };
            let price = await Price.find();
            res.render('admin/price/view_price',{
                price,
                alert,
                name: req.session.user.name,
                title: 'Price Page'
            });
        }catch(err){
            req.flash('alertMessage', `${err.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/price');
        }
    },
    create: async(req, res) => {
        try{
            res.render('admin/price/create', {
                name: req.session.user.name,
                title: 'Create Price Page'
            });
        }catch(err){
            req.flash('alertMessage', `${err.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/price');
        }
    },
    actionCreate: async(req, res) => {
        try{
            const { coinName, coinQuantity, price } = req.body;
            let priceAction = await Price({ coinQuantity, coinName, price });
            await priceAction.save();

            req.flash('alertMessage', 'Price has been added');
            req.flash('alertStatus', 'success');

            res.redirect('/price');
        }catch(err){
            req.flash('alertMessage', `${err.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/price');
        }
    },
    actionEdit: async(req, res) => {
        try{
            const { id } = req.params;
            let priceData = await Price.findOne({ _id: id });
            res.render('admin/price/edit',{
                priceData,
                name: req.session.user.name,
                title: 'Edit Price Page'
            });
        }catch(err){
            req.flash('alertMessage', `${err.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/price');
        }
    },
    actionUpdate: async(req, res) => {
        try{
            const { id } = req.params;
            const { coinName, coinQuantity, price } = req.body;
            await Price.findOneAndUpdate({
                _id: id
            },{
                coinQuantity: coinQuantity,
                coinName: coinName,
                price: price
            });

            req.flash('alertMessage', 'Price has been updated');
            req.flash('alertStatus', 'success');

            res.redirect('/price');
        }catch(err){
            req.flash('alertMessage', `${err.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/price');
        }
    },
    actionDelete: async(req, res) => {
        try{
            const { id } = req.params;
            await Price.findOneAndRemove({ _id: id });

            req.flash('alertMessage', 'Price has been deleted');
            req.flash('alertStatus', 'success');
            
            res.redirect('/price');
        }catch(err){
            req.flash('alertMessage', `${err.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/price');
        }
    }
}