export async function checkAuth(req,res,next) {
    if(!req.user){
        req.status(401).json({message: "Unauthorized"});
        return;
    }
    req.status(200).json(req.user);
    
}