const adminAuth = (req,res,next) => {
    console.log("Admin auth is getting checked");
    const token = "xyz";
    const isAdminAutherized = token === "xyz";
    if(!isAdminAutherized){
        res.status(404).send("Admin not autherized");
    }else{
        next();
    }
};
const userAuth = (req,res,next) => {
    console.log("User auth is getting checked");
    const token = "xyz";
    const isAdminAutherized = token === "xyz";
    if(!isAdminAutherized){
        res.status(404).send("User not autherized");
    }else{
        next();
    }
};
module.exports = { adminAuth, userAuth };