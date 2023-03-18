export function deepCopy(object) {
    const objectCopy = JSON.parse(JSON.stringify(object))

    return objectCopy;
}
