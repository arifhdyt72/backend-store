const Voucher = require('../voucher/model');
const Category = require('../category/model');

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
    }
}