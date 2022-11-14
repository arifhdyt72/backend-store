const Category = require('./model');

module.exports = {
    index: async(req, res) => {
        try{
            const alertMessage = req.flash("alertMessage");
            const alertStatus = req.flash("alertStatus");
            const alert = { message: alertMessage, status: alertStatus };
            let category = await Category.find();
            console.log(category);
            res.render('admin/category/view_category',{
                category,
                alert,
                name: req.session.user.name,
                title: 'Category Page'
            });
        }catch(err){
            req.flash('alertMessage', `${err.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/category');
        }
    },
    create: async(req, res) => {
        try{
            res.render('admin/category/create',{
                name: req.session.user.name,
                title: 'Create Category Page'
            })
        }catch(err){
            req.flash('alertMessage', `${err.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/category');
        }
    },
    actionCreate: async(req, res) => {
        try{
            const { categoryName } = req.body;
            let category = await Category({ name: categoryName });
            await category.save();

            req.flash('alertMessage', 'Category has been added');
            req.flash('alertStatus', 'success');

            res.redirect('/category');
        }catch(err){
            req.flash('alertMessage', `${err.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/category');
        }
    },
    actionEdit: async(req, res) => {
        try{
            const { id } = req.params;
            let category = await Category.findOne({ _id: id });
            res.render('admin/category/edit',{
                category,
                name: req.session.user.name,
                title: 'Edit Category Page'
            });
        }catch(err){
            req.flash('alertMessage', `${err.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/category');
        }
    },
    actionUpdate: async(req, res) => {
        try{
            const { id } = req.params;
            const { categoryName } = req.body;
            await Category.findOneAndUpdate({
                _id: id
            },{
                name: categoryName
            });

            req.flash('alertMessage', 'Category has been updated');
            req.flash('alertStatus', 'success');

            res.redirect('/category');
        }catch(err){
            req.flash('alertMessage', `${err.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/category');
        }
    },
    actionDelete: async(req, res) => {
        try{
            const { id } = req.params;
            await Category.findOneAndRemove({ _id: id });

            req.flash('alertMessage', 'Category has been deleted');
            req.flash('alertStatus', 'success');
            
            res.redirect('/category');
        }catch(err){
            req.flash('alertMessage', `${err.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/category');
        }
    }
}