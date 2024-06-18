// either use try/catch or async await or use promise everywhere

module.exports = (func) => (req,res,next) =>{
    Promise.resolve(func(req,res,next)).catch()
}