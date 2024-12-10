
// this function accept (theFunction) as an parameter. accept karna ka bad use function ko return and
//  give the 3 parameter req,res,next then the accept as an promish and try to resolve. if the resolve it to run continuously
// else give the error and run the next 
const catchAsyncErrors =(theFunction)=>{
    return(req,res,next)=>{
        Promise.resolve(theFunction(req,res,next)).catch(next);
    }
}
module.exports = catchAsyncErrors;