export async function checkAuth(req,res,next) {
    if(!req.user){
        return req.status(401).json({message: "Unauthorized"});
    }
    req.status(200).json(req.user);
    
}