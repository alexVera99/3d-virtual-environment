export function deepCopy(object) {
    const objectCopy = JSON.parse(JSON.stringify(object))

    return objectCopy;
}

export function clamp(v,min,max) {
    return (v < min ? min : (v > max ? max : v)); 
}
