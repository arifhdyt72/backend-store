const Category = require('./model');

module.exports = {
    index: async(req, res) => {
        try{
            let category = await Category.find();
            console.log(category);
            res.render('admin/category/view_category',{
                category
            });
        }catch(err){
            console.log(err);
        }
    },
    create: async(req, res) => {
        try{
            res.render('admin/category/create')
        }catch(err){
            console.log(err);
        }
    },
    actionCreate: async(req, res) => {
        try{
            const { categoryName } = req.body;
            let category = await Category({ name: categoryName });
            await category.save();

            res.redirect('/category');
        }catch(err){
            console.log(err);
        }
    },
    actionEdit: async(req, res) => {
        try{
            const { id } = req.params;
            let category = await Category.findOne({ _id: id });
            res.render('admin/category/edit',{
                category
            });
        }catch(err){
            console.log(err);
        }
    },
    actionUpdate: async(req, res) => {
        try{
            const { id } = req.params;
            const { categoryName } = req.body;
            let category = await Category.findOneAndUpdate({
                _id: id
            },{
                name: categoryName
            });

            res.redirect('/category');
        }catch(err){
            console.log(err);
        }
    },
    actionDelete: async(req, res) => {
        try{
            const { id } = req.params;
            const category = await Category.findOneAndRemove({ _id: id });
            
            res.redirect('/category');
        }catch(err){
            console.log(err);
        }
    }
}