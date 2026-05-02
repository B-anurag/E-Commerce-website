import product from '../models/product.js';

//create a new product

export const createProduct = async (req, res) => {
    try{
        const newProduct = await product.create(req.body);
        res.json({ message: " Product created successfully ", product: newProduct });
    }catch(error){
        res.status(500).json({ message: " Server error ", error });
    }
};

//get all products

export const getProducts = async (req, res) => {
    try{
        const {search, category} = req.query;
        
        let filter = {};

        if (search) {
            filter.title = { $regex: search, $options: 'i' };
        }
        if (category) {
            filter.category = category;
        }
        const products = await product.find(filter).sort({ createdAt : -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: " Server error ", error });
    }
}

// Update a product

export const updateProduct = async (req, res) => {
    try{
        const updated = await product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json({
            message: " Product updated successfully ",
            product: updated
        });
    } catch(error){
        res.status(500).json({ message: " Server error ", error });
    }
}

// Delete a product
export const deleteProduct = async (req, res) => {
    try{
        await product.findByIdAndDelete(req.params.id);
        res.json({ message: " Product deleted successfully " });

    } catch(error){
        res.status(500).json({ message: " Server error ", error });
    }
}