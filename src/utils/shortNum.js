function shortNumber(number) {
    if(!number) return '0';
    const arr = number.toString().split('')
    if(arr.length < 4)return n
    if(arr.length < 7)return n.splice(0,1) + "k"
    if(arr.length < 10){
        if(arr.length === 9)return arr.splice(0,2) + "b"
        if(arr.length === 8)return arr.splice(0,1) + "." + arr[2] + "m"
        return arr.splice(0,3) + "m"
    }
    return arr.reverse().map((n, i, arr)=>{
        
        n = Number(n);
        if(i===arr.length-1 || i===arr.length-2)return n
        if(n >=5){
            arr[i+1] = Number(arr[i+1])+1;
            console.log(arr)
        }
        return 0
    }).reverse().join('')
}

console.log(shortNumber(55555555)) 
// should become 120000000000