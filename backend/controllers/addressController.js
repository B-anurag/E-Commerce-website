import Address from '../models/Address.js';

//save address
export const saveAddress = async (req, res) => {
    try{
        const address = await Address.create(req.body);
        res.json({message: "Address saved successfully", address});
    } catch(error){
        res.status(500).json({message: "Failed to save address", error: error.message});
    }
}

//GEt addresses by User Id
 export const getAddresses = async ( req, res) => {
    try{
        const addresses = await Address.find({userId: req.params.userId});
        res.json({message: "Addresses fetched successfully", addresses});
    } catch(error){
        res.status(500).json({message: "Failed to fetch addresses", error: error.message});
    }
 }