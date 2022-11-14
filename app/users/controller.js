module.exports = {
    index: async(req, res) => {
        try{
            const alertMessage = req.flash("alertMessage");
            const alertStatus = req.flash("alertStatus");
            const alert = { message: alertMessage, status: alertStatus };
            res.render('admin/users/view_signin',{
                alert
            });
        }catch(err){
            req.flash('alertMessage', `${err.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/');
        }
    }
    // create: async(req, res) => {
    //     try{
    //         res.render('admin/price/create')
    //     }catch(err){
    //         req.flash('alertMessage', `${err.message}`);
    //         req.flash('alertStatus', 'danger');
    //         res.redirect('/price');
    //     }
    // }
}