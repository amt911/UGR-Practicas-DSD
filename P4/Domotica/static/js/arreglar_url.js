function arreglarURL(url){
    let arr=url.split("/");
    arr.length=3;
    
    return arr.join("/")
}